package MemorIA.service;

import MemorIA.dto.AccompagnantDTO;
import java.util.List;
import java.util.Optional;

public interface IAccompagnantService {
    AccompagnantDTO createAccompagnant(AccompagnantDTO accompagnantDTO);
    AccompagnantDTO updateAccompagnant(Long id, AccompagnantDTO accompagnantDTO);
    Optional<AccompagnantDTO> getAccompagnantById(Long id);
    Optional<AccompagnantDTO> getAccompagnantByUserId(Long userId);
    List<AccompagnantDTO> getAllActiveAccompagnants();
    void deleteAccompagnant(Long id);
}
