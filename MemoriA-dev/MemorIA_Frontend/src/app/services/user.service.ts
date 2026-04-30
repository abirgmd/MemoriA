import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPayload, UserResponse } from '../models/user.model';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  private get apiUrl(): string {
    return `${environment.apiUrl}/api/users`;
  }

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl, { headers: this.adminHeaders() });
  }

  createUser(payload: UserPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, payload);
  }

  updateUser(id: number, payload: UserPayload): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, payload, { headers: this.adminHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.adminHeaders() });
  }

  confirmUser(id: number): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/${id}/confirm`, {}, { headers: this.adminHeaders() });
  }

  private adminHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Admin-Email': this.authService.getCurrentUserEmail()
    });
  }
}
