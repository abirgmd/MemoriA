package MemorIA.service;

import MemorIA.dto.AlertDTO;
import MemorIA.entity.alerts.Alert;
import MemorIA.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertRepository alertRepository;

    public List<AlertDTO> getAlertsForCurrentUser(Long userId, String role) {
        log.info("[AlertService] Getting alerts for user {} with role {}", userId, role);
        return Collections.emptyList();
    }

    public List<AlertDTO> getAlertsForPatient(Long patientId) {
        log.info("[AlertService] Getting alerts for patient {}", patientId);
        return Collections.emptyList();
    }

    public AlertDTO getAlertById(Long alertId) {
        log.info("[AlertService] Getting alert {}", alertId);
        throw new RuntimeException("Alert not found: " + alertId);
    }

}
