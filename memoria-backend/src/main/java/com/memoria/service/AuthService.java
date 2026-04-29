package com.memoria.service;

import com.memoria.config.JwtUtil;
import com.memoria.dto.LoginRequestDTO;
import com.memoria.dto.LoginResponseDTO;
import com.memoria.dto.RegisterRequestDTO;
import com.memoria.entity.User;
import com.memoria.exception.CustomExceptions;
import com.memoria.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomExceptions.UnauthorizedException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomExceptions.UnauthorizedException("Email ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
        return new LoginResponseDTO(token, user.getId(), user.getEmail(), user.getNom(), user.getPrenom(), user.getRole());
    }

    public LoginResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomExceptions.ConflictException("Un compte avec cet email existe déjà");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .role(request.getRole())
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
        return new LoginResponseDTO(token, user.getId(), user.getEmail(), user.getNom(), user.getPrenom(), user.getRole());
    }

    public LoginResponseDTO verifyToken(String token) {
        if (!jwtUtil.isTokenValid(token)) {
            throw new CustomExceptions.UnauthorizedException("Token invalide ou expiré");
        }
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomExceptions.UnauthorizedException("Utilisateur non trouvé"));
        return new LoginResponseDTO(token, user.getId(), user.getEmail(), user.getNom(), user.getPrenom(), user.getRole());
    }
}
