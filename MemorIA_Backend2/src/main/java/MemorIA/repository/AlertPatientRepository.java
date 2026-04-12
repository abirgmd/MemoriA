package MemorIA.repository;

import MemorIA.entity.Traitements.AlertPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertPatientRepository extends JpaRepository<AlertPatient, Long> {

    List<AlertPatient> findByTraitementsIdTraitement(Long idTraitement);

    List<AlertPatient> findByTraitementsIdTraitementOrderByDateAlerteDesc(Long idTraitement);

    List<AlertPatient> findByTraitementsIdTraitementAndLuFalseOrderByDateAlerteDesc(Long idTraitement);

    long countByTraitementsIdTraitementAndLuFalse(Long idTraitement);
}
