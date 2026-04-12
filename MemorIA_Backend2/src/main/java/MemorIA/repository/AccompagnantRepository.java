package MemorIA.repository;

import MemorIA.entity.Accompagnant;
import MemorIA.entity.role.StatutDisponibilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccompagnantRepository extends JpaRepository<Accompagnant, Long> {
    
    @Query("SELECT DISTINCT a FROM Accompagnant a " +
           "INNER JOIN Disponibilite d ON d.user.id = a.user.id " +
           "WHERE d.statut = :statut")
    List<Accompagnant> findByDisponibiliteStatut(@Param("statut") StatutDisponibilite statut);
}
