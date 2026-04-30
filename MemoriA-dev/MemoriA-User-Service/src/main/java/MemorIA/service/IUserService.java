package MemorIA.service;

import MemorIA.entity.User;
import java.util.List;

public interface IUserService {
    
    List<User> getAllUsers();
    
    User getUserById(Long id);
    
    User getUserByEmail(String email);
    
    User updateUser(Long id, User userDetails);
    
    void deleteUser(Long id);
    
    User toggleUserStatus(Long id);
    
    List<User> getUsersByRole(String role);
    
    Long getActiveUsersCount();
}
