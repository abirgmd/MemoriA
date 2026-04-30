# 🏗️ Architecture du Projet MemoriA

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                      Angular Frontend (4200)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Smart Components Pattern                             │  │
│  │ ├─ Core Module (Services, Guards, Interceptors)    │  │
│  │ ├─ Shared Module (Common Components/Pipes/Utils)   │  │
│  │ └─ Features (Auth, Alerts, Chat, Profiles, etc.)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓ HTTP                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│               Spring Boot Backend (8089)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Clean Architecture Pattern                           │  │
│  │ ├─ REST Controllers (@RestController)              │  │
│  │ ├─ Service Layer (@Service) - Business Logic       │  │
│  │ ├─ Repository Layer (@Repository) - Data Access    │  │
│  │ ├─ Security (@Configuration) - Auth & Authorization│  │
│  │ ├─ DTOs - Data Transfer Objects                    │  │
│  │ └─ Entities - JPA Models                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓ JDBC                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                MySQL Database (3307)                        │
│  ├─ users                                                   │
│  ├─ alerts                                                  │
│  ├─ chat_messages                                           │
│  └─ patient_diagnoses                                       │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Backend - Spring Boot 3.3.0

### Structure des Dossiers

```
MemoriA-dev/MemorIA_Backend/src/main/java/MemorIA/
│
├── config/                          # Configuration Spring
│   ├── WebSecurityConfig.java      # Spring Security
│   ├── CorsConfig.java             # CORS
│   └── TwilioConfig.java           # Twilio SMS
│
├── controller/                      # REST Endpoints
│   ├── AlertController.java        # GET/POST alerts
│   ├── UserController.java         # User management
│   ├── ChatController.java         # Chat messages
│   └── DiagnosticController.java   # Diagnostics
│
├── service/                         # Business Logic
│   ├── AlertService.java           # Alert management
│   ├── UserService.java            # User service
│   ├── ChatService.java            # Chat service
│   ├── SmsService.java             # SMS (Twilio)
│   └── impl/                       # Implementations
│       ├── AlertServiceImpl.java
│       └── CaregiverAlertService.java
│
├── repository/                      # Data Access (JPA)
│   ├── UserRepository.java
│   ├── AlertRepository.java
│   ├── ChatMessageRepository.java
│   └── DiagnosticRepository.java
│
├── entity/                          # JPA Entities
│   ├── User.java
│   ├── Alert.java
│   ├── ChatMessage.java
│   └── Diagnostic.java
│
├── dto/                             # Data Transfer Objects
│   ├── UserDTO.java
│   ├── AlertDTO.java
│   ├── AlertResponseDTO.java
│   └── ChatMessageDTO.java
│
├── mapper/                          # DTO ↔ Entity Mapping
│   ├── UserMapper.java
│   ├── AlertMapper.java
│   └── ChatMessageMapper.java
│
├── security/                        # Security Components
│   ├── JwtTokenProvider.java       # JWT generation
│   ├── JwtAuthenticationFilter.java # JWT filter
│   └── CustomUserDetailsService.java
│
├── exception/                       # Custom Exceptions
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── GlobalExceptionHandler.java
│
├── scheduler/                       # Scheduled Tasks
│   └── AlertScheduler.java         # Cron jobs
│
├── util/                            # Utilities
│   ├── DateUtil.java
│   └── ValidationUtil.java
│
└── MemorIaBackendApplication.java  # Main entry point
```

### Dépendances Clés

```xml
<!-- Spring Boot -->
<spring-boot-starter-web>          <!-- REST, Tomcat -->
<spring-boot-starter-data-jpa>     <!-- JPA, Hibernate -->
<spring-boot-starter-security>     <!-- Authentication -->

<!-- MySQL -->
<mysql-connector-j>                 <!-- JDBC Driver -->

<!-- Utilities -->
<lombok>                            <!-- Annotations (no getters/setters) -->
<mapstruct>                         <!-- Object mapping -->

<!-- SMS -->
<twilio>                            <!-- SMS API -->

<!-- Testing -->
<spring-boot-starter-test>          <!-- JUnit, Mockito -->
```

### Pattern: Service Layer

```java
@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    
    @Autowired
    private AlertService alertService;
    
    // Controllers délèguent au service
    @GetMapping("/me")
    public ResponseEntity<List<AlertDTO>> getAlerts() {
        return ResponseEntity.ok(
            alertService.getAlertsForCurrentUser(userId, role)
        );
    }
}

@Service
public class AlertServiceImpl implements AlertService {
    
    @Autowired
    private AlertRepository alertRepository;
    
    // Service contient la logique métier
    public List<AlertDTO> getAlertsForCurrentUser(Long userId, String role) {
        List<Alert> alerts = alertRepository.findByUserId(userId);
        return alerts.stream()
            .map(AlertMapper::toDTO)
            .collect(Collectors.toList());
    }
}

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserId(Long userId);
}
```

