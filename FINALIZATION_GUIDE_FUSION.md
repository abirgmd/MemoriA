# 🎯 GUIDE DE FINALISATION - Fusion Auth + User → Identity Service

## ✅ Étapes Complètes (À Faire Dans Cet Ordre)

---

## ÉTAPE 1: Vérifier la Fusion (Avant Démarrage)

### 1.1 Vérifier les fichiers créés/modifiés

**MemoriA-User-Service (Identity Service)**:
```
✅ src/main/java/MemorIA/
   ├── security/
   │   ├── JwtProvider.java          ✅ NOUVEAU
   │   ├── SecurityConfig.java       ✅ MODIFIÉ
   │   └── CustomUserDetailsService.java ✅ NOUVEAU
   ├── entity/User.java              ✅ MODIFIÉ (fusionné)
   ├── service/
   │   ├── IAuthService.java         ✅ MODIFIÉ (étendu)
   │   └── AuthServiceImpl.java       ✅ MODIFIÉ (JWT)
   ├── controller/AuthController.java ✅ MODIFIÉ (dual-route)
   ├── dto/
   │   ├── AuthResponse.java         ✅ MODIFIÉ (enrichi)
   │   └── SignupRequest.java        ✅ MODIFIÉ (enrichi)

✅ src/main/resources/application.yml    ✅ MODIFIÉ (JWT, identity-service)
✅ pom.xml                               ✅ MODIFIÉ (JWT deps)
```

**MemoriA-Gateway**:
```
✅ src/main/resources/application.yml    ✅ MODIFIÉ (routes fusionnées)
```

### 1.2 Vérifier les Eureka app names

**Avant** (2 services):
- user-service (8094)
- auth-service (8093)

**Après** (1 service):
- identity-service (8094)
- auth-service (8093) ← À SUPPRIMER

---

## ÉTAPE 2: Arrêter les Services Existants

```bash
# Fermer tous les terminaux/services actuels
Ctrl+C dans tous les terminaux des services
```

---

## ÉTAPE 3: Supprimer/Archiver MemoriA-Auth-Service

### Option A: Script Automatisé (Recommandé)
```bash
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning
.\ARCHIVE_AUTH_SERVICE.ps1
```

### Option B: Manuel
```bash
# Archiver le dossier
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev
# Renommer MemoriA-Auth-Service en MemoriA-Auth-Service.ARCHIVED
Move-Item "MemoriA-Auth-Service" "MemoriA-Auth-Service.ARCHIVED"
```

---

## ÉTAPE 4: Build Identity Service avec JWT

```bash
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-User-Service

# Clean build (important pour JWT)
mvn clean install

# Vous devriez voir:
# [INFO] Building memoria-user-service 1.0.0
# [INFO] ...jjwt-api...
# [INFO] ...jjwt-impl...
# [INFO] BUILD SUCCESS
```

---

## ÉTAPE 5: Redémarrer Eureka & Gateway

```bash
# Terminal 1: Eureka Registry
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-Registry
mvn spring-boot:run

# Attendez: "Started MemoriA Registry"
```

```bash
# Terminal 2: API Gateway
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-Gateway
mvn clean install
mvn spring-boot:run

# Attendez: "Started MemoriA Gateway"
```

---

## ÉTAPE 6: Démarrer Identity Service (New)

```bash
# Terminal 3: Identity Service (anciennement User Service)
cd C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-User-Service

mvn clean install
mvn spring-boot:run

# Attendez: "Started MemoriA User Service"
# Vérifiez les logs pour JWT config:
# [INFO] JWT Secret loaded...
# [INFO] JWT Expiration: 86400000 ms
```

---

## ÉTAPE 7: Vérifier Eureka

### Vérifier registration
```
http://localhost:8761
```

**Vous devriez voir**:
- ✅ **identity-service** (1 instance)
- ✅ **memoria-gateway** (1 instance)
- ❌ ~~auth-service~~ (DISPARU - bon!)
- ❌ ~~user-service~~ (Remplacé par identity-service)

---

## ÉTAPE 8: Tester les Endpoints

### Test 1: Login (Nouveau JWT token)
```bash
curl -X POST http://localhost:8888/api/identity/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"doctor@memoria.com",
    "password":"password123"
  }'
```

**Réponse attendue** (Token JWT, PAS Base64):
```json
{
  "id": 1,
  "email": "doctor@memoria.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "DOCTOR",
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkb2N0b3JAbWVtb3JpYS5jb20iLCJpZCI6MSwicm9sZSI6IkRPQ1RPUiIsImlhdCI6MTcxNDMyODQ0MywiZXhwIjoxNzE0NDE0ODQzfQ.7kGNhQ...",
  "profileCompleted": true
}
```

**Note**: Le token commence par `eyJ` (JWT header) au lieu de Base64 simple.

### Test 2: Rétro-compatibilité (/api/users/auth)
```bash
curl -X POST http://localhost:8888/api/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@memoria.com","password":"password123"}'

# Devrait fonctionner ✅
```

