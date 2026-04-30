package MemorIA.service;

import MemorIA.dto.AuthResponse;
import MemorIA.dto.LoginRequest;
import MemorIA.dto.SignupRequest;
import MemorIA.entity.User;
import MemorIA.repository.UserRepository;
import MemorIA.security.JwtProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@Slf4j
public class AuthServiceImpl implements IAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getEmail());
        
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            log.warn("User not found: {}", loginRequest.getEmail());
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Invalid password for user: {}", loginRequest.getEmail());
            throw new RuntimeException("Invalid credentials");
        }

        Boolean isActive = user.getIsActive() != null ? user.getIsActive() : user.getActif();
        if (isActive != null && !isActive) {
            log.warn("User account is inactive: {}", loginRequest.getEmail());
            throw new RuntimeException("User account is inactive");
        }

        String token = jwtProvider.generateToken(user);
        log.info("Login successful for user: {}", loginRequest.getEmail());
        
        return buildAuthResponse(user, token);
    }

    @Override
    public AuthResponse signup(SignupRequest signupRequest) {
        return register(signupRequest);
    }

    @Override
    public AuthResponse register(SignupRequest signupRequest) {
        log.info("Registration attempt for user: {}", signupRequest.getEmail());
        
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            log.warn("Email already exists: {}", signupRequest.getEmail());
            throw new RuntimeException("Email already exists");
        }

        User newUser = User.builder()
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .firstName(signupRequest.getFirstName() != null ? signupRequest.getFirstName() : signupRequest.getPrenom())
                .lastName(signupRequest.getLastName() != null ? signupRequest.getLastName() : signupRequest.getNom())
                .nom(signupRequest.getNom() != null ? signupRequest.getNom() : signupRequest.getLastName())
                .prenom(signupRequest.getPrenom() != null ? signupRequest.getPrenom() : signupRequest.getFirstName())
                .telephone(signupRequest.getTelephone())
                .role(signupRequest.getRole() != null ? signupRequest.getRole() : "PATIENT")
                .isActive(true)
                .actif(true)
                .isVerified(false)
                .profileCompleted(false)
                .build();

        User savedUser = userRepository.save(newUser);
        String token = jwtProvider.generateToken(savedUser);
        log.info("Registration successful for user: {}", signupRequest.getEmail());
        
        return buildAuthResponse(savedUser, token);
    }

    @Override
    public AuthResponse verify(String token) {
        log.info("Token verification request");
        
        if (!jwtProvider.validateToken(token)) {
            log.warn("Invalid token");
            return AuthResponse.builder()
                    .message("Token invalid")
                    .build();
        }

        String email = jwtProvider.getUserEmailFromToken(token);
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            log.warn("User not found for token: {}", email);
            return AuthResponse.builder()
                    .message("User not found")
                    .build();
        }

        User user = userOptional.get();
        return buildAuthResponse(user, token, "Token valid");
    }

    @Override
    public void logout(String token) {
        log.info("Logout request for token");
        // Token invalidation can be implemented with a blacklist if needed
    }

    @Override
    public AuthResponse getUserInfo(Long userId) {
        log.info("Getting user info for id: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtProvider.generateToken(user);
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return buildAuthResponse(user, token, null);
    }

    private AuthResponse buildAuthResponse(User user, String token, String message) {
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .telephone(user.getTelephone())
                .role(user.getRole())
                .token(token)
                .profileCompleted(user.getProfileCompleted())
                .message(message)
                .build();
    }
}
