package MemorIA.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    // Auth-Service fields (firstName, lastName)
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    // User-Service fields (nom, prenom, telephone)
    @NotBlank
    @Column(nullable = false)
    private String nom;

    @NotBlank
    @Column(nullable = false)
    private String prenom;

    @NotBlank
    @Column(nullable = false)
    private String telephone;

    @NotBlank
    @Column(nullable = false)
    private String role;

    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean isActive;

    @Column(name = "actif", columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean actif;

    @Column(name = "is_verified", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isVerified;

    @Column(name = "profile_completed", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean profileCompleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
        if (actif == null) actif = true;
        if (isVerified == null) isVerified = false;
        if (profileCompleted == null) profileCompleted = false;
        if (firstName == null) firstName = prenom;
        if (lastName == null) lastName = nom;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