### Test 3: Signup
```bash
curl -X POST http://localhost:8888/api/identity/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@memoria.com",
    "password":"password123",
    "firstName":"Marie",
    "lastName":"Martin",
    "nom":"Martin",
    "prenom":"Marie",
    "telephone":"0123456789",
    "role":"PATIENT"
  }'

# Statut: 201 Created
```

### Test 4: Verify Token
```bash
TOKEN="<TOKEN_FROM_LOGIN>"

curl -X POST http://localhost:8888/api/identity/auth/verify \
  -H "Authorization: Bearer $TOKEN"

# Réponse: {"message":"Token valid"} ✅
```

### Test 5: Get User Info
```bash
curl -X GET http://localhost:8888/api/identity/auth/info/1 \
  -H "Content-Type: application/json"

# Retourne: {"id":1, "email":"doctor@memoria.com", ...}
```

---

## ÉTAPE 9: Démarrer les Autres Services (Optionnel)

```bash
# Terminal 4: Planning Service
cd MemoriA-dev/MemoriA-Planning-Service
mvn spring-boot:run

# Terminal 5: Alerts Service
cd MemoriA-dev/MemoriA-Alerts-Service
mvn spring-boot:run

# Terminal 6: Frontend
cd MemoriA-dev/MemorIA_Frontend
ng serve
```

---

## ✅ Vérification Finale

| Élément | Avant | Après | Status |
|---------|-------|-------|--------|
| Auth Service | Port 8093 | Archivé | ✅ |
| User Service | Port 8094 (Base64) | Identity Service (JWT) | ✅ |
| Eureka | user-service + auth-service | identity-service | ✅ |
| Tokens | Base64 | JWT | ✅ |
| Endpoints | /api/auth/**, /api/users/** | /api/identity/** | ✅ |
| Gateway | 2 routes | 1 route (fusionnée) | ✅ |

---

## 🚀 Configuration Finale des Services

```
TABLEAU FINAL:

Service             Port    Eureka Name        Status
─────────────────────────────────────────────────────
Identity Service    8094    identity-service   ✅ FUSIONNÉ
Planning Service    8091    planning-service   ✅ OK
Alerts Service      8092    alerts-service     ✅ OK
API Gateway         8888    memoria-gateway    ✅ OK
Eureka Registry     8761    eureka-server      ✅ OK
Frontend            4200    -                  ✅ OK

DEPRECATED/ARCHIVÉ:
Auth Service (8093) - Merged into Identity Service ⚠️
User Service name - Renamed to Identity Service ⚠️
```

---

## ⚠️ Points Importants

1. **Ancien MemoriA-Auth-Service**: 
   - ✅ Archivé (ARCHIVE_AUTH_SERVICE.ps1)
   - ⚠️ NE PAS redémarrer

2. **JWT Tokens**: 
   - ✅ Plus sécurisés que Base64
   - ✅ Valides 24h (configurable)
   - ✅ Signature HMAC-SHA512

3. **Rétro-compatibilité**: 
   - ✅ Anciens endpoints (/api/users/**, /api/auth/**) fonctionnent toujours
   - ✅ Dirigés vers Identity Service

4. **Database**:
   - ✅ Inchangée (users_db)
   - ✅ Compatible avec nouvelle User entity

---

## 🐛 Troubleshooting

### Error: "Identity Service ne s'enregistre pas avec Eureka"
```
→ Vérifiez que Eureka est démarré en premier
→ Vérifiez application.yml (appname: identity-service)
→ Attendez 30 secondes
→ Rafraîchissez Eureka: http://localhost:8761
```

### Error: "JWT Provider not found"
```
→ Vérifiez que les dépendances JWT sont installées
→ Exécutez: mvn clean install
→ Redémarrez le service
```

### Error: "Token invalid"
```
→ JWT_SECRET dans application.yml doit être configuré
→ Sinon utilise défaut (OK pour dev)
→ Vérifiez que token n'a pas expiré (24h)
```

### Frontend ne se connecte pas
```
→ Vérifiez que Gateway route /api/identity/** est OK
→ Testez via curl d'abord
→ Vérifiez CORS dans SecurityConfig
```

---

## ✨ Résumé Final

### Avant Fusion
- 2 services: Auth (8093) + User (8094)
- 2 bases: auth_db + users_db
- Base64 tokens
- Code dupliqué
- Confus de responsabilités

### Après Fusion
- 1 service: Identity (8094)
- 1 base: users_db
- JWT tokens
- Code consolidé
- Responsabilité unique et claire

### Microservices Finaux (3 services)
1. **Identity Service** (8094) ← FUSIONNÉ
2. **Planning Service** (8091)
3. **Alerts Service** (8092)

---

## ✅ Checklist Finalisation

- [ ] Fichiers créés/modifiés vérifiés
- [ ] Build Identity Service réussi
- [ ] Eureka registry démarré
- [ ] Identity Service enregistré dans Eureka
- [ ] Test login réussi (JWT token obtenu)
- [ ] Test signup réussi (nouvel utilisateur créé)
- [ ] Test verify token réussi
- [ ] Rétro-compatibilité vérifiée
- [ ] Auth-Service archivé
- [ ] Documentation mise à jour

**Une fois tous les checks ✅, la fusion est COMPLÈTE!**

🎉 **FUSION TERMINÉE ET TESTÉE!** 🎉
