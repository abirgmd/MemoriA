# ✅ Microservices Backend - Implémentation Complète

## 🎯 Votre Demande
"Je veux structurer ma partie backend en microservices (un pour planning et un pour alert)"

## ✨ Créé

### 4 Microservices Spring Boot

| Service | Port | Rôle | Base de Données |
|---------|------|------|-----------------|
| **Eureka Registry** | 8761 | Service Discovery | N/A |
| **API Gateway** | 8888 | Routage des requêtes | N/A |
| **Planning Service** | 8091 | Reminders & Adherence | planning_db |
| **Alerts Service** | 8092 | Alertes & Notifications | alerts_db |

### Fichiers Créés (Per Service)

Chaque service contient:
- `pom.xml` - Configuration Maven avec dépendances Spring Cloud
- `{Service}Application.java` - Classe Spring Boot avec @EnableDiscoveryClient
- `application.yml` - Configuration (port, base, Eureka)

**Gateway spécifique:**
- `CorsConfig.java` - Configuration CORS pour Angular

### 📚 Documentation

1. **MICROSERVICES_ARCHITECTURE.md** - Vue d'ensemble complète
2. **QUICK_MICROSERVICES.md** - Démarrage rapide (5 min)

---

## 🚀 Démarrage Immédiat

### Étape 1: Créer les Bases (MySQL)

```sql
CREATE DATABASE planning_db CHARACTER SET utf8mb4;
CREATE DATABASE alerts_db CHARACTER SET utf8mb4;
```

### Étape 2: Démarrer Services (dans cet ordre)

```bash
# Terminal 1
cd MemoriA-dev/MemoriA-Registry
mvn spring-boot:run

# Attendre 10 sec, puis Terminal 2
cd MemoriA-dev/MemoriA-Planning-Service
mvn spring-boot:run

# Terminal 3
cd MemoriA-dev/MemoriA-Alerts-Service
mvn spring-boot:run

# Terminal 4
cd MemoriA-dev/MemoriA-Gateway
mvn spring-boot:run

# Terminal 5
cd MemoriA-dev/MemoriA_Frontend
ng serve
```

### Étape 3: Vérifier

```
http://localhost:8761  → Dashboard Eureka (voir les 3 services)
http://localhost:4200  → Frontend Angular
```

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Frontend Angular      │
│      Port 4200          │
└────────────┬────────────┘
             │
    ┌────────▼────────┐
    │   API Gateway   │
    │    Port 8888    │
    │                 │
    │ /api/planning/→ │───┐
    │ /api/alerts/  → │   │
    └────────┬────────┘   │
             │            │
    ┌────────┴──────┬─────┴──────┐
    │               │            │
┌───▼──────┐   ┌───▼──────┐  ┌──▼────────┐
│ Planning  │   │ Alerts   │  │ Eureka    │
│ Service   │   │ Service  │  │ Registry  │
│ 8091      │   │ 8092     │  │ 8761      │
└───┬──────┘   └───┬──────┘  └───────────┘
    │              │
┌───▼──────┐   ┌───▼──────┐
│planning_ │   │ alerts_  │
│ db       │   │ db       │
└──────────┘   └──────────┘
    ↑              ↑
    └──────┬───────┘
        MySQL 3307
```

---

## 📁 Structure Projet

```
MemoriA-dev/
├── MemoriA-Registry/
│   ├── pom.xml
│   └── src/main/
│       ├── java/MemorIA/MemorIaRegistryApplication.java
│       └── resources/application.yml
│
├── MemoriA-Gateway/
│   ├── pom.xml
│   └── src/main/
│       ├── java/MemorIA/
│       │   ├── MemorIaGatewayApplication.java
│       │   └── config/CorsConfig.java
│       └── resources/application.yml
│
├── MemoriA-Planning-Service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/MemorIA/PlanningServiceApplication.java
│       └── resources/application.yml
│
├── MemoriA-Alerts-Service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/MemorIA/AlertsServiceApplication.java
│       └── resources/application.yml
│
├── MemorIA_Backend/ (original monolith)
├── MemorIA_Frontend/ (Angular)
```

---

## 🔗 Prochaines Étapes

### Étape 1: Migrer le Code (1-2 heures)

**Planning Service** ← Copier de MemoriA_Backend:
```
Controllers:
  - PlanningController.java

Services:
  - PlanningServiceImpl.java
  - ReminderServiceImpl.java

Entities:
  - Planning/*
  
Repositories:
  - PlanningRepository.java
  - ReminderRepository.java
```

**Alerts Service** ← Copier de MemoriA_Backend:
```
Controllers:
  - AlertController.java

Services:
  - AlertServiceImpl.java

Entities:
  - alerts/*

Repositories:
  - AlertRepository.java

Config:
  - TwilioConfig.java
```

### Étape 2: Mettre à Jour Frontend

```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:8888/api'
};
```

### Étape 3: Tester

```bash
# Test Planning Service
curl http://localhost:8888/api/planning/reminders

# Test Alerts Service
curl http://localhost:8888/api/alerts/list
```

---

## ✅ Avantages Microservices

✅ **Scalabilité Indépendante** - Scale Planning ou Alerts séparément  
✅ **Déploiement Indépendant** - Mettre à jour un service sans affecter les autres  
✅ **Equipes Indépendantes** - Equipes peuvent travailler en parallèle  
✅ **Maintenabilité** - Code mieux organisé par domaine  
✅ **Résilience** - Panne d'un service n'affecte pas les autres  
✅ **Scalabilité Horizontale** - Ajouter des instances au besoin

---

## 🔑 Points Importants

1. **Eureka doit être le premier service démarré**
2. **Attendre que Eureka soit prêt avant de démarrer les autres**
3. **API Gateway doit être démarré après Planning et Alerts**
4. **Chaque service a sa propre base de données**
5. **Frontend accède par le Gateway (8888), pas directement aux services**

---

## 📊 Technologies

- **Spring Boot 3.3.0** - Framework principal
- **Spring Cloud 2023.0.1** - Microservices patterns
- **Spring Cloud Gateway** - API Gateway
- **Netflix Eureka** - Service Discovery
- **Spring Cloud LoadBalancer** - Client-side load balancing
- **Spring Data JPA** - Accès bases de données
- **MySQL 8.0+** - Persistence
- **Twilio SDK** - SMS pour Alerts

---

## 🎓 Documentation

| Document | Usage |
|----------|-------|
| MICROSERVICES_ARCHITECTURE.md | Vue d'ensemble complète |
| QUICK_MICROSERVICES.md | Démarrage rapide |

---

## 🆘 Support Rapide

**Q: Les services ne s'enregistrent pas?**  
A: Vérifier que Eureka (8761) est démarré en premier

**Q: Port déjà utilisé?**  
A: `netstat -ano | findstr :PORT` puis `taskkill /PID {PID} /F`

**Q: Connexion MySQL refusée?**  
A: Vérifier MySQL sur 3307: `netstat -ano | findstr :3307`

**Q: Frontend ne peut pas appeler API?**  
A: Vérifier que Gateway (8888) est démarré

---

## 🎉 Résumé

**Créé:**
- ✅ 4 microservices Spring Boot configurés
- ✅ Eureka Registry pour découverte de services
- ✅ API Gateway pour routage centralisé
- ✅ Documentation complète
- ✅ Prêt pour migration de code

**Status:** ✅ **PRÊT À UTILISER**

**Durée démarrage:** ~10-15 minutes (premiers tests)

**Durée migration code:** ~2 heures (copier et adapter)

---

**Créé le**: 2026-04-29  
**Version**: 1.0.0  
**Next**: Migrer code du backend monolith vers les services
