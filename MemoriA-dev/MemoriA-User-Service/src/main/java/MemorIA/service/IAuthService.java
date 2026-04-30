package MemorIA.service;

import MemorIA.dto.AuthResponse;
import MemorIA.dto.LoginRequest;
import MemorIA.dto.SignupRequest;

public interface IAuthService {
    // Login and signup
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse signup(SignupRequest signupRequest);
    AuthResponse register(SignupRequest signupRequest);
    
    // Token management
    AuthResponse verify(String token);
    void logout(String token);
    
    // User info
    AuthResponse getUserInfo(Long userId);
}
