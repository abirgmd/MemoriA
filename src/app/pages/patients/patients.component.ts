import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Search, Filter, UserPlus, TrendingDown, TrendingUp, Clock } from 'lucide-angular';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastTest: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'surveillance' | 'critique';
  nextAppointment: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {
  readonly icons = {
    Search,
    Filter,
    UserPlus,
    TrendingDown,
    TrendingUp,
    Clock
  };

  patients: Patient[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      age: 72,
      lastTest: '2024-02-01',
      score: 24,
      trend: 'down',
      status: 'surveillance',
      nextAppointment: '2024-02-15'
    },
    {
      id: '2',
      name: 'Jean Martin',
      age: 68,
      lastTest: '2024-01-28',
      score: 28,
      trend: 'stable',
      status: 'normal',
      nextAppointment: '2024-03-01'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      age: 75,
      lastTest: '2024-02-02',
      score: 18,
      trend: 'down',
      status: 'critique',
      nextAppointment: '2024-02-08'
    },
    {
      id: '4',
      name: 'Pierre Durand',
      age: 70,
      lastTest: '2024-01-30',
      score: 26,
      trend: 'up',
      status: 'normal',
      nextAppointment: '2024-02-20'
    },
    {
      id: '5',
      name: 'Claire Petit',
      age: 77,
      lastTest: '2024-02-01',
      score: 22,
      trend: 'down',
      status: 'surveillance',
      nextAppointment: '2024-02-12'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'normal':
        return 'status-normal';
      case 'surveillance':
        return 'status-surveillance';
      case 'critique':
        return 'status-critique';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'normal':
        return 'Stable';
      case 'surveillance':
        return 'À surveiller';
      case 'critique':
        return 'Critique';
      default:
        return status;
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
