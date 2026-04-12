package MemorIA.service;

import MemorIA.entity.Traitements.AlertPatient;
import MemorIA.entity.Traitements.TraitementAffectation;
import MemorIA.entity.Traitements.Traitements;
import MemorIA.entity.Traitements.ZoneAutorisee;
import MemorIA.entity.User;
import MemorIA.repository.AlertPatientRepository;
import MemorIA.repository.AuthorizedZoneRepository;
import MemorIA.repository.TraitementAffectationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GeofenceService {

    @Autowired
    private AuthorizedZoneRepository zoneRepository;

    @Autowired
    private TraitementAffectationRepository affectationRepository;

    @Autowired
    private AlertPatientRepository alertPatientRepository;

    @Autowired
    private TwilioService twilioService;

    // Anti-spam: clé = traitementId, valeur = timestamp dernière alerte
    private final ConcurrentHashMap<Long, LocalDateTime> lastAlertSent = new ConcurrentHashMap<>();
    private static final int ALERT_COOLDOWN_MINUTES = 5;

    /**
     * Vérifie si la position (lat, lon) est en dehors des zones autorisées du traitement.
     * Si oui → enregistre une alerte en table alert_patient + SMS/appel accompagnant.
     *
     * Flow: HistoriquePosition → Traitements → ZoneAutorisee (check)
     *       Traitements → TraitementAffectation → User (accompagnant + patient)
     */
    public void checkGeofence(double lat, double lon, Traitements traitement) {
        if (traitement == null) return;

        Long traitementId = traitement.getIdTraitement();

        // 1. Récupérer les zones actives de ce traitement
        List<ZoneAutorisee> zones = zoneRepository.findByTraitementsIdTraitementAndActifTrue(traitementId);
        if (zones.isEmpty()) return; // pas de zones → rien à vérifier

        // 2. Vérifier si la position est dans au moins une zone
        boolean insideAnyZone = false;
        for (ZoneAutorisee zone : zones) {
            double distance = haversine(lat, lon, zone.getLatitude(), zone.getLongitude());
            if (distance <= zone.getRayon()) {
                insideAnyZone = true;
                break;
            }
        }

        if (insideAnyZone) return; // dans la zone → OK

        // 3. HORS ZONE → vérifier le cooldown anti-spam
        LocalDateTime lastAlert = lastAlertSent.get(traitementId);
        if (lastAlert != null && lastAlert.plusMinutes(ALERT_COOLDOWN_MINUTES).isAfter(LocalDateTime.now())) {
            return; // alerte déjà envoyée récemment
        }

        // 4. Trouver le patient et l'accompagnant via traitement_affectation
        List<TraitementAffectation> affectations = affectationRepository.findByTraitementsIdTraitement(traitementId);

        User patient = null;
        User accompagnant = null;
        for (TraitementAffectation aff : affectations) {
            if (aff.getPatientUser() != null) {
                patient = aff.getPatientUser();
                accompagnant = aff.getAccompagnantUser();
                break;
            }
        }

        String patientName = (patient != null)
                ? patient.getPrenom() + " " + patient.getNom()
                : "Inconnu";

        // 5. TOUJOURS enregistrer l'alerte en base (même si pas d'accompagnant)
        AlertPatient alert = new AlertPatient();
        alert.setAlert("The patient " + patientName
                + " is leaving the zone, so urgent intervention is required");
        alert.setTraitements(traitement);
        alertPatientRepository.save(alert);

        System.out.println("[GeofenceService] ALERTE enregistrée: patient " + patientName
                + " hors zone du traitement " + traitementId);

        // 6. Mettre à jour le cooldown
        lastAlertSent.put(traitementId, LocalDateTime.now());

        // 7. Envoyer SMS + appel à l'accompagnant (si trouvé)
        if (accompagnant != null && accompagnant.getTelephone() != null) {
            String smsMessage = "Alerte MemorIA!\n"
                    + "Le patient " + patientName + " a quitté sa zone autorisée.\n"
                    + "Position actuelle: (" + lat + ", " + lon + ")\n"
                    + "Veuillez intervenir rapidement.";
            twilioService.sendSms(accompagnant.getTelephone(), smsMessage);
            twilioService.makeCall(accompagnant.getTelephone(), patientName);

            System.out.println("[GeofenceService] SMS + appel envoyés à "
                    + accompagnant.getPrenom() + " " + accompagnant.getNom()
                    + " (" + accompagnant.getTelephone() + ")");
        } else {
            System.err.println("[GeofenceService] Aucun accompagnant trouvé pour traitement=" + traitementId
                    + " — alerte enregistrée mais pas de SMS/appel");
        }
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(dist * 10.0) / 10.0;
    }
}
