package MemorIA.controller;

import MemorIA.dto.SoignantDTO;
import MemorIA.service.ISoignantService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/soignants")
@Slf4j
public class SoignantController {

    @Autowired
    private ISoignantService soignantService;

    @PostMapping
    public ResponseEntity<SoignantDTO> createSoignant(@RequestBody SoignantDTO soignantDTO) {
        log.info("Creating soignant for user: {}", soignantDTO.getUserId());
        SoignantDTO createdSoignant = soignantService.createSoignant(soignantDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSoignant);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SoignantDTO> getSoignantById(@PathVariable Long id) {
        log.info("Getting soignant: {}", id);
        Optional<SoignantDTO> soignant = soignantService.getSoignantById(id);
        return soignant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<SoignantDTO> getSoignantByUserId(@PathVariable Long userId) {
        log.info("Getting soignant for user: {}", userId);
        Optional<SoignantDTO> soignant = soignantService.getSoignantByUserId(userId);
        return soignant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<SoignantDTO>> getAllActiveSoignants() {
        log.info("Getting all active soignants");
        List<SoignantDTO> soignants = soignantService.getAllActiveSoignants();
        return ResponseEntity.ok(soignants);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SoignantDTO> updateSoignant(@PathVariable Long id, @RequestBody SoignantDTO soignantDTO) {
        log.info("Updating soignant: {}", id);
        SoignantDTO updatedSoignant = soignantService.updateSoignant(id, soignantDTO);
        if (updatedSoignant != null) {
            return ResponseEntity.ok(updatedSoignant);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSoignant(@PathVariable Long id) {
        log.info("Deleting soignant: {}", id);
        soignantService.deleteSoignant(id);
        return ResponseEntity.noContent().build();
    }
}
