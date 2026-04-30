package MemorIA.service;

import MemorIA.dto.AccompagnantDTO;
import MemorIA.entity.Accompagnant;
import MemorIA.repository.AccompagnantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AccompagnantServiceImpl implements IAccompagnantService {

    @Autowired
    private AccompagnantRepository accompagnantRepository;

    @Override
    public AccompagnantDTO createAccompagnant(AccompagnantDTO accompagnantDTO) {
        log.info("Creating accompagnant for user: {}", accompagnantDTO.getUserId());
        Accompagnant accompagnant = Accompagnant.builder()
                .userId(accompagnantDTO.getUserId())
                .firstName(accompagnantDTO.getFirstName())
                .lastName(accompagnantDTO.getLastName())
                .email(accompagnantDTO.getEmail())
                .phone(accompagnantDTO.getPhone())
                .relation(accompagnantDTO.getRelation())
                .address(accompagnantDTO.getAddress())
                .build();

        accompagnant = accompagnantRepository.save(accompagnant);
        log.info("Accompagnant created with id: {}", accompagnant.getId());
        return convertToDTO(accompagnant);
    }

    @Override
    public AccompagnantDTO updateAccompagnant(Long id, AccompagnantDTO accompagnantDTO) {
        log.info("Updating accompagnant: {}", id);
        Optional<Accompagnant> accompagnantOptional = accompagnantRepository.findById(id);
        
        if (accompagnantOptional.isPresent()) {
            Accompagnant accompagnant = accompagnantOptional.get();
            accompagnant.setFirstName(accompagnantDTO.getFirstName());
            accompagnant.setLastName(accompagnantDTO.getLastName());
            accompagnant.setEmail(accompagnantDTO.getEmail());
            accompagnant.setPhone(accompagnantDTO.getPhone());
            accompagnant.setRelation(accompagnantDTO.getRelation());
            accompagnant.setAddress(accompagnantDTO.getAddress());
            
            accompagnant = accompagnantRepository.save(accompagnant);
            log.info("Accompagnant updated: {}", id);
            return convertToDTO(accompagnant);
        }
        
        log.warn("Accompagnant not found: {}", id);
        return null;
    }

    @Override
    public Optional<AccompagnantDTO> getAccompagnantById(Long id) {
        return accompagnantRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public Optional<AccompagnantDTO> getAccompagnantByUserId(Long userId) {
        return accompagnantRepository.findByUserId(userId).map(this::convertToDTO);
    }

    @Override
    public List<AccompagnantDTO> getAllActiveAccompagnants() {
        return accompagnantRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAccompagnant(Long id) {
        log.info("Deleting accompagnant: {}", id);
        accompagnantRepository.deleteById(id);
    }

    private AccompagnantDTO convertToDTO(Accompagnant accompagnant) {
        return AccompagnantDTO.builder()
                .id(accompagnant.getId())
                .userId(accompagnant.getUserId())
                .firstName(accompagnant.getFirstName())
                .lastName(accompagnant.getLastName())
                .email(accompagnant.getEmail())
                .phone(accompagnant.getPhone())
                .relation(accompagnant.getRelation())
                .address(accompagnant.getAddress())
                .isActive(accompagnant.getIsActive())
                .build();
    }
}
