package com.memoria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String nom;
    @NotBlank
    private String prenom;
    @NotBlank
    private String telephone;
    @NotBlank
    private String role;
}
