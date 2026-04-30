package MemorIA.controller;

import MemorIA.entity.Adherence;
import MemorIA.service.IAdherenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/planning/adherence")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200"})
@Slf4j
public class AdherenceController {

    private final IAdherenceService adherenceService;

    @PostMapping
    public ResponseEntity<Adherence> recordAdherence(@RequestBody Adherence adherence) {
        log.info("Recording adherence for patient: {}", adherence.getPatientId());
        Adherence recorded = adherenceService.recordAdherence(adherence);
        return ResponseEntity.status(HttpStatus.CREATED).body(recorded);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Adherence>> getAdherenceByPatient(@PathVariable Long patientId) {
        log.info("Fetching adherence records for patient: {}", patientId);
        List<Adherence> records = adherenceService.getAdherenceByPatientId(patientId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/patient/{patientId}/rate")
    public ResponseEntity<Map<String, Object>> getAdherenceRate(
            @PathVariable Long patientId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        log.info("Fetching adherence rate for patient: {}", patientId);

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        double rate = adherenceService.getAdherenceRate(patientId, start, end);
        List<Adherence> records = adherenceService.getAdherenceByPatientIdAndDateRange(patientId, start, end);

        Map<String, Object> response = new HashMap<>();
        response.put("patientId", patientId);
        response.put("adherenceRate", rate);
        response.put("totalRecords", records.size());
        response.put("startDate", start);
        response.put("endDate", end);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adherence> getAdherenceById(@PathVariable Long id) {
        log.info("Fetching adherence: {}", id);
        Adherence adherence = adherenceService.getAdherenceById(id);
        return ResponseEntity.ok(adherence);
    }
}
