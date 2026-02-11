package MemorIA.entity.diagnostic;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "score")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idScore;

    @Column(name = "score_total")
    private Double scoreTotal;

    @Column(name = "pourcentage")
    private Double pourcentage;

    @Column(name = "datecalcul")
    private Double datecalcul;

    @OneToOne
    @JoinColumn(name = "id_diagnostic", nullable = false, unique = true)
    private Diagnostic diagnostic;

    @OneToOne(mappedBy = "score", cascade = CascadeType.ALL)
    private Rapport rapport;
}