### Flow d'une Requête

```
1. Client envoie: GET /api/alerts/me
                    ↓
2. AlertController.getAlertForCurrentUser()
   - Extrait userId du JWT token
   - Appelle alertService.getAlertsForCurrentUser()
                    ↓
3. AlertService.getAlertsForCurrentUser()
   - Valide les paramètres
   - Récupère depuis BD: alertRepository.findByUserId()
   - Convertit Entity → DTO
   - Retourne liste AlertDTO
                    ↓
4. AlertController retourne ResponseEntity<List<AlertDTO>>
                    ↓
5. Client reçoit JSON: [{ id: 1, title: "...", ... }]
```

---

## 🎨 Frontend - Angular 17

### Structure des Dossiers

```
MemoriA-dev/MemorIA_Frontend/src/app/
│
├── core/                           # Singleton Services
│   ├── services/
│   │   ├── auth.service.ts        # JWT, Login/Logout
│   │   ├── alert.service.ts       # Alert API calls
│   │   ├── chat.service.ts        # Chat API calls
│   │   └── user.service.ts        # User API calls
│   ├── guards/
│   │   ├── auth.guard.ts          # Vérifie authentification
│   │   └── role.guard.ts          # Vérifie rôle utilisateur
│   └── interceptors/
│       ├── jwt.interceptor.ts     # Ajoute JWT au header
│       └── error.interceptor.ts   # Gère erreurs globales
│
├── shared/                         # Composants Réutilisables
│   ├── components/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   ├── loading/
│   │   └── error-message/
│   ├── models/
│   │   ├── alert.model.ts
│   │   ├── user.model.ts
│   │   └── chat.model.ts
│   ├── pipes/
│   │   ├── safe.pipe.ts
│   │   └── capitalize.pipe.ts
│   ├── directives/
│   │   └── highlight.directive.ts
│   └── utils/
│       ├── validators.ts
│       └── helpers.ts
│
├── features/                       # Modules Métier (Lazy-loaded)
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   ├── signup/
│   │   │   └── ...
│   │   ├── auth-routing.module.ts
│   │   └── auth.module.ts
│   │
│   ├── alerts/
│   │   ├── alert-list/
│   │   ├── alert-detail/
│   │   ├── create-alert/
│   │   ├── alerts-routing.module.ts
│   │   └── alerts.module.ts
│   │
│   ├── chat/
│   │   ├── chat-list/
│   │   ├── chat-detail/
│   │   ├── chat-routing.module.ts
│   │   └── chat.module.ts
│   │
│   ├── profile/
│   │   ├── patient/
│   │   ├── soignant/
│   │   ├── accompagnant/
│   │   ├── profile-routing.module.ts
│   │   └── profile.module.ts
│   │
│   └── diagnostic/
│       ├── diagnostic-list/
│       ├── diagnostic-detail/
│       ├── diagnostic-routing.module.ts
│       └── diagnostic.module.ts
│
├── layouts/                        # Layout Components
│   ├── main-layout/
│   │   ├── main-layout.component.ts
│   │   └── main-layout.component.html
│   └── auth-layout/
│
├── app.config.ts                  # Configuration app
├── app.routes.ts                  # Routes principales
└── app.component.ts               # Root component
```

### Pattern: Smart/Dumb Components

```typescript
// ❌ AVANT: Component "lourd" (fait tout)
@Component({
  selector: 'app-alert-list',
  template: `...`
})
export class AlertListComponent {
  alerts: Alert[] = [];
  
  constructor(private http: HttpClient) {
    this.http.get('/api/alerts').subscribe(data => {
      this.alerts = data;
    });
  }
}

// ✅ APRÈS: Smart + Dumb Components
// Smart Component (conteneur)
@Component({
  selector: 'app-alert-list-container',
  template: `<app-alert-list [alerts]="alerts" (alertClick)="onAlertClick($event)"></app-alert-list>`
})
export class AlertListContainerComponent {
  alerts: Alert[] = [];
  
  constructor(private alertService: AlertService) {
    this.alertService.getAlerts().subscribe(data => {
      this.alerts = data;
    });
  }
  
  onAlertClick(alert: Alert) {
    // Gère l'événement
  }
}

// Dumb Component (présentation)
@Component({
  selector: 'app-alert-list',
  template: `
    <div *ngFor="let alert of alerts" (click)="alertClick.emit(alert)">
      {{ alert.title }}
    </div>
  `
})
export class AlertListComponent {
  @Input() alerts: Alert[] = [];
  @Output() alertClick = new EventEmitter<Alert>();
}
```

### Flow d'une Requête

```
1. User clicks button
                ↓
2. Component.alertService.getAlerts()
                ↓
3. AlertService.getAlerts() calls HttpClient.get('/api/alerts')
                ↓
4. JwtInterceptor ajoute JWT au header
                ↓
5. Backend reçoit + répond
                ↓
6. ErrorInterceptor gère les erreurs
                ↓
7. Service retourne Observable<AlertDTO[]>
                ↓
8. Component subscribe() et met à jour @Input
                ↓
9. Dumb component reçoit data et l'affiche
```

