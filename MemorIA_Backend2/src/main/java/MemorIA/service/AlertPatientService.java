package MemorIA.service;

import MemorIA.entity.Traitements.AlertPatient;
import MemorIA.repository.AlertPatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AlertPatientService {

    @Autowired
    private AlertPatientRepository alertPatientRepository;

    public List<AlertPatient> getAllAlerts() {
        return alertPatientRepository.findAll();
    }

    public Optional<AlertPatient> getAlertById(Long id) {
        return alertPatientRepository.findById(id);
    }

    public List<AlertPatient> getAlertsByTraitement(Long idTraitement) {
        return alertPatientRepository.findByTraitementsIdTraitement(idTraitement);
    }

    public List<AlertPatient> getAlertsByTraitementSorted(Long idTraitement) {
        return alertPatientRepository.findByTraitementsIdTraitementOrderByDateAlerteDesc(idTraitement);
    }

    public List<AlertPatient> getUnreadAlertsByTraitement(Long idTraitement) {
        return alertPatientRepository.findByTraitementsIdTraitementAndLuFalseOrderByDateAlerteDesc(idTraitement);
    }

    public long countUnreadAlerts(Long idTraitement) {
        return alertPatientRepository.countByTraitementsIdTraitementAndLuFalse(idTraitement);
    }

    public AlertPatient markAsRead(Long id) {
        Optional<AlertPatient> alert = alertPatientRepository.findById(id);
        if (alert.isPresent()) {
            AlertPatient existing = alert.get();
            existing.setLu(true);
            return alertPatientRepository.save(existing);
        }
        return null;
    }

    public void markAllAsRead(Long idTraitement) {
        List<AlertPatient> unread = alertPatientRepository
                .findByTraitementsIdTraitementAndLuFalseOrderByDateAlerteDesc(idTraitement);
        for (AlertPatient a : unread) {
            a.setLu(true);
        }
        alertPatientRepository.saveAll(unread);
    }

    public AlertPatient createAlert(AlertPatient alert) {
        return alertPatientRepository.save(alert);
    }

    public AlertPatient updateAlert(Long id, AlertPatient alertDetails) {
        Optional<AlertPatient> alert = alertPatientRepository.findById(id);
        if (alert.isPresent()) {
            AlertPatient existingAlert = alert.get();
            if (alertDetails.getDateAlerte() != null) {
                existingAlert.setDateAlerte(alertDetails.getDateAlerte());
            }
            if (alertDetails.getAlert() != null) {
                existingAlert.setAlert(alertDetails.getAlert());
            }
            return alertPatientRepository.save(existingAlert);
        }
        return null;
    }

    public void deleteAlert(Long id) {
        alertPatientRepository.deleteById(id);
    }

    public boolean alertExists(Long id) {
        return alertPatientRepository.existsById(id);
    }
}
