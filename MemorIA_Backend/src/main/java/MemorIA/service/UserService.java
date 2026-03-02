package MemorIA.service;

import MemorIA.dto.LoginRequest;
import MemorIA.dto.LoginResponse;
import MemorIA.entity.User;
import MemorIA.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<LoginResponse> login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmailAndPassword(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Vérifier si l'utilisateur est actif
            if (!user.getActif()) {
                return Optional.empty();
            }

            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getNom(),
                    user.getPrenom(),
                    user.getTelephone(),
                    user.getRole(),
                    user.getActif(),
                    "Login successful"
            );
            return Optional.of(response);
        }

        return Optional.empty();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setNom(userDetails.getNom());
        user.setPrenom(userDetails.getPrenom());
        user.setEmail(userDetails.getEmail());
        user.setTelephone(userDetails.getTelephone());
        user.setRole(userDetails.getRole());
        user.setActif(userDetails.getActif());
        
        // Mettre à jour le mot de passe seulement s'il est fourni
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
