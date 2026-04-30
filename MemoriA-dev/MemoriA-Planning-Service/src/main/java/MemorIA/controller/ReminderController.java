package MemorIA.controller;

import MemorIA.entity.Reminder;
import MemorIA.service.IReminderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planning/reminders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200"})
@Slf4j
public class ReminderController {

    private final IReminderService reminderService;

    @PostMapping
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder) {
        log.info("Creating reminder for patient: {}", reminder.getPatientId());
        Reminder created = reminderService.createReminder(reminder);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Reminder>> getRemindersByPatient(@PathVariable Long patientId) {
        log.info("Fetching reminders for patient: {}", patientId);
        List<Reminder> reminders = reminderService.getRemindersByPatientId(patientId);
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/patient/{patientId}/upcoming")
    public ResponseEntity<List<Reminder>> getUpcomingReminders(@PathVariable Long patientId) {
        log.info("Fetching upcoming reminders for patient: {}", patientId);
        List<Reminder> reminders = reminderService.getUpcomingReminders(patientId);
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getReminderById(@PathVariable Long id) {
        log.info("Fetching reminder: {}", id);
        Reminder reminder = reminderService.getReminderById(id);
        return ResponseEntity.ok(reminder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(@PathVariable Long id, @RequestBody Reminder reminder) {
        log.info("Updating reminder: {}", id);
        Reminder updated = reminderService.updateReminder(id, reminder);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> completeReminder(@PathVariable Long id) {
        log.info("Completing reminder: {}", id);
        reminderService.completeReminder(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        log.info("Deleting reminder: {}", id);
        reminderService.deleteReminder(id);
        return ResponseEntity.noContent().build();
    }
}
