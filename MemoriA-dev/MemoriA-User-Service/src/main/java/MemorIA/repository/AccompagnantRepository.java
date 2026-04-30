package MemorIA.repository;

import MemorIA.entity.Accompagnant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccompagnantRepository extends JpaRepository<Accompagnant, Long> {
    Optional<Accompagnant> findByUserId(Long userId);
    Optional<Accompagnant> findByEmail(String email);
    List<Accompagnant> findByIsActiveTrue();
}