---

## 🗄️ Base de Données - MySQL 8.0

### Schéma Principal

```sql
-- Users (Patients, Soignants, Accompagnants)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'SOIGNANT', 'ACCOMPAGNANT', 'ADMIN'),
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts
CREATE TABLE alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- Chat Messages
CREATE TABLE chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    sender_user_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (sender_user_id) REFERENCES users(id)
);
```

### Relations

```
Users (1) ─────→ (N) Alerts
Users (1) ─────→ (N) ChatMessages (as patient)
Users (1) ─────→ (N) ChatMessages (as sender)
```

---

## 🔐 Sécurité

### Authentication Flow (JWT)

```
1. User submits login credentials
                ↓
2. POST /api/auth/login { username, password }
                ↓
3. Backend validates + génère JWT token
                ↓
4. Frontend stocke JWT en localStorage
                ↓
5. Chaque requête ajoute: Authorization: Bearer <JWT>
                ↓
6. Backend valide JWT via JwtAuthenticationFilter
                ↓
7. Accès accordé/refusé selon permissions
```

### Rôles et Permissions

| Rôle | Permissions |
|------|-------------|
| PATIENT | Voir ses alertes, chat avec soignants |
| SOIGNANT | Voir alertes patients, envoyer alertes, chat |
| ACCOMPAGNANT | Voir alertes patient assigné, chat |
| ADMIN | Tout |

---

## 🔄 Flux de Communication

### Exemple: Créer une Alerte

```
Frontend                          Backend                     Database
  │                                 │                            │
  ├─ POST /api/alerts ─────────────→│                            │
  │  (AlertDTO)                      │                            │
  │                            AlertController                    │
  │                                  ├─ Valide DTO               │
  │                            AlertService                       │
  │                                  ├─ Ajoute logique métier     │
  │                            AlertRepository                    │
  │                                  ├─ Convertit Entity ─────────→│
  │                                  │    INSERT INTO alerts      │
  │                                  │                ← ID generé │
  │                                  │                            │
  │  ← 201 Created + AlertDTO ───────│                            │
  │  (avec ID généré)                │                            │
  │                                  │                            │
  └─ Affiche alerte dans liste      │                            │
```

---

## 📊 Performance & Scalabilité

### Backend Optimizations
- Connection pooling (HikariCP 20 connections)
- Database indexing sur `patient_id`, `user_id`, `created_at`
- Lazy loading pour collections
- Pagination sur endpoints de liste

### Frontend Optimizations
- Lazy loading des features modules
- OnPush change detection strategy
- Virtual scrolling pour listes longues
- Service workers pour caching

---

## 🧪 Testing Strategy

### Backend Tests
```
Tests Unitaires (80%)
  ├─ Service tests avec Mockito
  ├─ Repository tests avec H2 en-mémoire
  └─ Mapper tests

Tests Intégration (20%)
  ├─ Controller tests avec MockMvc
  ├─ API tests avec TestRestTemplate
  └─ Database tests
```

### Frontend Tests
```
Tests Unitaires (80%)
  ├─ Component tests avec Jasmine
  ├─ Service tests
  └─ Pipe/Directive tests

Tests E2E (20%)
  ├─ User flows avec Cypress/Protractor
  └─ Integration avec backend
```

---

## 📝 Conventions de Code

### Naming
- **Classes**: PascalCase (`AlertService`, `AlertController`)
- **Methods**: camelCase (`getAlerts()`, `createAlert()`)
- **Variables**: camelCase (`userId`, `alertList`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ALERTS = 100`)

### Logging
```java
@Slf4j
public class AlertService {
    public List<AlertDTO> getAlerts(Long userId) {
        log.info("[AlertService] Fetching alerts for user: {}", userId);
        
        try {
            List<Alert> alerts = alertRepository.findByUserId(userId);
            log.debug("[AlertService] Found {} alerts", alerts.size());
            return alerts.stream().map(AlertMapper::toDTO).collect(...);
        } catch (Exception e) {
            log.error("[AlertService] Error fetching alerts for user: {}", userId, e);
            throw new RuntimeException(e);
        }
    }
}
```

---

## 📈 Monitoring & Logging

### Backend Logs
- Fichier: `logs/application.log`
- Format: `[Timestamp] [Level] [Logger] Message`
- Levels: DEBUG, INFO, WARN, ERROR

### Frontend Logs
- Console browser
- Format: `[Component] Message`

---

## 🚀 Deployment

### Dev
- Backend: http://localhost:8089
- Frontend: http://localhost:4200
- Database: localhost:3307

### Prod
- Utiliser variables d'environnement
- Docker containers
- CI/CD pipeline (GitHub Actions)

---

**Dernière mise à jour**: 29 avril 2026
