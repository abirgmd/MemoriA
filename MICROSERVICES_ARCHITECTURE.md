# 🏗️ Architecture Microservices MemoriA

## Structure

```
Frontend (Angular 4200)
         ↓
    API Gateway (8888)
    ↙            ↘
Planning (8091)  Alerts (8092)
    ↓                ↓
planning_db       alerts_db
         ↑            ↑
   MySQL 3307
         ↑
   Eureka (8761)
```

## Services

### 🔍 Eureka Registry (Port 8761)
- Service discovery et registration
- Dashboard: http://localhost:8761

### 🚪 API Gateway (Port 8888)
- Routage automatique des requêtes
- Routes:
  - `/api/planning/**` → Planning Service
  - `/api/alerts/**` → Alerts Service

### 📋 Planning Service (Port 8091)
- Gestion des rappels
- Suivi d'adhérence
- Base: `planning_db`

### ⚠️ Alerts Service (Port 8092)
- Gestion des alertes
- Notifications SMS (Twilio)
- Base: `alerts_db`

## 🚀 Démarrage

### Option 1: Manuel (Recommandé pour debug)

```bash
# Terminal 1: Eureka Registry
cd MemoriA-dev/MemoriA-Registry
mvn spring-boot:run

# Terminal 2: Planning Service
cd MemoriA-dev/MemoriA-Planning-Service
mvn spring-boot:run

# Terminal 3: Alerts Service
cd MemoriA-dev/MemoriA-Alerts-Service
mvn spring-boot:run

# Terminal 4: API Gateway
cd MemoriA-dev/MemoriA-Gateway
mvn spring-boot:run

# Terminal 5: Frontend
cd MemoriA-dev/MemoriA_Frontend
ng serve
```

### Option 2: Ordre de démarrage
1. **Eureka Registry** (8761) - Attendre 5 sec
2. **Planning Service** (8091) - Attendre 5 sec
3. **Alerts Service** (8092) - Attendre 5 sec
4. **API Gateway** (8888) - Attendre 5 sec
5. **Frontend** (4200)

## ✅ Vérification

### 1. Dashboard Eureka
```
http://localhost:8761
```
Vous devez voir 3 services: planning-service, alerts-service, memoria-gateway

### 2. Test API Gateway
```bash
curl http://localhost:8888/actuator/health
```

### 3. Frontend
```
http://localhost:4200
```

## 📊 Ports

| Service | Port |
|---------|------|
| Eureka Registry | 8761 |
| API Gateway | 8888 |
| Planning Service | 8091 |
| Alerts Service | 8092 |
| Frontend | 4200 |
| MySQL | 3307 |

## 🗄️ Bases de Données

Créer les bases:

```sql
CREATE DATABASE planning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE alerts_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🔗 Migration de Code

Depuis `MemoriA_Backend`:

**Planning Service** ← Copier:
- Controller: `PlanningController.java`
- Services: `PlanningService`, `ReminderService`
- Entities: Entités dans le dossier `Planning/`
- Repositories: Repos de planning et reminder

**Alerts Service** ← Copier:
- Controller: `AlertController.java`
- Services: `AlertService`
- Entities: Entités dans le dossier `alerts/`
- Repositories: Repos d'alert
- Config: `TwilioConfig.java`

## 🛠️ Configuration Frontend

Mettre à jour `environment.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:8888/api'
};
```

## 📝 Endpoints

### Planning Service
```
GET  /api/planning/reminders
POST /api/planning/reminders
PUT  /api/planning/reminders/{id}
DELETE /api/planning/reminders/{id}
```

### Alerts Service
```
GET  /api/alerts/list
POST /api/alerts/create
PUT  /api/alerts/{id}/status
GET  /api/alerts/{id}
```

## 🐛 Troubleshooting

**Services ne s'enregistrent pas?**
- Vérifier Eureka est démarré (8761)
- Attendre 5-10 secondes
- Recharger la page

**Port déjà utilisé?**
```bash
netstat -ano | findstr :PORT
taskkill /PID {PID} /F
```

**Connexion MySQL?**
```bash
netstat -ano | findstr :3307
```

## ✨ Caractéristiques

✅ Service discovery automatique (Eureka)
✅ Routage intelligent (API Gateway)
✅ Bases de données isolées
✅ Load balancing
✅ Scalabilité indépendante
✅ Maintenabilité améliorée
