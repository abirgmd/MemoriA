package MemorIA.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "adherence")
@Getter
@Setter
public class Adherence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "reminder_id")
    private Long reminderId;

    @Column(name = "adherence_date", nullable = false)
    private LocalDate adherenceDate;

    @Column(name = "adherence_status")
    private String adherenceStatus;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (adherenceDate == null) {
            adherenceDate = LocalDate.now();
        }
        createdAt = LocalDateTime.now();
    }
}
