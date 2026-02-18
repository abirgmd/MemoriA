import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { PatientDetailComponent } from './pages/patient-detail/patient-detail.component';
import { TestsCognitifsComponent } from './pages/tests-cognitifs/tests-cognitifs.component';
import { GestionTestsComponent } from './pages/gestion-tests/gestion-tests.component';
// import { TestMemoireComponent } from './pages/test-memoire/test-memoire.component';
// import { TestLanguageComponent } from './pages/test-language/test-language.component';
// import { TestOrientationComponent } from './pages/test-orientation/test-orientation.component';
import { AnalysesComponent } from './pages/analyses/analyses.component';
import { AlertsDashboardComponent } from './pages/alerts/alerts-dashboard/alerts-dashboard.component';
import { CreateAlertComponent } from './pages/alerts/create-alert/create-alert.component';
import { AlertDetailsComponent } from './pages/alerts/alert-details/alert-details.component';
// import { AlertsReportsComponent } from './pages/alerts-reports/alerts-reports.component';
import { CalendarViewComponent } from './pages/calendar-view/calendar-view.component';
// import { SchedulingComponent } from './pages/scheduling/scheduling.component';
// import { TaskPlanningComponent } from './pages/task-planning/task-planning.component';
// import { AvailabilityComponent } from './pages/availability/availability.component';
// import { CommunauteComponent } from './pages/communaute/communaute.component';
// import { CommunityListComponent } from './pages/community-list/community-list.component';
// import { CommunityFeedComponent } from './pages/community-feed/community-feed.component';
// import { CommunityAnalyticsComponent } from './pages/community-analytics/community-analytics.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
// import { DiagnosisDashboardComponent } from './pages/diagnosis-dashboard/diagnosis-dashboard.component';
// import { DiagnosisTestComponent } from './pages/diagnosis-test/diagnosis-test.component';
// import { DiagnosisResultsComponent } from './pages/diagnosis-results/diagnosis-results.component';
// import { TreatmentDashboardComponent } from './pages/treatment-dashboard/treatment-dashboard.component';
// import { SafetyZonesComponent } from './pages/safety-zones/safety-zones.component';
// import { RealTimeTrackingComponent } from './pages/real-time-tracking/real-time-tracking.component';
// import { ParametresComponent } from './pages/parametres/parametres.component';
// import { NotFoundComponent } from './pages/not-found/not-found.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'patients/:id', component: PatientDetailComponent },
      { path: 'tests-cognitifs', component: TestsCognitifsComponent },
      { path: 'gestion-tests', component: GestionTestsComponent },
      // { path: 'tests-cognitifs/memoire', component: TestMemoireComponent },
      // { path: 'tests-cognitifs/langage', component: TestLanguageComponent },
      // { path: 'tests-cognitifs/orientation', component: TestOrientationComponent },
      { path: 'analyses', component: AnalysesComponent },
      { path: 'alertes', component: AlertsDashboardComponent },
      { path: 'alertes/create', component: CreateAlertComponent },
      // { path: 'alertes/reports', component: AlertsReportsComponent },
      { path: 'alertes/:id', component: AlertDetailsComponent },
      { path: 'calendar', component: CalendarViewComponent },
      // { path: 'planning/scheduling', component: SchedulingComponent },
      // { path: 'planning/tasks', component: TaskPlanningComponent },
      // { path: 'planning/availability', component: AvailabilityComponent },
      // { path: 'communaute', component: CommunityListComponent },
      // { path: 'communaute/:id', component: CommunityFeedComponent },
      // { path: 'communaute/analytics', component: CommunityAnalyticsComponent },
      { path: 'activites', component: ActivitiesComponent },
      // { path: 'diagnosis', component: DiagnosisDashboardComponent },
      // { path: 'diagnosis/:id/execute', component: DiagnosisTestComponent },
      // { path: 'diagnosis/:id/results', component: DiagnosisResultsComponent },
      // { path: 'treatment', component: TreatmentDashboardComponent },
      // { path: 'treatment/zones/create', component: SafetyZonesComponent },
      // { path: 'treatment/tracking', component: RealTimeTrackingComponent },
      // { path: 'parametres', component: ParametresComponent },
    ]
  },
  // { path: '**', component: NotFoundComponent }
];
