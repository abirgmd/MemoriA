package com.med.cognitive.controller;

import com.med.cognitive.entity.PatientTestAssignment;
import com.med.cognitive.service.PatientTestAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientTestAssignmentController {

    private final PatientTestAssignmentService service;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PatientTestAssignment>> getByPatient(@PathVariable("patientId") String patientId) {
        return ResponseEntity.ok(service.getByPatientId(patientId));
    }

    @PostMapping("/patients/{patientId}/tests/{testId}")
    public ResponseEntity<PatientTestAssignment> assignTest(
            @PathVariable("patientId") String patientId,
            @PathVariable("testId") Long testId,
            @RequestParam("assignedBy") String assignedBy,
            @RequestParam(value = "dueDate", required = false) LocalDateTime dueDate) {
        return new ResponseEntity<>(service.assignTest(patientId, testId, assignedBy, dueDate), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PatientTestAssignment> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") PatientTestAssignment.AssignmentStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @PostMapping("/{id}/send-reminder")
    public ResponseEntity<Void> sendReminder(@PathVariable("id") Long id) {
        service.sendReminder(id);
        return ResponseEntity.ok().build();
    }
}
