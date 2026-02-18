import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, MoreHorizontal } from 'lucide-angular';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  description: string;
  location: string;
  date: Date;
  status: 'PENDING' | 'DONE';
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent {
  readonly icons = {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar,
    Clock,
    MapPin,
    MoreHorizontal
  };

  currentDate = signal(new Date());

  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  mockEvents = signal<CalendarEvent[]>([
    { id: 1, title: 'Test Cognitif - Jean Dupont', time: '10:00', description: 'Évaluation MMSE', location: 'Cabinet', date: new Date(2026, 1, 14), status: 'DONE' },
    { id: 2, title: 'Consultation - Marie Martin', time: '14:30', description: 'Suivi stage 2', location: 'Cabinet', date: new Date(2026, 1, 14), status: 'PENDING' },
    { id: 3, title: 'Réunion de synthèse', time: '09:00', description: 'Analyse des résultats mensuels', location: 'Bureau', date: new Date(2026, 1, 1), status: 'DONE' },
    { id: 4, title: 'Test Stroop - Paul Durand', time: '11:00', description: 'Patient en stage 3', location: 'Cabinet', date: new Date(2026, 1, 12), status: 'PENDING' },
    { id: 5, title: 'Visite à domicile', time: '16:00', description: 'Vérification sécurité environnement', location: 'Domicile Patient', date: new Date(2026, 1, 12), status: 'DONE' },
  ]);

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();
    const days = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: 'prev',
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: 'current',
        date: new Date(year, month, i)
      });
    }

    // Next month padding
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        day: i,
        month: 'next',
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  });

  monthName = computed(() => {
    return this.currentDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  prevMonth() {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  goToToday() {
    this.currentDate.set(new Date());
  }

  getEventsForDay(date: Date) {
    return this.mockEvents().filter(e =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  }

  isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}
