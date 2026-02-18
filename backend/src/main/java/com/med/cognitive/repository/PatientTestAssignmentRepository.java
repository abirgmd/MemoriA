package com.med.cognitive.repository;

import com.med.cognitive.entity.PatientTestAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PatientTestAssignmentRepository extends JpaRepository<PatientTestAssignment, Long> {

        List<PatientTestAssignment> findByPatientId(String patientId);

        List<PatientTestAssignment> findByPatientIdAndStatus(String patientId,
                        PatientTestAssignment.AssignmentStatus status);

        List<PatientTestAssignment> findByStatusAndDueDateBefore(PatientTestAssignment.AssignmentStatus status,
                        LocalDateTime date);

        @Query("SELECT p FROM PatientTestAssignment p WHERE p.patientId = ?1 AND p.status IN ?2")
        List<PatientTestAssignment> findByPatientAndStatuses(String patientId,
                        List<PatientTestAssignment.AssignmentStatus> statuses);
}
