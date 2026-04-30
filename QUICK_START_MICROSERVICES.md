# 🚀 QUICK START GUIDE - Microservices Complets

## ⏱️ 5 Minutes pour Lancer le Système Complet

---

## 📋 Prérequis

Assurez-vous que:
1. ✅ MySQL est installé et en cours d'exécution sur **port 3307**
   - User: `root`
   - Password: `root`

2. ✅ Maven est installé
   ```bash
   mvn --version
   ```

3. ✅ Node.js et npm sont installés
   ```bash
   node --version
   npm --version
   ```

4. ✅ Angular CLI est installé (optionnel)
   ```bash
   ng version
   ```

---

## 🗄️ Étape 1: Créer les Bases de Données (1 min)

### Windows - GUI MySQL:

Ouvrez **MySQL Workbench** ou **phpMyAdmin**:

```sql
-- Exécutez le script complet:
source c:/path/to/SETUP_ALL_DATABASES.sql;
```

### Ou via ligne de commande:

```bash
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning
mysql -u root -p < SETUP_ALL_DATABASES.sql
# Entrez le mot de passe: root
```

✅ **Vérification**: Vous devriez voir les bases de données créées:
```sql
SHOW DATABASES;
-- Vous devriez voir: users_db, planning_db, alerts_db
```

---

## 🚀 Étape 2: Démarrer Tous les Services (3 min)

### Option A: Script Automatisé (⭐ Recommandé)

**Windows PowerShell:**

```bash
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning
.\START_ALL_COMPLETE_SERVICES.ps1
```

Le script va:
1. ✅ Vérifier MySQL
2. ✅ Démarrer Eureka Registry (8761)
3. ✅ Démarrer User Service (8094)
4. ✅ Démarrer Planning Service (8091)
5. ✅ Démarrer Alerts Service (8092)
6. ✅ Démarrer API Gateway (8888)
7. ✅ Démarrer Frontend Angular (4200)
8. ✅ Ouvrir Eureka et Frontend dans le navigateur

### Option B: Démarrage Manuel

**Terminal 1 - Eureka Registry:**
```bash
cd MemoriA-dev/MemoriA-Registry
mvn clean install
mvn spring-boot:run
# Attendez "Started MemoriA Registry" (30-45 sec)
```

**Terminal 2 - User Service:**
```bash
cd MemoriA-dev/MemoriA-User-Service
mvn clean install
mvn spring-boot:run
# Attendez "Started MemoriA User Service"
```

**Terminal 3 - Planning Service:**
```bash
cd MemoriA-dev/MemoriA-Planning-Service
mvn clean install
mvn spring-boot:run
# Attendez "Started MemoriA Planning Service"
```

**Terminal 4 - Alerts Service:**
```bash
cd MemoriA-dev/MemoriA-Alerts-Service
mvn clean install
mvn spring-boot:run
# Attendez "Started MemoriA Alerts Service"
```

**Terminal 5 - API Gateway:**
```bash
cd MemoriA-dev/MemoriA-Gateway
mvn clean install
mvn spring-boot:run
# Attendez "Started MemoriA Gateway"
```

**Terminal 6 - Frontend Angular:**
```bash
cd MemoriA-dev/MemorIA_Frontend
npm install  # (si première fois)
ng serve
# Attendez "Application bundle generation complete"
```

---

## ✅ Étape 3: Vérifier que Tout Fonctionne (1 min)

Ouvrez votre navigateur:

### 1. Eureka Registry
```
http://localhost:8761
```

Vous devriez voir:
- ✅ user-service (Instances: 1)
- ✅ planning-service (Instances: 1)
- ✅ alerts-service (Instances: 1)
- ✅ memoria-gateway (Instances: 1)

### 2. API Gateway Health
```
http://localhost:8888/actuator/health
```

Vous devriez voir:
```json
{
  "status": "UP"
}
```

### 3. Frontend
```
http://localhost:4200
```

La page d'accueil Angular s'affiche ✅

---

## 🔐 Étape 4: Tester l'Authentification (1 min)

### Test 1: Login avec utilisateur existant

```bash
curl -X POST http://localhost:8888/api/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@memoria.com","password":"password123"}'
```

**Réponse attendue:**
```json
{
  "id": 1,
  "email": "doctor@memoria.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "DOCTOR",
  "token": "MTo0NzYwMjE1MTUzMQ==",
  "profileCompleted": true
}
```

### Test 2: Register nouvel utilisateur

