package MemorIA.controller;

import MemorIA.entity.Alert;
import MemorIA.service.IAlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200"})
@Slf4j
public class AlertController {

    private final IAlertService alertService;

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
        log.info("Creating alert for patient: {}", alert.getPatientId());
        Alert created = alertService.createAlert(alert);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Alert>> getAlertsByPatient(@PathVariable Long patientId) {
        log.info("Fetching alerts for patient: {}", patientId);
        List<Alert> alerts = alertService.getAlertsByPatientId(patientId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/patient/{patientId}/pending")
    public ResponseEntity<List<Alert>> getPendingAlerts(@PathVariable Long patientId) {
        log.info("Fetching pending alerts for patient: {}", patientId);
        List<Alert> alerts = alertService.getPendingAlerts(patientId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
        log.info("Fetching alert: {}", id);
        Alert alert = alertService.getAlertById(id);
        return ResponseEntity.ok(alert);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alert> updateAlert(@PathVariable Long id, @RequestBody Alert alert) {
        log.info("Updating alert: {}", id);
        Alert updated = alertService.updateAlert(id, alert);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Void> resolveAlert(@PathVariable Long id) {
        log.info("Resolving alert: {}", id);
        alertService.resolveAlert(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        log.info("Deleting alert: {}", id);
        alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }

}
