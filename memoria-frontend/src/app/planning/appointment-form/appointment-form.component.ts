import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, APPOINTMENT_TYPES } from '../../models/appointment.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  @Input() editingAppointment: Appointment | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  saving = false;
  error = '';
  patients: User[] = [];
  types = APPOINTMENT_TYPES;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      type: ['Consultation', Validators.required],
      status: ['PENDING']
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    if (this.editingAppointment) {
      const a = this.editingAppointment;
      this.form.patchValue({
        patientId: a.patientId,
        title: a.title,
        description: a.description || '',
        startTime: this.toInputDateTime(a.startTime),
        endTime: this.toInputDateTime(a.endTime),
        type: a.type,
        status: a.status
      });
    }
  }

  loadPatients(): void {
    this.loading = true;
    this.authService.getUsersByRole('patient').subscribe({
      next: (users) => {
        this.patients = users;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const currentUser = this.authService.currentUser;
    if (!currentUser) return;

    this.saving = true;
    this.error = '';
    const val = this.form.value;
    const dto = {
      doctorId: currentUser.userId,
      patientId: Number(val.patientId),
      title: val.title,
      description: val.description,
      startTime: new Date(val.startTime).toISOString().slice(0, 19),
      endTime: new Date(val.endTime).toISOString().slice(0, 19),
      type: val.type,
      status: val.status || 'PENDING'
    };

    const op = this.editingAppointment
      ? this.appointmentService.update(this.editingAppointment.id, dto)
      : this.appointmentService.create(dto);

    op.subscribe({
      next: () => { this.saving = false; this.saved.emit(); },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la sauvegarde';
        this.saving = false;
      }
    });
  }

  private toInputDateTime(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  field(name: string) { return this.form.get(name); }
  isInvalid(name: string) { return this.field(name)?.invalid && this.field(name)?.touched; }

  get isEdit(): boolean { return !!this.editingAppointment; }
}
