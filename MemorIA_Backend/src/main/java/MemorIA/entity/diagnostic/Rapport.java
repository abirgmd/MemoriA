package MemorIA.entity.diagnostic;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rapport")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRapport;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String resumer;

    @Column(name = "analyse_detaillee", columnDefinition = "TEXT")
    private String analyseDetaillee;

    @Column(name = "valide_par_medecin")
    private Boolean valideParMedecin;

    @Column(name = "date_generation")
    private LocalDateTime dateGeneration;

    @OneToOne
    @JoinColumn(name = "id_score", nullable = false, unique = true)
    private Score score;
}
