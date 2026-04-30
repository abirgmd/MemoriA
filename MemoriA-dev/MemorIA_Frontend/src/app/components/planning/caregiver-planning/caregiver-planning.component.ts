import { Component, OnInit } from '@angular/core';
import { PlanningService } from '../../../services/planning.service';
import { AuthService } from '../../../services/auth.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Color, NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-caregiver-planning',
  templateUrl: './caregiver-planning.component.html',
  styleUrls: ['./caregiver-planning.component.css']
})
export class CaregiverPlanningComponent implements OnInit {
  patients: any[] = [];
  selectedPatient: any = null;
  reminders: any[] = [];
  stats: any = null;
  today = new Date().toISOString().slice(0, 10);
  loading = true;
  error = '';

  // Chart.js configs
  medRateData: any = { labels: ['Confirmé', 'Non confirmé'], datasets: [{ data: [0, 0], backgroundColor: ['#00635D', '#CB1527'] }] };
  actRateData: any = { labels: ['Confirmé', 'Non confirmé'], datasets: [{ data: [0, 0], backgroundColor: ['#00635D', '#CB1527'] }] };
  forgetData: any = { labels: ['J-6','J-5','J-4','J-3','J-2','J-1','Aujourd\'hui'], datasets: [{ data: [0,0,0,0,0,0,0], label: 'Oublis', backgroundColor: '#CB1527' }] };
  doughnutType: ChartType = 'doughnut';
  barType: ChartType = 'bar';

  constructor(private planning: PlanningService, private auth: AuthService) {}

  ngOnInit() {
    if (this.auth.getRole() !== 'AIDANT') {
      this.error = 'Accès réservé aux aidants.';
      return;
    }
    this.planning.getMyPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.selectedPatient = patients[0];
        this.loadReminders();
        this.loadStats();
      },
      error: () => this.error = 'Erreur chargement patients.'
    });
  }

  onPatientChange(id: number) {
    this.selectedPatient = this.patients.find(p => p.id == id);
    this.loadReminders();
    this.loadStats();
  }

  loadReminders() {
    if (!this.selectedPatient) return;
    this.planning.getReminders(this.selectedPatient.id, this.today).subscribe({
      next: (reminders) => this.reminders = reminders,
      error: () => this.error = 'Erreur chargement rappels.'
    });
  }

  loadStats() {
    if (!this.selectedPatient) return;
    this.planning.getStats(this.selectedPatient.id).subscribe({
      next: (stats) => {
        this.stats = stats;
        // Met à jour les données des graphiques
        this.medRateData = {
          labels: ['Confirmé', 'Non confirmé'],
          datasets: [{
            data: [stats.medRate, 100 - stats.medRate],
            backgroundColor: ['#00635D', '#CB1527']
          }]
        };
        this.actRateData = {
          labels: ['Confirmé', 'Non confirmé'],
          datasets: [{
            data: [stats.actRate, 100 - stats.actRate],
            backgroundColor: ['#00635D', '#CB1527']
          }]
        };
        this.forgetData = {
          labels: ['J-6','J-5','J-4','J-3','J-2','J-1','Aujourd\'hui'],
          datasets: [{
            data: stats.forgets,
            label: 'Oublis',
            backgroundColor: '#CB1527'
          }]
        };
      },
      error: () => this.error = 'Erreur chargement stats.'
    });
  }

  confirm(reminder: any) {
    this.planning.confirmReminder(reminder.id).subscribe(() => this.loadReminders());
  }

  delay(reminder: any) {
    this.planning.delayReminder(reminder.id).subscribe(() => this.loadReminders());
  }
}
