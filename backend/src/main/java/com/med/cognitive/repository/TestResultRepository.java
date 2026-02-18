package com.med.cognitive.repository;

import com.med.cognitive.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {

    List<TestResult> findByPatientIdOrderByTestDateDesc(String patientId);

    List<TestResult> findByTestId(Long testId);

    Optional<TestResult> findTopByPatientIdOrderByTestDateDesc(String patientId);

    @Query("SELECT AVG(t.scoreTotale) FROM TestResult t WHERE t.patientId = ?1")
    Double getAverageScoreByPatient(String patientId);
}
