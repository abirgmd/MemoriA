package MemorIA.entity.Traitements;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "accompagnement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Accompagnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAccompagnement;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private Integer telephone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String disponibilite;

    @Column(nullable = false)
    private Boolean actif;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @OneToOne
    @JoinColumn(name = "id_traitement", nullable = false, unique = true)
    private Traitements traitement;
}
