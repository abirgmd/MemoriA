package MemorIA.service;

import MemorIA.entity.Patient;
import MemorIA.entity.User;
import MemorIA.entity.role.Sexe;
import MemorIA.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private PatientService patientService;

    private User patientUser;
    private Patient patient;

    @BeforeEach
    void setUp() {
        patientUser = new User();
        patientUser.setId(1L);
        patientUser.setEmail("patient@example.com");
        patientUser.setNom("Doe");
        patientUser.setPrenom("John");
        patientUser.setTelephone("0612345678");
        patientUser.setRole("PATIENT");
        patientUser.setActif(true);
        patientUser.setProfileCompleted(false);
        patientUser.setPassword("$2a$10$encoded");

        patient = new Patient();
        patient.setId(1L);
        patient.setUser(patientUser);
        patient.setDateNaissance(LocalDate.of(1990, 1, 15));
        patient.setSexe(Sexe.M);
        patient.setNumeroSecuriteSociale("1900115123456");
        patient.setAdresse("12 rue de Paris");
        patient.setVille("Paris");
    }

    // ──────────────────────────────────────────────────────────────
    // getAll
    // ──────────────────────────────────────────────────────────────

    @Test
    void getAll_returnsAllPatients() {
        when(patientRepository.findAll()).thenReturn(List.of(patient));

        List<Patient> result = patientService.getAll();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNumeroSecuriteSociale()).isEqualTo("1900115123456");
    }

    @Test
    void getAll_emptyList() {
        when(patientRepository.findAll()).thenReturn(List.of());
        assertThat(patientService.getAll()).isEmpty();
    }

    // ──────────────────────────────────────────────────────────────
    // getById
    // ──────────────────────────────────────────────────────────────

    @Test
    void getById_existingId_returnsPatient() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

        Optional<Patient> result = patientService.getById(1L);
        assertThat(result).isPresent();
        assertThat(result.get().getVille()).isEqualTo("Paris");
    }

    @Test
    void getById_notFound_returnsEmpty() {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Patient> result = patientService.getById(99L);
        assertThat(result).isEmpty();
    }

    // ──────────────────────────────────────────────────────────────
    // upsertProfile
    // ──────────────────────────────────────────────────────────────

    @Test
    void upsertProfile_newPatient_savesAndMarksComplete() {
        when(userService.getActiveUserForRole(1L, "PATIENT")).thenReturn(patientUser);
        when(patientRepository.findById(1L)).thenReturn(Optional.empty());
        when(patientRepository.save(any(Patient.class))).thenReturn(patient);

        Patient result = patientService.upsertProfile(1L, patient);

        assertThat(result).isNotNull();
        verify(userService).markProfileCompleted(1L);
        verify(patientRepository).save(any(Patient.class));
    }

    @Test
    void upsertProfile_existingPatient_updatesProfile() {
        when(userService.getActiveUserForRole(1L, "PATIENT")).thenReturn(patientUser);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(patientRepository.save(any(Patient.class))).thenReturn(patient);

        Patient result = patientService.upsertProfile(1L, patient);

        assertThat(result).isNotNull();
        verify(userService).markProfileCompleted(1L);
    }

    @Test
    void upsertProfile_missingDateNaissance_throwsBadRequest() {
        Patient details = new Patient();
        details.setSexe(Sexe.M);
        details.setNumeroSecuriteSociale("1900115123456");
        // dateNaissance is null

        when(userService.getActiveUserForRole(1L, "PATIENT")).thenReturn(patientUser);

        assertThatThrownBy(() -> patientService.upsertProfile(1L, details))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Required fields");
    }

    @Test
    void upsertProfile_missingSexe_throwsBadRequest() {
        Patient details = new Patient();
        details.setDateNaissance(LocalDate.of(1990, 1, 15));
        details.setNumeroSecuriteSociale("1900115123456");
        // sexe is null

        when(userService.getActiveUserForRole(1L, "PATIENT")).thenReturn(patientUser);

        assertThatThrownBy(() -> patientService.upsertProfile(1L, details))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Required fields");
    }

    @Test
    void upsertProfile_missingNumeroSecuriteSociale_throwsBadRequest() {
        Patient details = new Patient();
        details.setDateNaissance(LocalDate.of(1990, 1, 15));
        details.setSexe(Sexe.F);
        // numeroSecuriteSociale is null

        when(userService.getActiveUserForRole(1L, "PATIENT")).thenReturn(patientUser);

        assertThatThrownBy(() -> patientService.upsertProfile(1L, details))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Required fields");
    }

    @Test
    void upsertProfile_blankNumeroSecuriteSociale_throwsBadRequest() {
        Patient details = new Patient();
        details.setDateNaissance(LocalDate.of(1990, 1, 15));
        details.setSexe(Sexe.F);
        details.setNumeroSecuriteSociale("   ");

        when(userService.getActiveUserForRole(1L, "PATIENT")).thenReturn(patientUser);

        assertThatThrownBy(() -> patientService.upsertProfile(1L, details))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Required fields");
    }

    // ──────────────────────────────────────────────────────────────
    // update
    // ──────────────────────────────────────────────────────────────

    @Test
    void update_existingPatient_updatesAllFields() {
        Patient updatedDetails = new Patient();
        updatedDetails.setDateNaissance(LocalDate.of(1985, 6, 20));
        updatedDetails.setSexe(Sexe.F);
        updatedDetails.setNumeroSecuriteSociale("2850620123456");
        updatedDetails.setAdresse("99 avenue des Fleurs");
        updatedDetails.setVille("Lyon");

        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(patientRepository.save(any(Patient.class))).thenAnswer(inv -> inv.getArgument(0));

        Patient result = patientService.update(1L, updatedDetails);

        assertThat(result.getVille()).isEqualTo("Lyon");
        assertThat(result.getSexe()).isEqualTo(Sexe.F);
        assertThat(result.getNumeroSecuriteSociale()).isEqualTo("2850620123456");
        assertThat(result.getDateNaissance()).isEqualTo(LocalDate.of(1985, 6, 20));
    }

    @Test
    void update_notFound_throwsRuntimeException() {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.update(99L, patient))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Patient not found");
    }

    // ──────────────────────────────────────────────────────────────
    // delete
    // ──────────────────────────────────────────────────────────────

    @Test
    void delete_callsRepositoryDeleteById() {
        doNothing().when(patientRepository).deleteById(1L);

        patientService.delete(1L);

        verify(patientRepository).deleteById(1L);
    }
}