```bash
curl -X POST http://localhost:8888/api/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@memoria.com",
    "password":"password123",
    "nom":"Dupont",
    "prenom":"Jean",
    "telephone":"0123456789",
    "role":"PATIENT"
  }'
```

**Réponse attendue:**
```json
{
  "id": 4,
  "email": "newuser@memoria.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "PATIENT",
  "token": "NTo0NzYwMjE1MTUzMQ==",
  "profileCompleted": false
}
```

### Test 3: Récupérer infos utilisateur

```bash
curl -X GET http://localhost:8888/api/users/auth/info/1 \
  -H "Content-Type: application/json"
```

**Réponse attendue:**
```json
{
  "id": 1,
  "email": "doctor@memoria.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "DOCTOR",
  "profileCompleted": true
}
```

---

## 🎯 Utilisateurs de Test

| Email | Password | Rôle | Utilisé pour |
|-------|----------|------|--------------|
| doctor@memoria.com | password123 | DOCTOR | Tests médecin |
| patient@memoria.com | password123 | PATIENT | Tests patient |
| caregiver@memoria.com | password123 | CAREGIVER | Tests accompagnant |

---

## 📊 Architecture Finale

```
Frontend (4200)
     │
     └─→ API Gateway (8888)
           ├─→ /api/users/** → User Service (8094)
           ├─→ /api/planning/** → Planning Service (8091)
           └─→ /api/alerts/** → Alerts Service (8092)

Eureka Registry (8761) - Service Discovery
```

---

## 🚨 Dépannage

### Erreur: "Connection refused" à port 3307
```
→ Démarrez MySQL
→ Vérifiez que le port est 3307 (pas 3306)
```

### Erreur: "Services not registered"
```
→ Attendez 30 secondes
→ Vérifiez les logs dans les terminaux
→ Rafraîchissez Eureka: http://localhost:8761
```

### Erreur: "Port 8094 already in use"
```
→ Arrêtez le service existant: 
  netstat -ano | findstr :8094
  taskkill /PID <PID> /F
```

### Frontend ne charge pas
```
→ Vérifiez que ng serve s'est lancé
→ Effacez le cache: Ctrl+Shift+Del
→ Redémarrez Angular
```

---

## 🎉 Prochaines Étapes

Une fois que tout fonctionne:

1. **Explorer les endpoints** via Postman
2. **Créer des rappels** via Planning Service
3. **Créer des alertes** via Alerts Service
4. **Gérer les utilisateurs** via User Service
5. **Déployer** sur production

---

## 📚 Documentation Complète

- [MIGRATION_COMPLETE_3_MICROSERVICES.md](MIGRATION_COMPLETE_3_MICROSERVICES.md) - Architecture complète
- [SETUP_ALL_DATABASES.sql](SETUP_ALL_DATABASES.sql) - SQL complet
- [MemoriA-dev/MemoriA-User-Service/](MemoriA-dev/MemoriA-User-Service/) - Code source User Service
- [MemoriA-dev/MemoriA-Planning-Service/](MemoriA-dev/MemoriA-Planning-Service/) - Code source Planning Service
- [MemoriA-dev/MemoriA-Alerts-Service/](MemoriA-dev/MemoriA-Alerts-Service/) - Code source Alerts Service

---

## ✅ Checklist Démarrage Rapide

- [ ] MySQL est en cours d'exécution sur port 3307
- [ ] SETUP_ALL_DATABASES.sql a été exécuté
- [ ] Tous les services démarrés (Eureka, 3 services, Gateway, Frontend)
- [ ] Eureka montre 4 services enregistrés
- [ ] Frontend charge sur http://localhost:4200
- [ ] Login fonctionne avec doctor@memoria.com
- [ ] Tests API au moins une fois

---

## 🎓 Formation Rapide

**Où faire quoi:**
- **Frontend**: http://localhost:4200
- **Gérer services**: http://localhost:8761 (Eureka)
- **Tester API**: http://localhost:8888 (Gateway)
- **Logs User Service**: Terminal où User Service tourne
- **Logs Planning Service**: Terminal où Planning Service tourne
- **Logs Alerts Service**: Terminal où Alerts Service tourne

---

**Vous êtes prêt à utiliser MemoriA Microservices! 🚀**

Des questions? Consultez [MIGRATION_COMPLETE_3_MICROSERVICES.md](MIGRATION_COMPLETE_3_MICROSERVICES.md)
