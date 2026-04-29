package com.memoria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentRequestDTO {
    @NotNull
    private Long doctorId;
    @NotNull
    private Long patientId;
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private LocalDateTime startTime;
    @NotNull
    private LocalDateTime endTime;
    @NotBlank
    private String type;
    private String status;
}
