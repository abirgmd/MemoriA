package MemorIA.entity.diagnostic;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "question")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idQuestion;

    @Column(nullable = false)
    private String question;

    @Column(name = "point_maximal")
    private Double pointMaximal;

    @Column(name = "templimite")
    private Double templimite;

    @Column(name = "order_question")
    private Integer orderQuestion;

    @ManyToOne
    @JoinColumn(name = "id_diagnostic", nullable = false)
    private Diagnostic diagnostic;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Reponse> reponses;
}
