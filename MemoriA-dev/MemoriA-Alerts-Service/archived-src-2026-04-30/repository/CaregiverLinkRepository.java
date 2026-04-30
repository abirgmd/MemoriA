package MemorIA.repository;

import MemorIA.entity.CaregiverLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CaregiverLinkRepository extends JpaRepository<CaregiverLink, Long> {
    List<CaregiverLink> findByCaregiverId(Long caregiverId);
    Optional<CaregiverLink> findByCaregiverIdAndPatientId(Long caregiverId, Long patientId);
    List<CaregiverLink> findByPatientIdAndStatus(Long patientId, String status);
}
