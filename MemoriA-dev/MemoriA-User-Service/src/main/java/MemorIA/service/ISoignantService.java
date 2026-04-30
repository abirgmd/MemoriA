package MemorIA.service;

import MemorIA.dto.SoignantDTO;
import java.util.List;
import java.util.Optional;

public interface ISoignantService {
    SoignantDTO createSoignant(SoignantDTO soignantDTO);
    SoignantDTO updateSoignant(Long id, SoignantDTO soignantDTO);
    Optional<SoignantDTO> getSoignantById(Long id);
    Optional<SoignantDTO> getSoignantByUserId(Long userId);
    List<SoignantDTO> getAllActiveSoignants();
    void deleteSoignant(Long id);
}
