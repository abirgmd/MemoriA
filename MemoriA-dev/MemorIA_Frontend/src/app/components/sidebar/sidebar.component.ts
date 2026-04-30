import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../models/menu-item.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-th-large',
      route: '/dashboard'
    },
    {
      label: 'Cognitive Tests',
      icon: 'fas fa-brain',
      route: '/tests-cognitifs'
    },
    {
      label: 'Diagnostic',
      icon: 'fas fa-stethoscope',
      route: '/diagnostic'
    },
    {
      label: 'Treatment',
      icon: 'fas fa-shield-alt',
      route: '/traitement'
    },
    {
      label: 'Analysis',
      icon: 'fas fa-chart-bar',
      route: '/analyses'
    },
    {
      label: 'Alerts',
      icon: 'fas fa-bell',
      route: '/alertes'
    },
    {
      label: 'Planning',
      icon: 'fas fa-calendar-alt',
      route: '/planning',
      badge: 4,
      badgeColor: 'badge-purple'
    },
    {
      label: 'Patient Files',
      icon: 'fas fa-users',
      route: '/dossiers-patients'
    },
    {
      label: 'Community',
      icon: 'fas fa-comments',
      route: '/communaute'
    },
    {
      label: 'Activities',
      icon: 'fas fa-chart-line',
      route: '/activites'
    }
  ];

  constructor(private readonly authService: AuthService) {
    this.applyRoleBasedPlanningRoute();
  }

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }

  private applyRoleBasedPlanningRoute(): void {
    const planningItem = this.menuItems.find((item) => item.label === 'Planning');
    const alertsItem = this.menuItems.find((item) => item.label === 'Alerts');
    if (!planningItem) {
      return;
    }

    const role = this.authService.getCurrentUser()?.role?.toUpperCase();
    if (role === 'SOIGNANT' || role === 'DOCTOR') {
      planningItem.route = '/doctor_planning';
      if (alertsItem) {
        alertsItem.route = '/doctor-alertes';
      }
      return;
    }
    if (role === 'ACCOMPAGNANT' || role === 'CAREGIVER') {
      planningItem.route = '/caregiver_planning';
      if (alertsItem) {
        alertsItem.route = '/caregiver-alertes';
      }
      return;
    }
    planningItem.route = '/patient_planning';
    if (alertsItem) {
      alertsItem.route = '/alertes';
    }
  }
}
