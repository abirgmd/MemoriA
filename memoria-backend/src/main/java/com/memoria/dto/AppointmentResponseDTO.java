package com.memoria.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentResponseDTO {
    private Long id;
    private Long doctorId;
    private String doctorNom;
    private String doctorPrenom;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
