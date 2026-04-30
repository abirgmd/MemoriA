import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reminder } from '../../../models/reminder.model';
import { CalendarDay, CalendarWeek, DayEvent } from '../../../models/doctor-planning.model';
import { DoctorPlanningService } from '../../../services/doctor-planning.service';

@Component({
  selector: 'app-planning-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planning-calendar.component.html',
  styleUrls: ['./planning-calendar.component.css']
})
export class PlanningCalendarComponent implements OnInit, OnChanges {

  @Input() viewType: 'month' | 'week' | 'day' = 'month';
  @Input() currentDate: Date = new Date();
  @Input() reminders: Reminder[] = [];
  @Input() selectedDate: Date | null = null;
  @Output() daySelected = new EventEmitter<Date>();

  /**
   * Vue mois
   */
  monthWeeks: CalendarDay[][] = [];

  /**
   * Vue semaine
   */
  weekView: CalendarWeek | null = null;

  /**
   * Vue jour
   */
  dayView: CalendarDay | null = null;

  /**
   * Jours de la semaine
   */
  weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(private planningService: DoctorPlanningService) {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate'] || changes['reminders']) {
      this.generateCalendar();
    }
  }

  /**
   * Génère le calendrier en fonction de la vue
   */
  private generateCalendar(): void {
    if (this.viewType === 'month') {
      this.monthWeeks = this.planningService.generateMonthCalendar(this.currentDate);
      this.enrichCalendarDays(this.monthWeeks.flat());
    } else if (this.viewType === 'week') {
      this.weekView = this.planningService.generateWeekCalendar(new Date(this.currentDate));
      this.enrichCalendarDays(this.weekView.days);
    } else {
      this.dayView = this.createDayView();
      this.enrichCalendarDays([this.dayView]);
    }
  }

  /**
   * Enrichit les jours du calendrier avec les événements et statuts
   */
  private enrichCalendarDays(days: CalendarDay[]): void {
    days.forEach(day => {
      const dayReminders = this.getRemindersByDate(day.date);
      day.events = this.planningService.convertRemindersToEvents(dayReminders);

      // Calcule le taux de complétude et alerte
      const completed = dayReminders.filter(r =>
        r.status === 'CONFIRMED' || r.status === 'CONFIRMED_LATE'
      ).length;

      day.completionRate = dayReminders.length > 0
        ? Math.round((completed / dayReminders.length) * 100)
        : 0;

      day.hasAlert = dayReminders.some(r =>
        r.status === 'MISSED' || r.status === 'PENDING'
      );
    });
  }

  /**
   * Crée la vue journée
   */
  private createDayView(): CalendarDay {
    return {
      date: new Date(this.currentDate),
      dayNumber: this.currentDate.getDate(),
      isCurrentMonth: true,
      isToday: this.isToday(this.currentDate),
      events: [],
      hasAlert: false,
      completionRate: 0
    };
  }

  /**
   * Récupère les rappels d'une date
   */
  private getRemindersByDate(date: Date): Reminder[] {
    const dateStr = this.formatDate(date);
    return this.reminders.filter(r => r.reminderDate === dateStr);
  }

  /**
   * Formate une date en string YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Vérifie si une date est aujourd'hui
   */
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

  /**
   * Gère le clic sur un jour
   */
  onDayClick(date: Date): void {
    this.selectedDate = date;
    this.daySelected.emit(date);
  }

  /**
   * Obtient la couleur d'une pastille événement
   */
  getEventColor(event: DayEvent): string {
    return this.planningService.getTypeColor(event.type);
  }

  /**
   * Obtient la couleur du statut
   */
  getStatusColor(event: DayEvent): { background: string; border: string } {
    const statusColor = this.planningService.getStatusColor(event.status);
    return {
      background: statusColor + '20',
      border: statusColor
    };
  }

  /**
   * Récupère le label du mois
   */
  getMonthLabel(date: Date): string {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  /**
   * Récupère le label du jour de la semaine
   */
  getDayLabel(index: number): string {
    return this.weekDays[index];
  }
}
