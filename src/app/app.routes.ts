import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';
import { RapportComponent } from './rapport/rapport.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { adminGuard } from './auth/admin.guard';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';
import { ProfilePatientComponent } from './profile-patient/profile-patient.component';
import { ProfileSoignantComponent } from './profile-soignant/profile-soignant.component';
import { ProfileAccompagnantComponent } from './profile-accompagnant/profile-accompagnant.component';
import { DashboardDiagnosticComponent } from './dashboard-diagnostic/dashboard-diagnostic.component';
import { StastiqueDiagnosticComponent } from './stastique-diagnostic/stastique-diagnostic.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { MedicalRecordFormComponent } from './medical-record-form/medical-record-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'diagnostic', component: DiagnosticComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'rapport', component: RapportComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
  { path: 'dashboard_diagnostic', component: DashboardDiagnosticComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'statistiques', component: StastiqueDiagnosticComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'profile/patient', component: ProfilePatientComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'profile/soignant', component: ProfileSoignantComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'profile/accompagnant', component: ProfileAccompagnantComponent, canActivate: [authGuard, roleGuard('ACCOMPAGNANT')] },
  { path: 'confirmation', component: ConfirmationComponent, canActivate: [authGuard, roleGuard('PATIENT')] },

  // ─── Medical Record routes ─────────────────────────────────────────────────
  // Patient views their own record
  { path: 'dossier-medical', component: MedicalRecordComponent, canActivate: [authGuard] },
  // Create new record (must be before /:id to avoid being captured by it)
  { path: 'dossier-medical/new', component: MedicalRecordFormComponent, canActivate: [authGuard] },
  // Edit existing record (must be before /:id)
  { path: 'dossier-medical/edit/:id', component: MedicalRecordFormComponent, canActivate: [authGuard] },
  // View record by patient ID (soignant / admin)
  { path: 'dossier-medical/patient/:patientId', component: MedicalRecordComponent, canActivate: [authGuard] },
  // View record by dossier ID (must be last among dossier-medical routes)
  { path: 'dossier-medical/:id', component: MedicalRecordComponent, canActivate: [authGuard] }
];
