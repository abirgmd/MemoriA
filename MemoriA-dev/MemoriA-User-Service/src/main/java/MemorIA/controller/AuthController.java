package MemorIA.controller;

import MemorIA.dto.AuthResponse;
import MemorIA.dto.LoginRequest;
import MemorIA.dto.SignupRequest;
import MemorIA.service.IAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class AuthController {

    @Autowired
    private IAuthService authService;

    // Identity Service Endpoints
    @PostMapping({"/api/auth/login", "/api/identity/auth/login", "/api/users/auth/login"})
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login request for: {}", loginRequest.getEmail());
            AuthResponse response = authService.login(loginRequest);
            
            if (response.getToken() != null) {
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                AuthResponse.builder().message(e.getMessage()).build()
            );
        }
    }

    @PostMapping({"/api/auth/signup", "/api/identity/auth/signup", "/api/users/auth/signup", "/api/users/auth/register"})
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest signupRequest) {
        try {
            log.info("Signup request for: {}", signupRequest.getEmail());
            AuthResponse response = authService.signup(signupRequest);
            
            if (response.getToken() != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("Signup error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                AuthResponse.builder().message(e.getMessage()).build()
            );
        }
    }

    @PostMapping({"/api/auth/verify", "/api/identity/auth/verify", "/api/users/auth/verify"})
    public ResponseEntity<AuthResponse> verify(@RequestHeader("Authorization") String token) {
        try {
            log.info("Token verification request");
            
            // Remove "Bearer " prefix if present
            String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            AuthResponse response = authService.verify(cleanToken);
            
            if ("Token valid".equals(response.getMessage())) {
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("Verification error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping({"/api/auth/logout", "/api/identity/auth/logout", "/api/users/auth/logout"})
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        try {
            log.info("Logout request");
            String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            authService.logout(cleanToken);
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            log.error("Logout error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping({"/api/auth/info/{userId}", "/api/identity/auth/info/{userId}", "/api/users/auth/info/{userId}"})
    public ResponseEntity<AuthResponse> getUserInfo(@PathVariable Long userId) {
        try {
            log.info("Getting user info for id: {}", userId);
            AuthResponse response = authService.getUserInfo(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get user info error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                AuthResponse.builder().message(e.getMessage()).build()
            );
        }
    }
}
