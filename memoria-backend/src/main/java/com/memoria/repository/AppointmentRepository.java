package com.memoria.repository;

import com.memoria.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorIdOrderByStartTimeAsc(Long doctorId);

    List<Appointment> findByPatientIdOrderByStartTimeAsc(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.startTime >= :now ORDER BY a.startTime ASC")
    List<Appointment> findUpcomingByPatientId(@Param("patientId") Long patientId, @Param("now") LocalDateTime now);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.startTime >= :start AND a.startTime <= :end ORDER BY a.startTime ASC")
    List<Appointment> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId,
                                                  @Param("start") LocalDateTime start,
                                                  @Param("end") LocalDateTime end);
}
