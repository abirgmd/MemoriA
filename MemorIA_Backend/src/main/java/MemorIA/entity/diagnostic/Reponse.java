package MemorIA.entity.diagnostic;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reponse")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReponse;

    @Column(nullable = false)
    private Boolean reponse;

    @Column(name = "temps_reponse")
    private Double tempsReponse;

    @Column(name = "date_reponse")
    private LocalDateTime dateReponse;

    @ManyToOne
    @JoinColumn(name = "id_question", nullable = false)
    private Question question;
}
