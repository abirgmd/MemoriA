package MemorIA.service;

import MemorIA.dto.SoignantDTO;
import MemorIA.entity.Soignant;
import MemorIA.repository.SoignantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SoignantServiceImpl implements ISoignantService {

    @Autowired
    private SoignantRepository soignantRepository;

    @Override
    public SoignantDTO createSoignant(SoignantDTO soignantDTO) {
        log.info("Creating soignant for user: {}", soignantDTO.getUserId());
        Soignant soignant = Soignant.builder()
                .userId(soignantDTO.getUserId())
                .firstName(soignantDTO.getFirstName())
                .lastName(soignantDTO.getLastName())
                .email(soignantDTO.getEmail())
                .phone(soignantDTO.getPhone())
                .speciality(soignantDTO.getSpeciality())
                .license(soignantDTO.getLicense())
                .hospital(soignantDTO.getHospital())
                .build();

        soignant = soignantRepository.save(soignant);
        log.info("Soignant created with id: {}", soignant.getId());
        return convertToDTO(soignant);
    }

    @Override
    public SoignantDTO updateSoignant(Long id, SoignantDTO soignantDTO) {
        log.info("Updating soignant: {}", id);
        Optional<Soignant> soignantOptional = soignantRepository.findById(id);
        
        if (soignantOptional.isPresent()) {
            Soignant soignant = soignantOptional.get();
            soignant.setFirstName(soignantDTO.getFirstName());
            soignant.setLastName(soignantDTO.getLastName());
            soignant.setEmail(soignantDTO.getEmail());
            soignant.setPhone(soignantDTO.getPhone());
            soignant.setSpeciality(soignantDTO.getSpeciality());
            soignant.setLicense(soignantDTO.getLicense());
            soignant.setHospital(soignantDTO.getHospital());
            
            soignant = soignantRepository.save(soignant);
            log.info("Soignant updated: {}", id);
            return convertToDTO(soignant);
        }
        
        log.warn("Soignant not found: {}", id);
        return null;
    }

    @Override
    public Optional<SoignantDTO> getSoignantById(Long id) {
        return soignantRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public Optional<SoignantDTO> getSoignantByUserId(Long userId) {
        return soignantRepository.findByUserId(userId).map(this::convertToDTO);
    }

    @Override
    public List<SoignantDTO> getAllActiveSoignants() {
        return soignantRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteSoignant(Long id) {
        log.info("Deleting soignant: {}", id);
        soignantRepository.deleteById(id);
    }

    private SoignantDTO convertToDTO(Soignant soignant) {
        return SoignantDTO.builder()
                .id(soignant.getId())
                .userId(soignant.getUserId())
                .firstName(soignant.getFirstName())
                .lastName(soignant.getLastName())
                .email(soignant.getEmail())
                .phone(soignant.getPhone())
                .speciality(soignant.getSpeciality())
                .license(soignant.getLicense())
                .hospital(soignant.getHospital())
                .isActive(soignant.getIsActive())
                .build();
    }
}
