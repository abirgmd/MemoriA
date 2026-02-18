package com.med.cognitive.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient_test_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientTestAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "patient_id")
    private String patientId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private CognitiveTest test;

    @Column(name = "assigned_by")
    private String assignedBy;

    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    private String notes;

    @Column(name = "reminder_sent")
    private Boolean reminderSent = false;

    @Column(name = "reminder_count")
    private Integer reminderCount = 0;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    // Enums
    public enum AssignmentStatus {
        ASSIGNED, IN_PROGRESS, COMPLETED, EXPIRED, CANCELLED
    }

    public enum Priority {
        LOW, NORMAL, HIGH, URGENT
    }
}
