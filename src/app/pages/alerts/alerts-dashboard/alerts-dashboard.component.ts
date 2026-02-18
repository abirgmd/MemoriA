import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, AlertCircle, AlertTriangle, CheckCircle, Clock, Eye, Trash2, Filter, Plus, FileText, Bell } from 'lucide-angular';

interface Alert {
    id: string;
    patientId: string;
    patientName: string;
    type: 'medical' | 'cognitive' | 'safety';
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'new' | 'in-progress' | 'resolved';
    title: string;
    description: string;
    createdAt: string;
    aiConfidence: number;
}

@Component({
    selector: 'app-alerts-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        LucideAngularModule
    ],
    templateUrl: './alerts-dashboard.component.html',
    styleUrl: './alerts-dashboard.component.css'
})
export class AlertsDashboardComponent {
    selectedSeverity = signal<string>('all');
    selectedStatus = signal<string>('all');

    readonly icons = {
        AlertCircle,
        AlertTriangle,
        CheckCircle,
        Clock,
        Eye,
        Trash2,
        Filter,
        Plus,
        FileText,
        Bell
    };

    alerts: Alert[] = [
        {
            id: 'A001',
            patientId: 'P001',
            patientName: 'Sophie Laurent',
            type: 'cognitive',
            severity: 'critical',
            status: 'new',
            title: 'Déclin cognitif rapide détecté',
            description: 'Score MMSE critique (18/30) - Baisse de 5 points en 2 semaines',
            createdAt: '2026-02-04T14:30:00',
            aiConfidence: 92
        },
        {
            id: 'A002',
            patientId: 'P003',
            patientName: 'Marie Dubois',
            type: 'cognitive',
            severity: 'high',
            status: 'in-progress',
            title: 'Troubles de la mémoire à court terme',
            description: 'Résultats du test de mémoire en dessous du seuil - Surveillance recommandée',
            createdAt: '2026-02-04T10:15:00',
            aiConfidence: 87
        },
        {
            id: 'A003',
            patientId: 'P007',
            patientName: 'Jean Martin',
            type: 'medical',
            severity: 'high',
            status: 'new',
            title: 'Absence à rendez-vous important',
            description: 'Patient absent au rendez-vous de suivi du 02/02 - Nécessite contact',
            createdAt: '2026-02-03T16:45:00',
            aiConfidence: 95
        },
        {
            id: 'A004',
            patientId: 'P012',
            patientName: 'Claire Petit',
            type: 'safety',
            severity: 'medium',
            status: 'in-progress',
            title: 'Désorientation spatiale signalée',
            description: 'Aidant signale des difficultés d\'orientation dans des lieux familiers',
            createdAt: '2026-02-03T09:20:00',
            aiConfidence: 78
        },
        {
            id: 'A005',
            patientId: 'P015',
            patientName: 'Pierre Durand',
            type: 'cognitive',
            severity: 'low',
            status: 'resolved',
            title: 'Amélioration notable observée',
            description: 'Progression positive suite au traitement - Surveillance continue',
            createdAt: '2026-02-02T14:10:00',
            aiConfidence: 85
        },
        {
            id: 'A006',
            patientId: 'P008',
            patientName: 'Anne Bernard',
            type: 'medical',
            severity: 'medium',
            status: 'new',
            title: 'Modification de comportement',
            description: 'Changements d\'humeur et d\'appétit signalés par la famille',
            createdAt: '2026-02-01T11:30:00',
            aiConfidence: 81
        }
    ];

    filteredAlerts = computed(() => {
        return this.alerts.filter(alert => {
            const severityMatch = this.selectedSeverity() === 'all' || alert.severity === this.selectedSeverity();
            const statusMatch = this.selectedStatus() === 'all' || alert.status === this.selectedStatus();
            return severityMatch && statusMatch;
        });
    });

    stats = computed(() => ({
        total: this.alerts.length,
        critical: this.alerts.filter(a => a.severity === 'critical').length,
        resolved: this.alerts.filter(a => a.status === 'resolved').length,
        pending: this.alerts.filter(a => a.status === 'new' || a.status === 'in-progress').length
    }));

    getSeverityClass(severity: string): string {
        switch (severity) {
            case 'critical': return 'severity-critical';
            case 'high': return 'severity-high';
            case 'medium': return 'severity-medium';
            case 'low': return 'severity-low';
            default: return '';
        }
    }

    getStatusBadge(status: string) {
        const badges = {
            'new': { label: 'Nouvelle', class: 'status-new' },
            'in-progress': { label: 'En cours', class: 'status-progress' },
            'resolved': { label: 'Résolue', class: 'status-resolved' }
        };
        return badges[status as keyof typeof badges] || badges.new;
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}
