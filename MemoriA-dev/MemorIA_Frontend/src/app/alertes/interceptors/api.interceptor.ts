import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpBackend
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject, timer } from 'rxjs';
import { catchError, filter, take, switchMap, retry, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

/**
 * HTTP Interceptor - gestion robuste auth + erreurs globales.
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private readonly rawHttp: HttpClient;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    httpBackend: HttpBackend
  ) {
    // HttpClient sans interception pour l'appel refresh
    this.rawHttp = new HttpClient(httpBackend);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getToken();
    const hasToken = !!accessToken;
    const tokenExpired = hasToken ? this.authService.isTokenExpired() : false;

    if (hasToken && tokenExpired && !this.isRefreshEndpoint(req.url)) {
      console.warn('[ApiInterceptor] Access token expired before request, trying refresh', { url: req.url });
      return this.tryRefreshAndReplay(req, next);
    }

    const preparedReq = this.withAuthHeaders(req, accessToken);

    return next.handle(preparedReq).pipe(
      retry({
        count: 1,
        delay: (error: HttpErrorResponse) => {
          const isRetriable = error.status === 0 || error.status === 502 || error.status === 503 || error.status === 504;
          return isRetriable ? timer(1000) : throwError(() => error);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
          console.warn('[ApiInterceptor] 401 received', {
            url: req.url,
            hasToken,
            tokenExpired: hasToken ? this.authService.isTokenExpired() : null
          });
          return this.handle401Error(req, next);
        }

        if (error.status === 403) {
          console.warn('[ApiInterceptor] Access forbidden (403)', { url: req.url });
        }

        return throwError(() => error);
      })
    );
  }

  private withAuthHeaders(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    const setHeaders: Record<string, string> = {};

    if (token && !this.authService.isTokenExpired()) {
      setHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Important: backend Alert lit aussi ces en-têtes quand JWT absent en dev.
    const userId = this.authService.getUserId();
    const userRole = this.authService.getRole();

    if (userId !== null) {
      setHeaders['X-User-Id'] = String(userId);
    }
    if (userRole) {
      setHeaders['X-User-Role'] = userRole;
    }

    // Ne pas forcer content-type quand FormData.
    if (!(req.body instanceof FormData)) {
      setHeaders['Content-Type'] = 'application/json';
    }

    return Object.keys(setHeaders).length ? req.clone({ setHeaders }) : req;
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.tryRefreshAndReplay(req, next);
  }

  private tryRefreshAndReplay(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.authService.getRefreshToken();

    if (!refreshToken) {
      this.finishExpiredSession('No refresh token available');
      return throwError(() => new Error('SESSION_EXPIRED'));
    }

    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => !!token),
        take(1),
        switchMap((newToken) => next.handle(this.withAuthHeaders(req, newToken)))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.rawHttp.post<{ accessToken: string; refreshToken?: string }>(
      'http://localhost:8089/api/auth/refresh',
      { refreshToken }
    ).pipe(
      tap((response) => {
        this.authService.setToken(response.accessToken);
        if (response.refreshToken) {
          this.authService.setRefreshToken(response.refreshToken);
        }
        this.refreshTokenSubject.next(response.accessToken);
        console.info('[ApiInterceptor] Token refreshed successfully');
      }),
      switchMap((response) => next.handle(this.withAuthHeaders(req, response.accessToken))),
      catchError((refreshError) => {
        console.warn('[ApiInterceptor] Refresh token failed', refreshError);
        this.finishExpiredSession('Refresh token failed');
        return throwError(() => refreshError);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private finishExpiredSession(reason: string): void {
    console.warn('[ApiInterceptor] Session expired', { reason });
    this.authService.clearSession();

    // Signal utilisateur global (toast éventuel côté app shell/login).
    const message = 'Session expiree, veuillez vous reconnecter.';
    sessionStorage.setItem('memoria_auth_message', message);
    window.dispatchEvent(new CustomEvent('memoria-toast', {
      detail: { type: 'warning', message }
    }));

    this.router.navigate(['/login'], {
      queryParams: { reason: 'session-expired' }
    }).catch(() => {
      // Eviter un crash si la navigation échoue.
      console.warn('[ApiInterceptor] Redirect to login failed');
    });
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/api/auth/login') || url.includes('/api/auth/signup') || url.includes('/api/auth/refresh');
  }

  private isRefreshEndpoint(url: string): boolean {
    return url.includes('/api/auth/refresh');
  }
}

export const apiInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ApiInterceptor,
  multi: true
};
