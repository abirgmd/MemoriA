package MemorIA.controller;

import MemorIA.entity.Traitements.HistoriquePosition;
import MemorIA.entity.Traitements.Traitements;
import MemorIA.repository.LocationHistoryRepository;
import MemorIA.repository.TreatmentRepository;
import MemorIA.service.GeofenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/positions")
public class GpsPositionController {

    // In-memory: userId → latest position (for live tracking display)
    private final ConcurrentHashMap<String, Map<String, Object>> currentPositions = new ConcurrentHashMap<>();
    // In-memory: userId → [lat, lon] of previous point (for distance calculation)
    private final ConcurrentHashMap<String, double[]> lastLatLon = new ConcurrentHashMap<>();

    @Autowired
    private LocationHistoryRepository locationHistoryRepository;

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Autowired
    private GeofenceService geofenceService;

    // ── Incoming GPS payload ──────────────────────────────────────────────────
    public static class GpsIncoming {
        public String  user_id;
        public Double  lat;
        public Double  lon;
        public String  timestamp;
        public Long    traitement_id;  // optional — falls back to first traitement in DB
    }

    // ── POST /api/positions — receive position from simulator ─────────────────
    @PostMapping
    public ResponseEntity<?> receivePosition(@RequestBody GpsIncoming incoming) {
        if (incoming.user_id == null || incoming.lat == null || incoming.lon == null) {
            return ResponseEntity.badRequest().body("user_id, lat, lon are required");
        }

        String ts = (incoming.timestamp != null)
                ? incoming.timestamp
                : LocalDateTime.now().toString();

        // 1. Update in-memory live store
        Map<String, Object> pos = new LinkedHashMap<>();
        pos.put("user_id",    incoming.user_id);
        pos.put("lat",        incoming.lat);
        pos.put("lon",        incoming.lon);
        pos.put("timestamp",  ts);
        currentPositions.put(incoming.user_id, pos);

        // 2. Save to historique_position
        try {
            double[] prev = lastLatLon.get(incoming.user_id);
            lastLatLon.put(incoming.user_id, new double[]{ incoming.lat, incoming.lon });

            Traitements traitement = resolveTraitement(incoming.traitement_id);
            if (traitement != null) {
                HistoriquePosition h = new HistoriquePosition();
                h.setLatitude(incoming.lat);
                h.setLongitude(incoming.lon);
                h.setHeureArrive(LocalDateTime.now());
                h.setDateEnregistrement(LocalDateTime.now());
                h.setTraitements(traitement);

                if (prev != null) {
                    double dist = haversine(prev[0], prev[1], incoming.lat, incoming.lon);
                    h.setDistancePointPrecedent(dist);
                }

                locationHistoryRepository.save(h);

                // Vérifier si le patient a quitté la zone autorisée
                geofenceService.checkGeofence(incoming.lat, incoming.lon, traitement);
            }
        } catch (Exception e) {
            // Log but don't fail the response — live tracking must not break
            System.err.println("[GpsPositionController] DB save error: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }

    // ── GET /api/positions — return current live positions ────────────────────
    @GetMapping
    public ResponseEntity<?> getPositions() {
        List<Map<String, Object>> list = new ArrayList<>(currentPositions.values());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("positions", list);
        response.put("total",     list.size());
        return ResponseEntity.ok(response);
    }

    // ── DELETE /api/positions/{userId} — remove a tracked user ───────────────
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> removeUser(@PathVariable String userId) {
        currentPositions.remove(userId);
        lastLatLon.remove(userId);
        return ResponseEntity.noContent().build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Traitements resolveTraitement(Long id) {
        if (id != null) {
            return treatmentRepository.findById(id).orElse(null);
        }
        List<Traitements> all = treatmentRepository.findAll();
        return all.isEmpty() ? null : all.get(0);
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(dist * 10.0) / 10.0; // 1 decimal meter
    }
}
