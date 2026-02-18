import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShoppingCart, Tag, RefreshCw, ShoppingBag, TrendingUp, TrendingDown, Users, ClipboardCheck, AlertCircle, Calendar } from 'lucide-angular';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { ProgressCircleComponent } from '../../components/progress-circle/progress-circle.component';
import { CognitiveTestService } from '../../services/cognitive-test.service';
import { TestResultService } from '../../services/test-result.service';
import { PatientAssignmentService } from '../../services/patient-assignment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    MetricCardComponent,
    ProgressCircleComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private testService = inject(CognitiveTestService);
  private resultService = inject(TestResultService);
  private assignmentService = inject(PatientAssignmentService);

  // Metrics Signals
  totalTests = signal(0);
  activePatients = signal(4); // Mock for now as we don't have PatientService
  completedTests = signal(0);
  pendingAssignments = signal(0);

  readonly icons = {
    Users,
    ClipboardCheck,
    AlertCircle,
    Calendar,
    TrendingUp,
    TrendingDown,
    ShoppingCart // Keeping for compatibility if needed, but unused
  };

  chartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    arts: [4, 6, 3, 7, 5, 2, 8], // Mock activity data
    commerce: [2, 4, 2, 5, 3, 1, 4]
  };

  ngOnInit() {
    this.loadMetrics();
  }

  loadMetrics() {
    // 1. Total available tests
    this.testService.getAll().subscribe({
      next: (tests) => this.totalTests.set(tests.length),
      error: (e) => console.error(e)
    });

    // 2. Completed tests (Results)
    this.resultService.getAll().subscribe({
      next: (results) => this.completedTests.set(results.length),
      error: (e) => console.error(e)
    });

    // 3. Pending assignments
    this.assignmentService.getAll().subscribe({
      next: (assignments) => {
        const pending = assignments.filter(a => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS');
        this.pendingAssignments.set(pending.length);
      },
      error: (e) => console.error(e)
    });
  }

  asPolylinePoints(data: number[]): string {
    return data.map((val, i) => `${60 + i * 85},${210 - val * 10}`).join(' '); // Adjusted scale
  }
}

