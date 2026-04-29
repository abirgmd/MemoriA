import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, APPOINTMENT_STATUSES } from '../../models/appointment.model';
import { AuthResponse } from '../../models/user.model';

@Component({
  selector: 'app-planning-main',
  templateUrl: './planning-main.component.html',
  styleUrls: ['./planning-main.component.scss']
})
export class PlanningMainComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  appointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  loading = true;
  viewMode: 'week' | 'month' | 'agenda' | 'today' = 'week';
  showForm = false;
  editingAppointment: Appointment | null = null;
  selectedAppointment: Appointment | null = null;
  currentWeekStart = new Date();
  statuses = APPOINTMENT_STATUSES;

  weekDays: Date[] = [];
  hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.initWeek();
    this.loadAppointments();
  }

  initWeek(): void {
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    this.currentWeekStart = monday;
    this.buildWeekDays();
  }

  buildWeekDays(): void {
    this.weekDays = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  prevWeek(): void {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.buildWeekDays();
  }

  nextWeek(): void {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.buildWeekDays();
  }

  loadAppointments(): void {
    if (!this.currentUser) return;
    this.loading = true;
    const id = this.currentUser.userId;
    const role = this.currentUser.role;

    if (role === 'soignant') {
      this.appointmentService.findByDoctorId(id).subscribe({
        next: (data) => {
          this.appointments = data;
          this.upcomingAppointments = data.filter(a => new Date(a.startTime) >= new Date())
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 8);
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.appointmentService.findByPatientId(id).subscribe({
        next: (data) => {
          this.appointments = data;
          this.upcomingAppointments = data.filter(a => new Date(a.startTime) >= new Date())
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 8);
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
  }

  getAppointmentsForSlot(day: Date, hour: number): Appointment[] {
    return this.appointments.filter(a => {
      const start = new Date(a.startTime);
      return start.toDateString() === day.toDateString() && start.getHours() === hour;
    });
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatFullDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  getWeekRange(): string {
    const end = new Date(this.currentWeekStart);
    end.setDate(end.getDate() + 4);
    const startStr = this.currentWeekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${startStr} – ${endStr}`;
  }

  getStatusLabel(status: string): string {
    return this.statuses.find(s => s.value === status)?.label ?? status;
  }

  getStatusClass(status: string): string {
    return this.statuses.find(s => s.value === status)?.class ?? 'pending';
  }

  getTypeClass(type: string): string {
    return 'tag-' + type.toLowerCase().replace(/[^a-z]/g, '');
  }

  openForm(appointment?: Appointment): void {
    this.editingAppointment = appointment || null;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingAppointment = null;
  }

  onFormSaved(): void {
    this.closeForm();
    this.loadAppointments();
  }

  selectAppointment(a: Appointment): void {
    this.selectedAppointment = this.selectedAppointment?.id === a.id ? null : a;
  }

  deleteAppointment(id: number): void {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    this.appointmentService.delete(id).subscribe({
      next: () => {
        this.loadAppointments();
        this.selectedAppointment = null;
      }
    });
  }

  updateStatus(id: number, status: string): void {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => this.loadAppointments()
    });
  }

  logout(): void {
    this.authService.logout();
  }

  get isSoignant(): boolean {
    return this.currentUser?.role === 'soignant';
  }

  get totalToday(): number {
    const today = new Date().toDateString();
    return this.appointments.filter(a => new Date(a.startTime).toDateString() === today).length;
  }

  get totalWeek(): number {
    const start = this.weekDays[0];
    const end = this.weekDays[this.weekDays.length - 1];
    return this.appointments.filter(a => {
      const d = new Date(a.startTime);
      return d >= start && d <= end;
    }).length;
  }

  get confirmedCount(): number {
    return this.appointments.filter(a => a.status === 'CONFIRMED').length;
  }
}
