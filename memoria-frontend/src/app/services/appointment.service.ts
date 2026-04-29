import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentRequest } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly API = 'http://localhost:8082/api/appointments';

  constructor(private http: HttpClient) {}

  create(dto: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.API, dto);
  }

  findById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.API}/${id}`);
  }

  findByDoctorId(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/doctor/${doctorId}`);
  }

  findByPatientId(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/patient/${patientId}`);
  }

  findUpcomingByPatientId(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/patient/${patientId}/upcoming`);
  }

  update(id: number, dto: AppointmentRequest): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.API}/${id}/status`, { status });
  }
}
