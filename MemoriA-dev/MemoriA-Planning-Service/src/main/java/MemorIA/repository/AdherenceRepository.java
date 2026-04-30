package MemorIA.repository;

import MemorIA.entity.Adherence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AdherenceRepository extends JpaRepository<Adherence, Long> {
    List<Adherence> findByPatientId(Long patientId);

    List<Adherence> findByPatientIdAndAdherenceDateBetween(Long patientId, LocalDate startDate, LocalDate endDate);

    List<Adherence> findByReminderId(Long reminderId);
}
