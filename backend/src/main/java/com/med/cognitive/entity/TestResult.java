package com.med.cognitive.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "patient_id")
    private String patientId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private CognitiveTest test;

    @Column(name = "assignment_id")
    private Long assignmentId;

    @Column(name = "score_totale")
    private Integer scoreTotale;

    @Column(name = "max_possible_score")
    private Integer maxPossibleScore;

    @Column(name = "score_percentage")
    private Double scorePercentage;

    @Column(name = "z_score")
    private Double zScore;

    private Integer percentile;

    private String interpretation;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity_level")
    private SeverityLevel severityLevel;

    @Column(name = "test_date")
    private LocalDateTime testDate;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "completion_rate")
    private Double completionRate;

    @Column(name = "is_valid")
    private Boolean isValid = true;

    @Column(name = "flagged_reasons")
    private String flaggedReasons;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public enum SeverityLevel {
        NORMAL, MILD, MODERATE, SEVERE
    }
}
