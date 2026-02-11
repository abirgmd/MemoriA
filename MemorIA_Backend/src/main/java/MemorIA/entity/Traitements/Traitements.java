package MemorIA.entity.Traitements;

import MemorIA.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "traitements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Traitements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTraitement;

    @Column(nullable = false)
    private String titre;

    @Column(name = "alerte_active")
    private Boolean alerteActive;

    @Column(name = "type_alerte")
    private String typeAlerte;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @OneToOne(mappedBy = "traitement", cascade = CascadeType.ALL)
    private Accompagnement accompagnement;

    @OneToOne(mappedBy = "traitement", cascade = CascadeType.ALL)
    private Localisation localisation;
}
