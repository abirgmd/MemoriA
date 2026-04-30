# 🔧 Guide d'Installation - MemoriA

## Prérequis

Avant de commencer, assurez-vous d'avoir installé:

### ✅ Java 17+
```bash
# Vérifier la version
java -version

# Télécharger: https://www.oracle.com/java/technologies/downloads/#java17
```

### ✅ Node.js 18+ et npm
```bash
# Vérifier les versions
node --version
npm --version

# Télécharger: https://nodejs.org/
```

### ✅ MySQL 8.0+
```bash
# Vérifier la connexion
mysql -u root -p

# Télécharger: https://dev.mysql.com/downloads/mysql/
```

### ✅ Git
```bash
git --version

# Télécharger: https://git-scm.com/
```

---

## 📋 Installation Rapide

### 1. Clone le repository
```bash
git clone <your-repo-url> MemoriA
cd MemoriA
```

### 2. Setup automatique (Linux/Mac)
```bash
chmod +x scripts/setup-dev-env.sh
./scripts/setup-dev-env.sh
```

### 3. Setup manuel (Windows ou si script échoue)

#### Backend
```bash
cd MemoriA-dev/MemorIA_Backend

# Compiler avec Maven
mvn clean install

# Démarrer le serveur
mvn spring-boot:run
```

**Résultat attendu**: Backend démarre sur http://localhost:8089

#### Frontend
```bash
# Nouveau terminal
cd MemoriA-dev/MemorIA_Frontend

# Installer les dépendances
npm install --legacy-peer-deps

# Démarrer le serveur
ng serve --open
```

**Résultat attendu**: Frontend démarre sur http://localhost:4200

#### Database
```bash
# Exécuter les scripts SQL
mysql -u root -p < database/migrations/001_init_schema.sql
mysql -u root -p < database/migrations/002_create_alerts_table.sql
mysql -u root -p < database/migrations/003_create_chat_table.sql
```

---

## ⚙️ Configuration

### Backend Configuration

#### 1. Database Connection
Fichier: `MemoriA-dev/MemorIA_Backend/src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3307/memoria_db
spring.datasource.username=root
spring.datasource.password=

# Ou utiliser des variables d'environnement
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3307}/${DB_NAME:memoria_db}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
```

#### 2. Twilio SMS (optionnel)
```properties
twilio.account-sid=${TWILIO_ACCOUNT_SID:}
twilio.auth-token=${TWILIO_AUTH_TOKEN:}
twilio.phone-number=${TWILIO_PHONE_NUMBER:}
twilio.enabled=true
```

#### 3. Variables d'Environnement
Créer un fichier `.env` à la racine:
```env
# Database
DB_HOST=localhost
DB_PORT=3307
DB_NAME=memoria_db
DB_USERNAME=root
DB_PASSWORD=

# Twilio (optionnel)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend Configuration

Fichier: `MemoriA-dev/MemorIA_Frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8089',
  apiTimeout: 30000
};
```

---

## 🗄️ Database Setup

### Créer les tables

```bash
# 1. Créer la base de données
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS memoria_db;"

# 2. Exécuter les scripts de migration
mysql -u root -p memoria_db < database/migrations/001_init_schema.sql
mysql -u root -p memoria_db < database/migrations/002_create_alerts_table.sql
mysql -u root -p memoria_db < database/migrations/003_create_chat_table.sql

# 3. (Optionnel) Charger des données de test
mysql -u root -p memoria_db < database/seeds/test_data.sql
```

### Vérifier les tables
```bash
mysql -u root -p -e "USE memoria_db; SHOW TABLES;"
```

---

## 🧪 Tests

### Backend Tests
```bash
cd MemoriA-dev/MemorIA_Backend

# Tous les tests
mvn test

# Tests d'une classe spécifique
mvn test -Dtest=SmsServiceTest

# Avec couverture
mvn clean test jacoco:report
```

### Frontend Tests
```bash
cd MemoriA-dev/MemorIA_Frontend

# Tous les tests
npm test

# Headless (CI/CD)
npm run test:ci

# Avec couverture
npm run test:coverage
```

---

## 🐛 Troubleshooting

### Erreur: "Connection refused" sur la base de données

**Problème**: MySQL n'est pas connecté

**Solutions**:
1. Vérifier que MySQL est démarré:
   ```bash
   # Windows
   netstat -ano | findstr :3307
   
   # Mac/Linux
   lsof -i :3307
   ```

2. Changer le port dans `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/memoria_db
   ```

3. Vérifier les credentials:
   ```bash
   mysql -u root -p
   ```

### Erreur: "Port 4200 already in use"

```bash
# Trouver le processus
lsof -i :4200

# Terminer le processus (remplacer PID)
kill -9 <PID>

# Ou utiliser un autre port
ng serve --port 4201
```

### Erreur: "npm ERR! peer dep missing"

```bash
# Installer avec legacy flag
npm install --legacy-peer-deps

# Si ça persiste, clear et réinstaller
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Tests échouent en backend

```bash
# Vérifier les dépendances
mvn clean dependency:resolve

# Réinstaller
mvn clean install -U

# Voir les logs
mvn test -X
```

### "Cannot find module" en frontend

```bash
# Vérifier node_modules
npm ls

# Réinstaller
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Mettre en cache
npm cache clean --force
```

---

## 🚀 Démarrage Complet

### Option 1: Scripts (Recommandé)

```bash
# Terminal 1 - Backend
./scripts/start-backend.sh

# Terminal 2 - Frontend
./scripts/start-frontend.sh

# Terminal 3 - Tests (optionnel)
./scripts/test.sh
```

### Option 2: Commandes manuelles

```bash
# Terminal 1 - Backend
cd MemoriA-dev/MemorIA_Backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd MemoriA-dev/MemorIA_Frontend
ng serve

# Terminal 3 - Tests (optionnel)
cd MemoriA-dev/MemorIA_Backend
mvn test
```

### Option 3: Docker (si configuré)

```bash
docker-compose up
```

---

## ✅ Vérification

Une fois tout démarré, vérifier:

- [ ] Backend accessible sur http://localhost:8089
- [ ] Frontend accessible sur http://localhost:4200
- [ ] Base de données connectée (vérifier logs backend)
- [ ] Tests passent: `mvn test` et `npm test`
- [ ] Pas d'erreurs dans les consoles

### Endpoint de test
```bash
# Backend health check
curl http://localhost:8089/actuator/health

# Expected response
{"status":"UP"}
```

---

## 📖 Ressources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Authentication](https://jwt.io/)
- [Twilio SMS API](https://www.twilio.com/docs)

---

## 🆘 Support

- Consulter [ARCHITECTURE.md](ARCHITECTURE.md) pour les détails techniques
- Vérifier les logs: `MemoriA-dev/MemorIA_Backend/logs/`
- Ouvrir une issue sur GitHub

---

**Last Updated**: 29 avril 2026
**Version**: 1.0.0
