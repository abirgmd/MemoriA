package com.med.cognitive.validator;

import com.med.cognitive.entity.PatientTestAssignment;
import com.med.cognitive.exception.BusinessLogicException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TestAssignmentValidator {
    public void validate(PatientTestAssignment assignment) {
        if (assignment.getDueDate() != null && assignment.getDueDate().isBefore(LocalDateTime.now())) {
            throw new BusinessLogicException("La date limite doit être future");
        }
        if (assignment.getTest() != null && !Boolean.TRUE.equals(assignment.getTest().getIsActive())) {
            throw new BusinessLogicException("Impossible d'assigner un test inactif");
        }
    }
}
