package com.med.cognitive.service;

import com.med.cognitive.entity.PatientTestAssignment;
import com.med.cognitive.entity.CognitiveTest;
import com.med.cognitive.repository.PatientTestAssignmentRepository;
import com.med.cognitive.repository.CognitiveTestRepository;
import com.med.cognitive.exception.ResourceNotFoundException;
import com.med.cognitive.validator.TestAssignmentValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientTestAssignmentService {

    private final PatientTestAssignmentRepository repository;
    private final CognitiveTestRepository testRepository;
    private final TestAssignmentValidator validator;

    public List<PatientTestAssignment> getByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }

    public PatientTestAssignment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
    }

    public PatientTestAssignment assignTest(String patientId, Long testId, String assignedBy, LocalDateTime dueDate) {
        CognitiveTest test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + testId));

        PatientTestAssignment assignment = new PatientTestAssignment();
        assignment.setPatientId(patientId);
        assignment.setTest(test);
        assignment.setAssignedBy(assignedBy);
        assignment.setDueDate(dueDate);

        validator.validate(assignment);

        return repository.save(assignment);
    }

    public PatientTestAssignment updateStatus(Long id, PatientTestAssignment.AssignmentStatus newStatus) {
        PatientTestAssignment assignment = getById(id);
        assignment.setStatus(newStatus);

        if (newStatus == PatientTestAssignment.AssignmentStatus.COMPLETED) {
            assignment.setCompletedDate(LocalDateTime.now());
        }

        return repository.save(assignment);
    }

    public void sendReminder(Long id) {
        PatientTestAssignment assignment = getById(id);
        assignment.setReminderSent(true);
        assignment.setReminderCount(assignment.getReminderCount() + 1);
        repository.save(assignment);
    }
}
