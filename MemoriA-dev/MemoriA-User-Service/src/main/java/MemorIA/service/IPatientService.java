package MemorIA.service;

import MemorIA.dto.PatientDTO;
import java.util.List;
import java.util.Optional;

public interface IPatientService {
    PatientDTO createPatient(PatientDTO patientDTO);
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    Optional<PatientDTO> getPatientById(Long id);
    Optional<PatientDTO> getPatientByUserId(Long userId);
    List<PatientDTO> getAllActivePatients();
    void deletePatient(Long id);
}
