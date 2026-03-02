import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';
import { RapportComponent } from './rapport/rapport.component';
import { DashboardDiagnosticComponent } from './dashboard-diagnostic/dashboard-diagnostic.component';
import { LoginComponent } from './login/login.component';
import { StastiqueDiagnosticComponent } from './stastique-diagnostic/stastique-diagnostic.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'diagnostic', component: DiagnosticComponent, canActivate: [authGuard], data: { role: 'PATIENT' } },
  { path: 'confirmation', component: ConfirmationComponent, canActivate: [authGuard], data: { role: 'PATIENT' } },
  { path: 'statistiques', component: StastiqueDiagnosticComponent, canActivate: [authGuard], data: { role: 'DOCTOR' } },
  { path: 'rapport', component: RapportComponent, canActivate: [authGuard], data: { role: 'DOCTOR' } },
  { path: 'dashboard_diagnostic', component: DashboardDiagnosticComponent, canActivate: [authGuard], data: { role: 'DOCTOR' } }
];
