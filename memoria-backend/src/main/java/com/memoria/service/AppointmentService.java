package com.memoria.service;

import com.memoria.dto.AppointmentRequestDTO;
import com.memoria.dto.AppointmentResponseDTO;
import com.memoria.entity.Appointment;
import com.memoria.entity.User;
import com.memoria.exception.CustomExceptions;
import com.memoria.repository.AppointmentRepository;
import com.memoria.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentResponseDTO create(AppointmentRequestDTO dto) {
        User doctor = userRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Médecin non trouvé"));
        User patient = userRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Patient non trouvé"));

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .type(dto.getType())
                .status(dto.getStatus() != null ? dto.getStatus() : "PENDING")
                .build();

        return toDTO(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDTO findById(Long id) {
        return toDTO(appointmentRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Rendez-vous non trouvé")));
    }

    public List<AppointmentResponseDTO> findByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByStartTimeAsc(doctorId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<AppointmentResponseDTO> findByPatientId(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByStartTimeAsc(patientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<AppointmentResponseDTO> findUpcomingByPatientId(Long patientId) {
        return appointmentRepository.findUpcomingByPatientId(patientId, LocalDateTime.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AppointmentResponseDTO update(Long id, AppointmentRequestDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Rendez-vous non trouvé"));

        if (dto.getDoctorId() != null) {
            User doctor = userRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Médecin non trouvé"));
            appointment.setDoctor(doctor);
        }
        if (dto.getPatientId() != null) {
            User patient = userRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Patient non trouvé"));
            appointment.setPatient(patient);
        }
        if (dto.getTitle() != null) appointment.setTitle(dto.getTitle());
        if (dto.getDescription() != null) appointment.setDescription(dto.getDescription());
        if (dto.getStartTime() != null) appointment.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) appointment.setEndTime(dto.getEndTime());
        if (dto.getType() != null) appointment.setType(dto.getType());
        if (dto.getStatus() != null) appointment.setStatus(dto.getStatus());

        return toDTO(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDTO updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Rendez-vous non trouvé"));
        appointment.setStatus(status);
        return toDTO(appointmentRepository.save(appointment));
    }

    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new CustomExceptions.ResourceNotFoundException("Rendez-vous non trouvé");
        }
        appointmentRepository.deleteById(id);
    }

    private AppointmentResponseDTO toDTO(Appointment a) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(a.getId());
        dto.setDoctorId(a.getDoctor().getId());
        dto.setDoctorNom(a.getDoctor().getNom());
        dto.setDoctorPrenom(a.getDoctor().getPrenom());
        dto.setPatientId(a.getPatient().getId());
        dto.setPatientNom(a.getPatient().getNom());
        dto.setPatientPrenom(a.getPatient().getPrenom());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setStartTime(a.getStartTime());
        dto.setEndTime(a.getEndTime());
        dto.setStatus(a.getStatus());
        dto.setType(a.getType());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }
}
