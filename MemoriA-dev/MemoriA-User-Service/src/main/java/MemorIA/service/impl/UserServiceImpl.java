package MemorIA.service.impl;

import MemorIA.entity.User;
import MemorIA.repository.UserRepository;
import MemorIA.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        if (userDetails.getNom() != null) {
            user.setNom(userDetails.getNom());
        }
        if (userDetails.getPrenom() != null) {
            user.setPrenom(userDetails.getPrenom());
        }
        if (userDetails.getTelephone() != null) {
            user.setTelephone(userDetails.getTelephone());
        }
        if (userDetails.getProfileCompleted() != null) {
            user.setProfileCompleted(userDetails.getProfileCompleted());
        }
        
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    @Override
    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setActif(!user.getActif());
        return userRepository.save(user);
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    @Override
    public Long getActiveUsersCount() {
        return userRepository.countByActifTrue();
    }
}
