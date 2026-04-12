package MemorIA.repository;

import MemorIA.entity.Traitements.HistoriquePosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LocationHistoryRepository extends JpaRepository<HistoriquePosition, Long> {

    List<HistoriquePosition> findByTraitementsIdTraitement(Long traitementId);

    List<HistoriquePosition> findByDateEnregistrementBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<HistoriquePosition> findByTraitementsIdTraitementAndDateEnregistrementBetween(
            Long traitementId, LocalDateTime startDate, LocalDateTime endDate);

    List<HistoriquePosition> findByDateEnregistrementAfter(LocalDateTime date);
}
