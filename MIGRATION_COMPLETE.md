# 🚀 MemoriA Microservices - Migration Complétée

## ✅ Étape 1: Bases de Données Créées

Exécutez le script SQL pour créer les bases de données:

```bash
# Connectez-vous à MySQL
mysql -u root -p

# Exécutez le script
source setup-databases.sql;
```

**Bases créées:**
- `planning_db` - Tables: reminders, adherence
- `alerts_db` - Tables: alerts, alert_recipients, sms_notifications

---

## ✅ Étape 2: Code des Services Migré

### Planning Service (Port 8091)
**Créé:**
- ✅ Entités: `Reminder`, `Adherence`
- ✅ Repositories: `ReminderRepository`, `AdherenceRepository`
- ✅ Services: `IReminderService`, `IAdherenceService` + implémentations
- ✅ Contrôleurs: `ReminderController`, `AdherenceController`

**Endpoints disponibles:**
```
POST   /api/planning/reminders                      - Créer un rappel
GET    /api/planning/reminders/patient/{id}        - Lister rappels du patient
GET    /api/planning/reminders/{id}                - Détail du rappel
PUT    /api/planning/reminders/{id}                - Mettre à jour
PUT    /api/planning/reminders/{id}/complete       - Marquer complété
DELETE /api/planning/reminders/{id}                - Supprimer

POST   /api/planning/adherence                     - Enregistrer adhérence
GET    /api/planning/adherence/patient/{id}       - Historique adhérence
GET    /api/planning/adherence/patient/{id}/rate  - Taux d'adhérence (%)
```

### Alerts Service (Port 8092)
**Créé:**
- ✅ Entités: `Alert`, `AlertRecipient`, `SmsNotification`
- ✅ Repositories: `AlertRepository`, `AlertRecipientRepository`, `SmsNotificationRepository`
- ✅ Services: `IAlertService`, `ISmsNotificationService` + implémentations
- ✅ Contrôleurs: `AlertController`, `SmsNotificationController`

**Endpoints disponibles:**
```
POST   /api/alerts                          - Créer une alerte
GET    /api/alerts/patient/{id}            - Lister alertes du patient
GET    /api/alerts/patient/{id}/pending    - Alertes en attente
GET    /api/alerts/{id}                    - Détail de l'alerte
PUT    /api/alerts/{id}                    - Mettre à jour
PUT    /api/alerts/{id}/resolve            - Résoudre l'alerte
DELETE /api/alerts/{id}                    - Supprimer

POST   /api/alerts/sms                      - Envoyer SMS
GET    /api/alerts/sms/alert/{id}          - SMS d'une alerte
GET    /api/alerts/sms/pending             - SMS en attente
PUT    /api/alerts/sms/{id}/mark-sent      - Marquer envoyé
```

---

## 🔧 Configuration à Vérifier

### Planning Service - `application.yml`
```yaml
server:
  port: 8091
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/planning_db
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  application:
    name: planning-service
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

### Alerts Service - `application.yml`
```yaml
server:
  port: 8092
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/alerts_db
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  application:
    name: alerts-service
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

---

## 🚀 Démarrer les Services (Ordre Important)

```bash
# Terminal 1 - EUREKA REGISTRY (DÉMARRER EN PREMIER)
cd MemoriA-dev/MemoriA-Registry
mvn spring-boot:run
# Attendez 15 secondes, vérifiez: http://localhost:8761

# Terminal 2 - PLANNING SERVICE
cd MemoriA-dev/MemoriA-Planning-Service
mvn spring-boot:run
# Vérifiez dans Eureka Dashboard

# Terminal 3 - ALERTS SERVICE
cd MemoriA-dev/MemoriA-Alerts-Service
mvn spring-boot:run
# Vérifiez dans Eureka Dashboard

# Terminal 4 - API GATEWAY
cd MemoriA-dev/MemoriA-Gateway
mvn spring-boot:run
# Vérifiez: http://localhost:8888

# Terminal 5 - FRONTEND (si prêt à tester)
cd MemoriA-dev/MemoriA_Frontend
ng serve
```

---

## ✅ Vérification

### 1. Vérifier Eureka
```bash
# Ouvrez: http://localhost:8761
# Vous devez voir:
# - planning-service (8091)
# - alerts-service (8092)
# - MemoriA-Gateway (8888)
```

### 2. Tester les Services via Gateway
```bash
# Créer un rappel
curl -X POST http://localhost:8888/api/planning/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "title": "Prendre médicament",
    "description": "Matin et soir",
    "scheduledDate": "2026-04-30T09:00:00"
  }'

# Créer une alerte
curl -X POST http://localhost:8888/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "alertType": "MEDICATION_REMINDER",
    "message": "Rappel: Prendre le médicament",
    "severity": "HIGH"
  }'

# Lister les rappels
curl http://localhost:8888/api/planning/reminders/patient/1

# Lister les alertes
curl http://localhost:8888/api/alerts/patient/1
```

### 3. Vérifier Logs
Chaque service affichera dans la console:
```
[ReminderController] POST /reminders
[AlertController] POST /alerts
[SmsNotificationController] POST /sms
```

---

## 📝 Prochaines Étapes

1. ✅ **Bases de données créées** - À faire
2. ✅ **Services configurés** - Fait
3. ⏳ **Démarrer et vérifier** - À faire
4. ⏳ **Mettre à jour Frontend** - À faire (changer apiUrl)
5. ⏳ **Tester end-to-end** - À faire

---

## 🔐 Configuration Twilio (Optionnel pour SMS)

Si vous voulez tester les SMS, configurez les variables d'environnement:

```bash
# Windows PowerShell
$env:TWILIO_ACCOUNT_SID = "your-account-sid"
$env:TWILIO_AUTH_TOKEN = "your-auth-token"
$env:TWILIO_PHONE_NUMBER = "+1234567890"

# Linux/Mac
export TWILIO_ACCOUNT_SID="your-account-sid"
export TWILIO_AUTH_TOKEN="your-auth-token"
export TWILIO_PHONE_NUMBER="+1234567890"
```

---

## 📊 Architecture Finale

```
Frontend (Angular 4200)
        ↓
   API Gateway (8888)
   ↙                  ↘
Planning (8091)    Alerts (8092)
   ↓                   ↓
planning_db         alerts_db
   ↑                   ↑
      ← Eureka (8761)
```

---

## ❌ Troubleshooting

### Service ne se connecte pas à Eureka
- Vérifiez que Eureka démarre en premier
- Attendre 10-15 secondes entre chaque démarrage
- Vérifier la console pour: "Registering with Eureka"

### Gateway ne peut pas trouver les services
- Vérifier l'URL Eureka dans application.yml
- Vérifier que les services sont enregistrés dans Eureka Dashboard

### Erreur de base de données
- Vérifier que MySQL est en cours d'exécution sur port 3307
- Vérifier username/password dans application.yml
- Vérifier que les bases planning_db et alerts_db existent

### CORS Error
- Vérifier CorsConfig.java dans Gateway
- Vérifier que Frontend appelle http://localhost:8888 (pas les services directs)

---

**Status: ✅ PRÊT À DÉMARRER**

Exécutez `setup-databases.sql` puis lancez les services dans l'ordre ci-dessus.
