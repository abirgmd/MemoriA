package MemorIA.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String nom;
    private String prenom;
    private String telephone;
    private String role;
    private String token;
    private String message;
    private Boolean profileCompleted;
}
