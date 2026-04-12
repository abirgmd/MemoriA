package MemorIA.controller;

import MemorIA.entity.Traitements.AlertPatient;
import MemorIA.service.AlertPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
public class AlertPatientController {

    @Autowired
    private AlertPatientService alertPatientService;

    @GetMapping
    public ResponseEntity<List<AlertPatient>> getAllAlerts() {
        return ResponseEntity.ok(alertPatientService.getAllAlerts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertPatient> getAlertById(@PathVariable Long id) {
        Optional<AlertPatient> alert = alertPatientService.getAlertById(id);
        return alert.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Toutes les alertes d'un traitement (triées par date desc)
    @GetMapping("/traitement/{idTraitement}")
    public ResponseEntity<List<AlertPatient>> getAlertsByTraitement(@PathVariable Long idTraitement) {
        return ResponseEntity.ok(alertPatientService.getAlertsByTraitementSorted(idTraitement));
    }

    // Alertes non-lues d'un traitement (pour les notifications)
    @GetMapping("/traitement/{idTraitement}/unread")
    public ResponseEntity<List<AlertPatient>> getUnreadAlerts(@PathVariable Long idTraitement) {
        return ResponseEntity.ok(alertPatientService.getUnreadAlertsByTraitement(idTraitement));
    }

    // Nombre d'alertes non-lues (pour le badge notification)
    @GetMapping("/traitement/{idTraitement}/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long idTraitement) {
        long count = alertPatientService.countUnreadAlerts(idTraitement);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Marquer une alerte comme lue
    @PatchMapping("/{id}/read")
    public ResponseEntity<AlertPatient> markAsRead(@PathVariable Long id) {
        AlertPatient alert = alertPatientService.markAsRead(id);
        if (alert != null) {
            return ResponseEntity.ok(alert);
        }
        return ResponseEntity.notFound().build();
    }

    // Marquer toutes les alertes d'un traitement comme lues
    @PatchMapping("/traitement/{idTraitement}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long idTraitement) {
        alertPatientService.markAllAsRead(idTraitement);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<AlertPatient> createAlert(@RequestBody AlertPatient alert) {
        return ResponseEntity.ok(alertPatientService.createAlert(alert));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlertPatient> updateAlert(@PathVariable Long id, @RequestBody AlertPatient alertDetails) {
        AlertPatient updatedAlert = alertPatientService.updateAlert(id, alertDetails);
        if (updatedAlert != null) {
            return ResponseEntity.ok(updatedAlert);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        if (alertPatientService.alertExists(id)) {
            alertPatientService.deleteAlert(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
