import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly jwtKey = 'jwt';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly authUserKey = 'memoria_auth_user';

  getToken(): string | null {
    return localStorage.getItem(this.jwtKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.jwtKey, token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  clearSession(): void {
    localStorage.removeItem(this.jwtKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.authUserKey);
  }

  getRole(): string | null {
    const payload = this.getJwtPayload();
    const jwtRole = payload?.role ?? payload?.authorities?.[0] ?? payload?.roles?.[0];
    if (jwtRole) {
      return String(jwtRole).replace(/^ROLE_/, '').toUpperCase();
    }

    const user = this.getStoredUser();
    return user?.role ? String(user.role).toUpperCase() : null;
  }

  getUserId(): number | null {
    const payload = this.getJwtPayload();
    const rawId = payload?.id ?? payload?.userId ?? payload?.uid ?? payload?.sub;
    const parsedId = Number(rawId);
    if (!Number.isNaN(parsedId) && Number.isFinite(parsedId)) {
      return parsedId;
    }

    const user = this.getStoredUser();
    const fallbackId = Number(user?.id);
    return Number.isNaN(fallbackId) ? null : fallbackId;
  }

  /**
   * Retourne true si le token est absent ou expiré.
   */
  isTokenExpired(bufferSeconds = 30): boolean {
    const payload = this.getJwtPayload();
    if (!payload?.exp) {
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return Number(payload.exp) <= nowInSeconds + bufferSeconds;
  }

  hasValidAccessToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  isLoggedIn(): boolean {
    return this.hasValidAccessToken() || !!this.getStoredUser();
  }

  private getJwtPayload(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        return null;
      }

      // Base64URL -> Base64
      const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padLength = (4 - (normalized.length % 4)) % 4;
      const padded = normalized + '='.repeat(padLength);

      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  private getStoredUser(): any | null {
    const raw = localStorage.getItem(this.authUserKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
