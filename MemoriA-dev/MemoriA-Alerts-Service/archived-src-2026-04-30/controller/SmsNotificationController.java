package MemorIA.controller;

import MemorIA.entity.SmsNotification;
import MemorIA.service.ISmsNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts/sms")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200"})
@Slf4j
public class SmsNotificationController {

    private final ISmsNotificationService smsNotificationService;

    @PostMapping
    public ResponseEntity<SmsNotification> sendSms(
            @RequestParam Long alertId,
            @RequestParam String phoneNumber,
            @RequestBody String message) {

        log.info("Sending SMS to {} for alert: {}", phoneNumber, alertId);
        SmsNotification sms = smsNotificationService.sendSms(alertId, phoneNumber, message);
        return ResponseEntity.status(HttpStatus.CREATED).body(sms);
    }

    @GetMapping("/alert/{alertId}")
    public ResponseEntity<List<SmsNotification>> getSmsNotificationsByAlert(@PathVariable Long alertId) {
        log.info("Fetching SMS notifications for alert: {}", alertId);
        List<SmsNotification> notifications = smsNotificationService.getSmsNotificationsByAlertId(alertId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SmsNotification>> getPendingSmsNotifications() {
        log.info("Fetching pending SMS notifications");
        List<SmsNotification> notifications = smsNotificationService.getPendingSmsNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SmsNotification> getSmsNotificationById(@PathVariable Long id) {
        log.info("Fetching SMS notification: {}", id);
        SmsNotification notification = smsNotificationService.getSmsNotificationById(id);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/{id}/mark-sent")
    public ResponseEntity<Void> markAsSent(
            @PathVariable Long id,
            @RequestParam String twilioSid) {

        log.info("Marking SMS {} as sent with Twilio SID: {}", id, twilioSid);
        smsNotificationService.markAsSent(id, twilioSid);
        return ResponseEntity.noContent().build();
    }
}
