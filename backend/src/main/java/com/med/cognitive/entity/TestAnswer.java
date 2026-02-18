package com.med.cognitive.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "test_result_id")
    private Long testResultId;

    @Column(name = "test_id")
    private Long testId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private TestQuestion question;

    private String answer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "score_obtained")
    private Integer scoreObtained;

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
}
