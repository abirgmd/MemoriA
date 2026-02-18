import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, AlertCircle, User, Calendar, Clock, Brain, CheckCircle, AlertTriangle, TrendingUp, Shield, Activity, Trash2 } from 'lucide-angular';

interface TimelineEvent {
    type: 'created' | 'updated' | 'escalated' | 'resolved';
    timestamp: string;
    user: string;
    description: string;
}

@Component({
    selector: 'app-alert-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        LucideAngularModule
    ],
    templateUrl: './alert-details.component.html',
    styleUrl: './alert-details.component.css'
})
export class AlertDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    readonly icons = {
        ArrowLeft,
        AlertCircle,
        User,
        Calendar,
        Clock,
        Brain,
        CheckCircle,
        AlertTriangle,
        TrendingUp,
        Shield,
        Activity,
        Trash2
    };

    alertStatus = signal<'new' | 'in-progress' | 'resolved'>('new');
    alertId: string | null = null;

    // Mock alert data
    alert = {
        id: 'A001',
        patientId: 'P001',
        patientName: 'Sophie Laurent',
        patientAge: 72,
        type: 'cognitive',
        severity: 85,
        status: 'new', // Initial status, will be overridden by signal
        title: 'Déclin cognitif rapide détecté',
        description: 'Score MMSE critique (18/30) - Baisse de 5 points en 2 semaines. Le patient montre des signes de confusion temporelle et spatiale accrus. Les tests de mémoire à court terme révèlent des difficultés importantes.',
        createdAt: '2026-02-04T14:30:00',
        lastUpdate: '2026-02-04T16:15:00',
        aiConfidence: 92,
        factors: [
            'Déclin du score MMSE de 23 à 18 en 2 semaines',
            'Difficultés accrues dans les tâches quotidiennes',
            'Désorientation temporelle fréquente',
            'Troubles de la mémoire à court terme'
        ],
        recommendation: 'Consultation neurologique urgente recommandée. Réévaluation cognitive complète nécessaire. Surveillance rapprochée des symptômes.',
        timeline: [
            {
                type: 'created' as const,
                timestamp: '2026-02-04T14:30:00',
                user: 'Dr. Martin Leroy',
                description: 'Alerte créée automatiquement suite à l\'analyse des résultats de test'
            },
            {
                type: 'escalated' as const,
                timestamp: '2026-02-04T15:45:00',
                user: 'Système IA',
                description: 'Alerte escaladée en priorité critique en raison de la rapidité du déclin'
            },
            {
                type: 'updated' as const,
                timestamp: '2026-02-04T16:15:00',
                user: 'Dr. Martin Leroy',
                description: 'Consultation avec la famille planifiée pour demain'
            }
        ]
    };

    ngOnInit() {
        this.alertId = this.route.snapshot.paramMap.get('id');
        if (this.alertId) {
            this.alert.id = this.alertId;
        }
    }

    handleResolve() {
        if (confirm('Êtes-vous sûr de vouloir marquer cette alerte comme résolue ?')) {
            this.alertStatus.set('resolved');
        }
    }

    handleEscalate() {
        if (confirm('Êtes-vous sûr de vouloir escalader cette alerte ?')) {
            alert('Alerte escaladée avec succès');
        }
    }

    handleDelete() {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action est irréversible.')) {
            this.router.navigate(['/alertes']);
        }
    }

    getSeverityClass(severity: number): string {
        if (severity >= 75) return 'severity-critical';
        if (severity >= 50) return 'severity-high';
        if (severity >= 25) return 'severity-medium';
        return 'severity-low';
    }

    getSeverityLabel(severity: number): string {
        if (severity >= 75) return 'Critique';
        if (severity >= 50) return 'Élevée';
        if (severity >= 25) return 'Moyenne';
        return 'Faible';
    }

    getStatusBadge(status: string) {
        const badges = {
            'new': { label: 'Nouvelle', class: 'status-new', icon: this.icons.AlertCircle },
            'in-progress': { label: 'En cours', class: 'status-progress', icon: this.icons.Clock },
            'resolved': { label: 'Résolue', class: 'status-resolved', icon: this.icons.CheckCircle }
        };
        return badges[status as keyof typeof badges] || badges.new;
    }

    getTimelineIcon(type: string) {
        switch (type) {
            case 'created': return this.icons.AlertCircle;
            case 'updated': return this.icons.Activity;
            case 'escalated': return this.icons.TrendingUp;
            case 'resolved': return this.icons.CheckCircle;
            default: return this.icons.Clock;
        }
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    formatTime(dateStr: string): string {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // Calculate stroke-dasharray for circular progress
    getStrokeDashArray(confidence: number): string {
        const circumference = 339.292; // 2 * PI * 54
        return `${(confidence / 100) * circumference} ${circumference}`;
    }
}
