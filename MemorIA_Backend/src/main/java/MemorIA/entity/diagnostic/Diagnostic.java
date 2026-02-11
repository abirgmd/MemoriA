package MemorIA.entity.diagnostic;

import MemorIA.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "diagnostic")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnostic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDiagnostic;

    @Column(nullable = false)
    private String titre;

    @Column(name = "date_debut")
    private LocalDateTime dateDebut;

    @Column(name = "date_fin")
    private LocalDateTime dateFin;

    @Column(name = "duree_minutes")
    private Double dureeMinutes;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_diagnostic")
    private Date dateDiagnostic;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "pourcentage_alzeimer")
    private Double pourcentageAlzeimer;

    @Column(name = "ai_score")
    private Double aiScore;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "diagnostic", cascade = CascadeType.ALL)
    private List<Question> questions;

    @OneToOne(mappedBy = "diagnostic", cascade = CascadeType.ALL)
    private Score score;
}
