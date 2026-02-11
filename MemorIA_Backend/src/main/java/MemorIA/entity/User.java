package MemorIA.entity;

import MemorIA.entity.diagnostic.Diagnostic;
import MemorIA.entity.Traitements.Traitements;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Boolean actif;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Diagnostic> diagnostics;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Traitements> traitements;
}
