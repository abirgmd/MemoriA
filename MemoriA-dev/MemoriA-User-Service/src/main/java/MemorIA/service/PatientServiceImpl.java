package MemorIA.service;

import MemorIA.dto.PatientDTO;
import MemorIA.entity.Patient;
import MemorIA.repository.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PatientServiceImpl implements IPatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {
        log.info("Creating patient for user: {}", patientDTO.getUserId());
        Patient patient = Patient.builder()
                .userId(patientDTO.getUserId())
                .firstName(patientDTO.getFirstName())
                .lastName(patientDTO.getLastName())
                .email(patientDTO.getEmail())
                .phone(patientDTO.getPhone())
                .address(patientDTO.getAddress())
                .city(patientDTO.getCity())
                .zipCode(patientDTO.getZipCode())
                .medicalConditions(patientDTO.getMedicalConditions())
                .allergies(patientDTO.getAllergies())
                .emergencyContact(patientDTO.getEmergencyContact())
                .emergencyPhone(patientDTO.getEmergencyPhone())
                .build();

        patient = patientRepository.save(patient);
        log.info("Patient created with id: {}", patient.getId());
        return convertToDTO(patient);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        log.info("Updating patient: {}", id);
        Optional<Patient> patientOptional = patientRepository.findById(id);
        
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            patient.setFirstName(patientDTO.getFirstName());
            patient.setLastName(patientDTO.getLastName());
            patient.setEmail(patientDTO.getEmail());
            patient.setPhone(patientDTO.getPhone());
            patient.setAddress(patientDTO.getAddress());
            patient.setCity(patientDTO.getCity());
            patient.setZipCode(patientDTO.getZipCode());
            patient.setMedicalConditions(patientDTO.getMedicalConditions());
            patient.setAllergies(patientDTO.getAllergies());
            patient.setEmergencyContact(patientDTO.getEmergencyContact());
            patient.setEmergencyPhone(patientDTO.getEmergencyPhone());
            
            patient = patientRepository.save(patient);
            log.info("Patient updated: {}", id);
            return convertToDTO(patient);
        }
        
        log.warn("Patient not found: {}", id);
        return null;
    }

    @Override
    public Optional<PatientDTO> getPatientById(Long id) {
        return patientRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public Optional<PatientDTO> getPatientByUserId(Long userId) {
        return patientRepository.findByUserId(userId).map(this::convertToDTO);
    }

    @Override
    public List<PatientDTO> getAllActivePatients() {
        return patientRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deletePatient(Long id) {
        log.info("Deleting patient: {}", id);
        patientRepository.deleteById(id);
    }

    private PatientDTO convertToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .userId(patient.getUserId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .address(patient.getAddress())
                .city(patient.getCity())
                .zipCode(patient.getZipCode())
                .medicalConditions(patient.getMedicalConditions())
                .allergies(patient.getAllergies())
                .emergencyContact(patient.getEmergencyContact())
                .emergencyPhone(patient.getEmergencyPhone())
                .isActive(patient.getIsActive())
                .build();
    }
}
