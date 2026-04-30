package MemorIA.service;

import MemorIA.entity.Adherence;

import java.time.LocalDate;
import java.util.List;

public interface IAdherenceService {
    Adherence recordAdherence(Adherence adherence);

    Adherence getAdherenceById(Long id);

    List<Adherence> getAdherenceByPatientId(Long patientId);

    List<Adherence> getAdherenceByPatientIdAndDateRange(Long patientId, LocalDate startDate, LocalDate endDate);

    double getAdherenceRate(Long patientId, LocalDate startDate, LocalDate endDate);
}
