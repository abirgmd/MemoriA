# 🔄 Transition Architecture - Dual Mode

## 📋 État Actuel

Vous êtes maintenant en **mode transition** avec deux architectures qui coexistent:

### Architecture A: Monolithe (Ancien)
```
Frontend → MemoriA_Backend (8080)
           ├── PlanningController
           ├── AlertController
           ├── UserController
           └── ... (autres controllers)
```

### Architecture B: Microservices (Nouveau)
```
Frontend → API Gateway (8888)
           ├── Planning Service (8091)
           │   └── ReminderController, AdherenceController
           └── Alerts Service (8092)
               └── AlertController, SmsNotificationController
```

---

## ⚙️ Configuration Transition

### Backend Monolithe
- **Port:** 8080
- **Controllers:** Tous les originaux (Planning, Alerts, etc.)
- **Status:** Actif mais non utilisé par Frontend
- **Raison:** Garde pour rollback ou test comparatif

### Microservices
- **Ports:** 8091 (Planning), 8092 (Alerts), 8888 (Gateway)
- **Controllers:** Versions migrées
- **Status:** Actif et utilisé par Frontend
- **Raison:** Nouvelle architecture cible

---

## 🚦 Route du Traffic

**Avant cette étape:**
```
Frontend (4200) → MemoriA_Backend (8080) [MONOLITE]
```

**Après mise à jour Frontend:**
```
Frontend (4200) → API Gateway (8888) → Microservices [MICROSERVICES]
MemoriA_Backend (8080) reste actif mais INACTIF
```

---

## 📊 Phase de Transition

### Phase 1: Tests en Parallèle (ACTUELLE)
```
Duration: 1-2 jours
- Démarrer Microservices + Gateway
- Garder MemoriA_Backend en standby
- Tester endpoints via Gateway
- Comparer réponses avec ancienne architecture
- Vérifier pas de régression
```

### Phase 2: Basculer Frontend (PROCHAINE)
```
Duration: 1 jour
- Mettre à jour environment.ts (8888 au lieu de 8080)
- Restart Angular
- Tester interface utilisateur complète
- Vérifier toutes les fonctionnalités
- Valider performance
```

### Phase 3: Validation Production (APRÈS)
```
Duration: 1 semaine
- Observer logs en production
- Vérifier stabilité
- Monitorer performance
- Confirmer pas de régressions
```

### Phase 4: Cleanup (FINAL)
```
Duration: 1 jour
- Supprimer contrôleurs du Backend
- Supprimer services/entities redondants du Backend
- Archiver MemoriA_Backend comme backup
- Décommissionner port 8080
```

---

## 📝 Checklist Phase 1 (Actuellement)

- [ ] ✅ Microservices créés et configurés
- [ ] ✅ API Gateway configuré avec routes
- [ ] ✅ Planning Service sur port 8091
- [ ] ✅ Alerts Service sur port 8092
- [ ] ⏳ **PROCHAINE:** Démarrer services
- [ ] ⏳ **PROCHAINE:** Tester endpoints via Gateway
- [ ] ⏳ **PROCHAINE:** Valider données

---

## 🧪 Comment Tester les Deux Côte à Côte

### Test 1: Vérifier Ancien Backend (8080)
```bash
# Démarrer ancien backend
cd MemoriA-dev/MemorIA_Backend
mvn spring-boot:run

# Tester un endpoint
curl http://localhost:8080/api/planning/patients/doctor/1
```

### Test 2: Vérifier Nouveau Gateway (8888)
```bash
# Démarrer services (Eureka, Planning, Alerts, Gateway)
./START_MICROSERVICES.ps1

# Tester même endpoint via Gateway
curl http://localhost:8888/api/planning/patients/doctor/1
# (Si endpoint existe dans nouveau système)
```

### Test 3: Comparer Résponses
```bash
# Anciennes réponses
curl http://localhost:8080/api/planning/reminders/patient/1 > old-response.json

# Nouvelles réponses
curl http://localhost:8888/api/planning/reminders/patient/1 > new-response.json

# Comparer
diff old-response.json new-response.json
```

---

## 🎯 Quand Supprimer les Anciens Controllers?

Ne supprimez les contrôleurs du backend **QUE LORSQUE**:

