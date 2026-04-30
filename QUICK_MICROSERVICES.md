# ⚡ Démarrage Rapide - Microservices Planning & Alerts

## 📦 Créé

✅ 4 Microservices:
- Eureka Registry (8761)
- API Gateway (8888)
- Planning Service (8091)
- Alerts Service (8092)

## 🚀 Démarrer en 5 Minutes

### Étape 1: Prérequis
- Maven 3.8+
- Java 17+
- MySQL 8.0+ sur port 3307
- Angular CLI (pour frontend)

### Étape 2: Démarrer les Services

**Ordre important:**

```bash
# Terminal 1: Eureka (attendez qu'il soit prêt)
cd MemoriA-dev/MemoriA-Registry && mvn spring-boot:run

# Attendre 10 secondes, puis...

# Terminal 2: Planning Service
cd MemoriA-dev/MemoriA-Planning-Service && mvn spring-boot:run

# Terminal 3: Alerts Service
cd MemoriA-dev/MemoriA-Alerts-Service && mvn spring-boot:run

# Terminal 4: API Gateway
cd MemoriA-dev/MemoriA-Gateway && mvn spring-boot:run

# Terminal 5: Frontend
cd MemoriA-dev/MemoriA_Frontend && ng serve
```

### Étape 3: Vérifier

1. **Eureka Dashboard**: http://localhost:8761
   - Voir les 3 services enregistrés

2. **Frontend**: http://localhost:4200

3. **Tester**: 
   ```bash
   curl http://localhost:8888/actuator/health
   ```

## 🗄️ Créer les Bases

```sql
mysql -u root -p

CREATE DATABASE planning_db CHARACTER SET utf8mb4;
CREATE DATABASE alerts_db CHARACTER SET utf8mb4;
```

## 🔗 Architecture

```
Angular Frontend (4200)
        ↓
   API Gateway (8888)
   ↙                  ↘
Planning (8091)    Alerts (8092)
   ↓                   ↓
planning_db        alerts_db
   ↑                   ↑
      ← Eureka (8761)
         (service discovery)
```

## 📝 Prochaines Étapes

1. Copier code de `MemoriA_Backend` vers Planning Service
2. Copier code de `MemoriA_Backend` vers Alerts Service
3. Mettre à jour Frontend pour utiliser Gateway (8888)
4. Migrer les données aux nouvelles bases
5. Tester end-to-end
6. Déployer

## ✅ Vérification Rapide

```bash
# Check tous les services
curl http://localhost:8761                    # Eureka OK?
curl http://localhost:8888/actuator/health    # Gateway OK?
curl http://localhost:8091/actuator/health    # Planning OK?
curl http://localhost:8092/actuator/health    # Alerts OK?
```

## 💡 Ports Clés

- 8761: Eureka (vérifier services)
- 8888: API Gateway (frontend utilise celui-ci)
- 8091: Planning Service
- 8092: Alerts Service
- 4200: Frontend
- 3307: MySQL

---

**Status**: ✅ Prêt à l'emploi
**Durée**: ~10 minutes pour démarrage complet
