package MemorIA.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "caregiver_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaregiverLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String status;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;
}