- [ ] ✅ Tous les services microservices sont stables
- [ ] ✅ Frontend a été basculé sur Gateway
- [ ] ✅ Toutes les fonctionnalités testées dans microservices
- [ ] ✅ Aucune erreur en production pendant 1+ semaine
- [ ] ✅ Vous avez un backup du backend monolithe

---

## 📍 Fichiers à Supprimer (Plus tard!)

**Planning Related:**
```
MemoriA-dev/MemorIA_Backend/src/main/java/MemorIA/controller/
  ├── PlanningController.java
  ├── CaregiverPlanningController.java
  └── DoctorPlanningRestController.java

MemoriA-dev/MemorIA_Backend/src/main/java/MemorIA/service/
  ├── IPlanningService.java
  ├── IReminderService.java
  ├── impl/PlanningServiceImpl.java
  └── impl/ReminderServiceImpl.java

MemoriA-dev/MemorIA_Backend/src/main/java/MemorIA/entity/Planning/
  ├── Reminder.java
  ├── Adherence.java
  └── ...
```

**Alerts Related:**
```
MemoriA-dev/MemorIA_Backend/src/main/java/MemorIA/controller/
  └── AlertController.java

MemoriA-dev/MemorIA_Backend/src/main/java/MemorIA/service/
  ├── AlertService.java
  └── impl/...

MemoriA-dev/MemorIA_Backend/src/main/java/MemorIA/entity/
  ├── Alert.java
  └── ...
```

---

## 🔄 Comment Revenir en Arrière?

Si les microservices ont des problèmes:

```bash
# Gardez le frontend pointant sur 8080 jusqu'au dernier moment
environment.ts: apiUrl = 'http://localhost:8080/api'

# Démarrez juste MemoriA_Backend
cd MemoriA-dev/MemorIA_Backend
mvn spring-boot:run

# Arrêtez les microservices
# Restart frontend
```

---

## 🗂️ Structure Actuellement

```
MemoriA-planning/
├── MemoriA-dev/
│   ├── MemorIA_Backend/              ← ANCIEN (8080) - Garde comme backup
│   │   ├── PlanningController.java
│   │   ├── AlertController.java
│   │   └── ...
│   │
│   ├── MemoriA-Planning-Service/     ← NOUVEAU (8091) - Microservice
│   │   ├── controller/ReminderController.java
│   │   ├── controller/AdherenceController.java
│   │   └── ...
│   │
│   └── MemoriA-Alerts-Service/       ← NOUVEAU (8092) - Microservice
│       ├── controller/AlertController.java
│       ├── controller/SmsNotificationController.java
│       └── ...
│
├── MIGRATION_COMPLETE.md             ← Comment utiliser nouveaux services
├── TRANSITION_GUIDE.md               ← VOUS ÊTES ICI
└── ...
```

---

## 📈 Timeline Recommandée

| Phase | Durée | Action | Quand Supprimer |
|-------|-------|--------|-----------------|
| **1. Setup** | 1-2h | Démarrer tous les services | Jamais |
| **2. Test** | 1-2 jours | Valider microservices côte à côte | Jamais |
| **3. Basculer Frontend** | 1h | Mettre à jour environment.ts | Après 1 jour |
| **4. Monitorer** | 1 semaine | Observer logs, erreurs | Après 1 semaine |
| **5. Cleanup** | 1h | Supprimer contrôleurs du backend | JAMAIS avant ça! |

---

## ⚠️ Avertissements Importants

1. **NE PAS supprimer** avant d'avoir testé les microservices
2. **NE PAS supprimer** avant que le Frontend soit basculé
3. **NE PAS supprimer** sans backup du backend complet
4. **Gardez** MemoriA_Backend comme reference si bugs apparaissent
5. **Testez** les deux architectures en parallèle d'abord

---

## 🎯 Votre Prochaine Action

1. **Immédiate:** Démarrer microservices + vérifier Eureka
2. **Demain:** Tester endpoints via Gateway (8888)
3. **2-3 jours:** Si tout OK → Mettre à jour Frontend (8080 → 8888)
4. **1 semaine:** Si stable → Commencer à penser au cleanup

---

**Status: ✅ DUAL ARCHITECTURE EN PLACE - GARDEZ LES DEUX POUR L'INSTANT**

Les anciens contrôleurs seront supprimés une fois la migration validée en production.
