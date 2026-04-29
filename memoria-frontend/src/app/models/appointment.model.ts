export interface Appointment {
  id: number;
  doctorId: number;
  doctorNom: string;
  doctorPrenom: string;
  patientId: number;
  patientNom: string;
  patientPrenom: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentRequest {
  doctorId: number;
  patientId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: string;
  status?: string;
}

export const APPOINTMENT_TYPES = [
  'Consultation',
  'Examen',
  'Suivi',
  'Urgence',
  'Visio',
  'Bilan'
];

export const APPOINTMENT_STATUSES = [
  { value: 'PENDING', label: 'En attente', class: 'pending' },
  { value: 'CONFIRMED', label: 'Confirmé', class: 'confirmed' },
  { value: 'CANCELLED', label: 'Annulé', class: 'cancelled' },
  { value: 'COMPLETED', label: 'Terminé', class: 'completed' }
];
