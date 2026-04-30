import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser, LoginRequest } from './auth.model';
import { SignupRequest } from '../models/signup.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'memoria_auth_user';

  constructor(private readonly http: HttpClient) {}

  private get apiUrl(): string {
    return `${environment.apiUrl}/api/auth`;
  }

  login(payload: LoginRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, payload).pipe(
      tap((user) => this.setCurrentUser(user))
    );
  }

  signup(payload: SignupRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/signup`, payload);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  getUserRole(): 'DOCTOR' | 'CAREGIVER' | 'PATIENT' {
    const role = this.getCurrentUser()?.role?.toUpperCase() ?? 'PATIENT';
    if (role === 'DOCTOR' || role === 'SOIGNANT') {
      return 'DOCTOR';
    }
    if (role === 'CAREGIVER' || role === 'ACCOMPAGNANT') {
      return 'CAREGIVER';
    }
    return 'PATIENT';
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role?.toUpperCase() === 'ADMINISTRATEUR';
  }

  getCurrentUserEmail(): string {
    return this.getCurrentUser()?.email ?? '';
  }

  markProfileCompleted(): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return;
    }
    this.setCurrentUser({ ...currentUser, profileCompleted: true });
  }

  private setCurrentUser(user: AuthUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
}
