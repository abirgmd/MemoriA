package MemorIA.repository;

import MemorIA.entity.Soignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SoignantRepository extends JpaRepository<Soignant, Long> {
    Optional<Soignant> findByUserId(Long userId);
    Optional<Soignant> findByEmail(String email);
    List<Soignant> findByIsActiveTrue();
}
