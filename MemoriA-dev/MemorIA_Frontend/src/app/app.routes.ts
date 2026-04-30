import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';
import { RapportComponent } from './rapport/rapport.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { adminGuard } from './auth/admin.guard';
import { authGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

import { roleGuard } from './auth/role.guard';
import { DoctorPlanningComponent } from './alertes/doctor_planning/components/doctor-planning/doctor-planning.component';
import { PatientPlanningComponent } from './alertes/doctor_planning/components/patient-planning/patient-planning.component';
import { CaregiverPlanningComponent } from './alertes/doctor_planning/components/caregiver-planning/caregiver-planning.component';

import { ProfilePatientComponent } from './profile-patient/profile-patient.component';
import { ProfileSoignantComponent } from './profile-soignant/profile-soignant.component';
import { ProfileAccompagnantComponent } from './profile-accompagnant/profile-accompagnant.component';
import { AlertesComponent } from './alertes/alertes.component';
import { DoctorAlertesComponent } from './alertes/doctor-alertes-page/doctor-alertes.component';
import { CaregiverAlertesComponent } from './alertes/caregiver-alertes-page/caregiver-alertes.component';
import { PatientAlertesComponent } from './alertes/patient-alertes-page/patient-alertes.component';
import { PatientListComponent } from './alertes/patient-list/patient-list.component';

const normalizeRole = (rawRole?: string | null): 'DOCTOR' | 'CAREGIVER' | 'PATIENT' | null => {
  if (!rawRole) {
    return null;
  }
  const role = rawRole.replace(/^ROLE_/i, '').toUpperCase();
  if (role === 'SOIGNANT' || role === 'DOCTOR') {
    return 'DOCTOR';
  }
  if (role === 'ACCOMPAGNANT' || role === 'CAREGIVER') {
    return 'CAREGIVER';
  }
  if (role === 'PATIENT') {
    return 'PATIENT';
  }
  return null;
};

const planningRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = normalizeRole(authService.getCurrentUser()?.role);

  if (role === 'DOCTOR') {
    return router.createUrlTree(['/doctor_planning']);
  }
  if (role === 'CAREGIVER') {
    return router.createUrlTree(['/caregiver_planning']);
  }
  if (role === 'PATIENT') {
    return router.createUrlTree(['/patient_planning']);
  }
  return router.createUrlTree(['/home']);
};

const alertsRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = normalizeRole(authService.getCurrentUser()?.role);

  if (role === 'DOCTOR') {
    return router.createUrlTree(['/doctor-alertes']);
  }
  if (role === 'CAREGIVER') {
    return router.createUrlTree(['/caregiver-alertes']);
  }

  if (role === 'PATIENT') {
    return router.createUrlTree(['/patient-alertes']);
  }

  return true;
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'diagnostic', component: DiagnosticComponent },
  { path: 'rapport', component: RapportComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
  { path: 'planning', component: HomeComponent, canActivate: [authGuard, planningRedirectGuard] },
  { path: 'doctor_planning', component: DoctorPlanningComponent, canActivate: [authGuard, roleGuard('DOCTOR')] },
  { path: 'doctor-planning', redirectTo: '/doctor_planning', pathMatch: 'full' },
  { path: 'patient_planning', component: PatientPlanningComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'patient-planning', redirectTo: '/patient_planning', pathMatch: 'full' },
  { path: 'caregiver_planning', component: CaregiverPlanningComponent, canActivate: [authGuard, roleGuard('CAREGIVER')] },
  { path: 'caregiver-planning', redirectTo: '/caregiver_planning', pathMatch: 'full' },
  { path: 'profile/patient', component: ProfilePatientComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'profile/soignant', component: ProfileSoignantComponent, canActivate: [authGuard, roleGuard('DOCTOR')] },
  { path: 'profile/accompagnant', component: ProfileAccompagnantComponent, canActivate: [authGuard, roleGuard('CAREGIVER')] },
  { path: 'alertes', component: AlertesComponent, canActivate: [authGuard, alertsRedirectGuard] },
  { path: 'patient-alertes', component: PatientAlertesComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'patient_alertes', redirectTo: '/patient-alertes', pathMatch: 'full' },
  { path: 'doctor-alertes', component: DoctorAlertesComponent, canActivate: [authGuard, roleGuard('DOCTOR')] },
  { path: 'doctor_alertes', redirectTo: '/doctor-alertes', pathMatch: 'full' },
  { path: 'caregiver-alertes', component: CaregiverAlertesComponent, canActivate: [authGuard, roleGuard('CAREGIVER')] },
  { path: 'caregiver_alertes', redirectTo: '/caregiver-alertes', pathMatch: 'full' },
  { path: 'patient-list', component: PatientListComponent, canActivate: [authGuard] },
  { path: 'patient_list', redirectTo: '/patient-list', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
