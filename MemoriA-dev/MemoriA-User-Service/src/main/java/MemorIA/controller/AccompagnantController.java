package MemorIA.controller;

import MemorIA.dto.AccompagnantDTO;
import MemorIA.service.IAccompagnantService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/accompagnants")
@Slf4j
public class AccompagnantController {

    @Autowired
    private IAccompagnantService accompagnantService;

    @PostMapping
    public ResponseEntity<AccompagnantDTO> createAccompagnant(@RequestBody AccompagnantDTO accompagnantDTO) {
        log.info("Creating accompagnant for user: {}", accompagnantDTO.getUserId());
        AccompagnantDTO createdAccompagnant = accompagnantService.createAccompagnant(accompagnantDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccompagnant);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccompagnantDTO> getAccompagnantById(@PathVariable Long id) {
        log.info("Getting accompagnant: {}", id);
        Optional<AccompagnantDTO> accompagnant = accompagnantService.getAccompagnantById(id);
        return accompagnant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<AccompagnantDTO> getAccompagnantByUserId(@PathVariable Long userId) {
        log.info("Getting accompagnant for user: {}", userId);
        Optional<AccompagnantDTO> accompagnant = accompagnantService.getAccompagnantByUserId(userId);
        return accompagnant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<AccompagnantDTO>> getAllActiveAccompagnants() {
        log.info("Getting all active accompagnants");
        List<AccompagnantDTO> accompagnants = accompagnantService.getAllActiveAccompagnants();
        return ResponseEntity.ok(accompagnants);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccompagnantDTO> updateAccompagnant(@PathVariable Long id, @RequestBody AccompagnantDTO accompagnantDTO) {
        log.info("Updating accompagnant: {}", id);
        AccompagnantDTO updatedAccompagnant = accompagnantService.updateAccompagnant(id, accompagnantDTO);
        if (updatedAccompagnant != null) {
            return ResponseEntity.ok(updatedAccompagnant);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccompagnant(@PathVariable Long id) {
        log.info("Deleting accompagnant: {}", id);
        accompagnantService.deleteAccompagnant(id);
        return ResponseEntity.noContent().build();
    }
}
