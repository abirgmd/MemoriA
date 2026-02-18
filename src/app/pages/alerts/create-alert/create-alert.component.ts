import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, AlertCircle, Mail, MessageSquare, Save } from 'lucide-angular';

interface Patient {
    id: string;
    name: string;
}

@Component({
    selector: 'app-create-alert',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        LucideAngularModule
    ],
    templateUrl: './create-alert.component.html',
    styleUrl: './create-alert.component.css'
})
export class CreateAlertComponent {
    private router = inject(Router);

    readonly icons = {
        ArrowLeft,
        AlertCircle,
        Mail,
        MessageSquare,
        Save
    };

    formData = signal({
        patientId: '',
        category: 'medical',
        title: '',
        description: '',
        severity: 50,
        notifyEmail: true,
        notifySms: false
    });

    patients: Patient[] = [
        { id: 'P001', name: 'Sophie Laurent' },
        { id: 'P003', name: 'Marie Dubois' },
        { id: 'P007', name: 'Jean Martin' },
        { id: 'P008', name: 'Anne Bernard' },
        { id: 'P012', name: 'Claire Petit' },
        { id: 'P015', name: 'Pierre Durand' }
    ];

    getSeverityLabel() {
        const severity = this.formData().severity;
        if (severity >= 75) return { label: 'Critique', class: 'severity-critical' };
        if (severity >= 50) return { label: 'Élevée', class: 'severity-high' };
        if (severity >= 25) return { label: 'Moyenne', class: 'severity-medium' };
        return { label: 'Faible', class: 'severity-low' };
    }

    updateField(field: string, value: any) {
        this.formData.update(current => ({ ...current, [field]: value }));
    }

    handleSubmit() {
        console.log('Creating alert:', this.formData());
        // Simulate API call
        alert('Alerte créée avec succès !');
        this.router.navigate(['/alertes']);
    }
}
