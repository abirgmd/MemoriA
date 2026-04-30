import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { PatientSignupData } from '../models/signup.model';
import { Patient } from '../models/patient.model';
import { environment } from '../../environments/environment';

export interface CurrentUserPatientDto {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  stage: string;
  adherencePercentage: number;
  photoUrl?: string | null;
  initials?: string | null;
  numberOfAlerts?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private readonly http: HttpClient) {}

  private get apiUrl(): string {
    return `${environment.apiUrl}/api/patients`;
  }

  getProfile(userId: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/profile/${userId}`);
  }

  saveProfile(userId: number, payload: PatientSignupData): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/profile/${userId}`, payload);
  }

  uploadMedicalFile(patientId: number, file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<unknown>(`${this.apiUrl}/${patientId}/dossier-medical`, formData);
  }

  getMyPatients(): Observable<Patient[]> {
    return this.http.get<CurrentUserPatientDto[]>(`${this.apiUrl}/current-user`).pipe(
      map((rows) => (rows ?? []).map((row) => this.mapCurrentUserPatient(row)))
    );
  }

  /**
   * Ancienne methode conservee (compatibilite).
   */
  getPatientsWithMetrics(doctorId: number | undefined): Observable<Patient[]> {
    if (!doctorId) {
      return of([]);
    }
    return this.getMyPatients();
  }

  private mapCurrentUserPatient(dto: CurrentUserPatientDto): Patient {
    const prenom = dto.firstName ?? '';
    const nom = dto.lastName ?? '';
    return {
      id: dto.id,
      nom,
      prenom,
      age: dto.age ?? 0,
      photo: dto.photoUrl ?? undefined,
      initials: (dto.initials && dto.initials.trim())
        ? dto.initials.trim().toUpperCase()
        : `${prenom[0] ?? ''}${nom[0] ?? ''}`.toUpperCase(),
      stage: this.normalizeStage(dto.stage),
      adherenceRate: dto.adherencePercentage ?? 0,
      actif: true,
      numberOfAlerts: dto.numberOfAlerts ?? 0
    };
  }

  private normalizeStage(raw: string | undefined): 'LEGER' | 'MODERE' | 'AVANCE' {
    const stage = (raw ?? '').toUpperCase();
    if (stage === 'MODERATE' || stage === 'MODERE') {
      return 'MODERE';
    }
    if (stage === 'ADVANCED' || stage === 'AVANCE') {
      return 'AVANCE';
    }
    return 'LEGER';
  }
}
