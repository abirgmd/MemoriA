package MemorIA.repository;

import MemorIA.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByPatientId(Long patientId);

    List<Reminder> findByPatientIdAndReminderStatus(Long patientId, String reminderStatus);

    List<Reminder> findByScheduledDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Reminder> findByPatientIdAndScheduledDateAfter(Long patientId, LocalDateTime date);
}
