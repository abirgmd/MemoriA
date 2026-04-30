package MemorIA.controller;

import MemorIA.dto.PatientDTO;
import MemorIA.service.IPatientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/patients")
@Slf4j
public class PatientController {

    @Autowired
    private IPatientService patientService;

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@RequestBody PatientDTO patientDTO) {
        log.info("Creating patient for user: {}", patientDTO.getUserId());
        PatientDTO createdPatient = patientService.createPatient(patientDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPatient);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        log.info("Getting patient: {}", id);
        Optional<PatientDTO> patient = patientService.getPatientById(id);
        return patient.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PatientDTO> getPatientByUserId(@PathVariable Long userId) {
        log.info("Getting patient for user: {}", userId);
        Optional<PatientDTO> patient = patientService.getPatientByUserId(userId);
        return patient.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllActivePatients() {
        log.info("Getting all active patients");
        List<PatientDTO> patients = patientService.getAllActivePatients();
        return ResponseEntity.ok(patients);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
        log.info("Updating patient: {}", id);
        PatientDTO updatedPatient = patientService.updatePatient(id, patientDTO);
        if (updatedPatient != null) {
            return ResponseEntity.ok(updatedPatient);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        log.info("Deleting patient: {}", id);
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
