# 🔗 Frontend Update Guide - Microservices

## Configuration Actuelle (À CHANGER)

**Fichier:** `MemoriA-dev/MemoriA_Frontend/src/environments/environment.ts`

```typescript
// ❌ ANCIEN - Appel direct au backend monolithique
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Direct backend
};
```

## Configuration Nouvelle (APRES LA MIGRATION)

```typescript
// ✅ NOUVEAU - Via API Gateway
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8888/api'  // Via Gateway
};
```

---

## Mise à Jour des Services Angular

### 1. Planning Service
**Fichier:** `src/app/services/planning.service.ts`

```typescript
// Aucun changement du code - le URL change automatiquement
// car vous utilisez environment.apiUrl

private apiUrl = `${environment.apiUrl}/planning`;

// Ces appels fonctionneront avec le gateway:
getRemindersByPatientId(patientId: number) {
  return this.http.get<Reminder[]>(`${this.apiUrl}/reminders/patient/${patientId}`);
}

getAdherenceRate(patientId: number) {
  return this.http.get(`${this.apiUrl}/adherence/patient/${patientId}/rate`);
}
```

### 2. Alerts Service
**Fichier:** `src/app/services/alert.service.ts`

```typescript
// Aucun changement du code - les endpoints sont identiques
private apiUrl = `${environment.apiUrl}/alerts`;

getAlertsByPatient(patientId: number) {
  return this.http.get<Alert[]>(`${this.apiUrl}/patient/${patientId}`);
}

createAlert(alert: Alert) {
  return this.http.post<Alert>(this.apiUrl, alert);
}
```

---

## Vérification Point par Point

### ✅ Étape 1: Mettre à jour environment.ts
```bash
# Fichier
src/environments/environment.ts

# Chercher
apiUrl: 'http://localhost:8080/api'

# Remplacer par
apiUrl: 'http://localhost:8888/api'
```

### ✅ Étape 2: Vérifier environment.prod.ts
Si vous avez une version production, mettre à jour aussi:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'http://your-domain.com/api'  // À adapter pour production
};
```

### ✅ Étape 3: Vérifier les services (Planning)
```bash
# Tous les appels à:
`${this.apiUrl}/planning/...`

# Doivent maintenant appeler:
# http://localhost:8888/api/planning/...
# Qui route vers Planning Service (8091)
```

### ✅ Étape 4: Vérifier les services (Alerts)
```bash
# Tous les appels à:
`${this.apiUrl}/alerts/...`

# Doivent maintenant appeler:
# http://localhost:8888/api/alerts/...
# Qui route vers Alerts Service (8092)
```

---

## Test Complet

### 1. Lancer tous les services
```bash
# Terminal 1: Eureka
cd MemoriA-dev/MemoriA-Registry
mvn spring-boot:run

# Terminal 2: Planning Service
cd MemoriA-dev/MemoriA-Planning-Service
mvn spring-boot:run

# Terminal 3: Alerts Service
cd MemoriA-dev/MemoriA-Alerts-Service
mvn spring-boot:run

# Terminal 4: Gateway
cd MemoriA-dev/MemoriA-Gateway
mvn spring-boot:run
```

### 2. Lancer le Frontend
```bash
cd MemoriA-dev/MemoriA_Frontend
ng serve
```

### 3. Vérifier dans le navigateur

```javascript
// Ouvrez http://localhost:4200
// Ouvrez la console (F12)
// Vous devez voir des appels à:

// Planning endpoints
GET http://localhost:8888/api/planning/reminders/patient/1
GET http://localhost:8888/api/planning/adherence/patient/1/rate

// Alerts endpoints
GET http://localhost:8888/api/alerts/patient/1
POST http://localhost:8888/api/alerts

// Jamais directement à:
// ❌ http://localhost:8080/api/...
// ❌ http://localhost:8091/api/...
// ❌ http://localhost:8092/api/...
```

---

## Architecture du Routing

### Gateway Routes (application.yml)

```yaml
spring:
  cloud:
    gateway:
      routes:
        # Planning Service
        - id: planning-service
          uri: lb://planning-service
          predicates:
            - Path=/api/planning/**
          filters:
            - StripPrefix=1

        # Alerts Service
        - id: alerts-service
          uri: lb://alerts-service
          predicates:
            - Path=/api/alerts/**
          filters:
            - StripPrefix=1
```

### Flux des Requêtes

```
Frontend Call:
POST http://localhost:8888/api/planning/reminders
  ↓
Gateway Route Match: Path=/api/planning/**
  ↓
Gateway StripPrefix=1: /api/planning → /planning
  ↓
Gateway Lookup: lb://planning-service (Eureka)
  ↓
Planning Service (port 8091):
POST /planning/reminders
  ↓
Response back to Frontend
```

---

## Checklist Finale

- [ ] ✅ Mettre à jour environment.ts (apiUrl → 8888)
- [ ] ✅ Vérifier services Angular utilisent environment.apiUrl
- [ ] ✅ Tous les services démarrés (Eureka, Planning, Alerts, Gateway)
- [ ] ✅ Vérifier Eureka Dashboard: http://localhost:8761
- [ ] ✅ Lancer Frontend: ng serve
- [ ] ✅ Ouvrir http://localhost:4200
- [ ] ✅ Vérifier Console (F12) pour appels à 8888 (pas 8080)
- [ ] ✅ Tester créer rappel → API Gateway → Planning Service
- [ ] ✅ Tester créer alerte → API Gateway → Alerts Service

---

## Endpoints Complète après Migration

### Via API Gateway (à utiliser)
```
http://localhost:8888/api/planning/reminders
http://localhost:8888/api/planning/adherence
http://localhost:8888/api/alerts
http://localhost:8888/api/alerts/sms
```

### Services directs (À NE PAS utiliser du frontend)
```
http://localhost:8091/... (Planning Service)
http://localhost:8092/... (Alerts Service)
```

---

**Status: ✅ PRÊT À CONFIGURER LE FRONTEND**

Les services sont prêts. Mettez à jour le Frontend et testez!
