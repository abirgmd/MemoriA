import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8082/api';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, request).pipe(
      tap(res => this.saveUser(res))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/register`, request).pipe(
      tap(res => this.saveUser(res))
    );
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/users/role/${role}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API}/users/${id}`);
  }

  logout(): void {
    localStorage.removeItem('memoria_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUser?.token ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  private saveUser(user: AuthResponse): void {
    localStorage.setItem('memoria_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUser(): AuthResponse | null {
    const stored = localStorage.getItem('memoria_user');
    return stored ? JSON.parse(stored) : null;
  }
}
