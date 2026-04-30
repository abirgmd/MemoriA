# MemoriA - Plateforme de Suivi Médical

[![Build Status](https://img.shields.io/badge/status-active-brightgreen)]()
[![Java](https://img.shields.io/badge/Java-17-orange)]()
[![Angular](https://img.shields.io/badge/Angular-17-red)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen)]()

## 📋 Description

MemoriA est une plateforme web complète pour la gestion des alertes médicales et le suivi des patients. Elle permet aux soignants, accompagnants et patients de communiquer en temps réel avec un système d'alerte robuste.

## 🚀 Quick Start

### Prérequis
- **Java**: 17+
- **Node.js**: 18+ (npm ou yarn)
- **MySQL**: 8.0+ (port 3307 ou 3306)
- **Maven**: 3.8+ (optionnel, mvnw inclus)

### 1️⃣ Backend (Spring Boot)

```bash
cd MemoriA-dev/MemorIA_Backend

# Compiler
mvn clean install

# Démarrer le serveur
mvn spring-boot:run
```

Le backend sera accessible sur **http://localhost:8089**

### 2️⃣ Frontend (Angular)

```bash
cd MemoriA-dev/MemorIA_Frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
ng serve
```

Le frontend sera accessible sur **http://localhost:4200**

### 3️⃣ Base de Données

```bash
# Créer le schéma
mysql -u root -p < database/migrations/001_init_schema.sql

# Ajouter les tables
mysql -u root -p < database/migrations/002_create_alerts_table.sql
mysql -u root -p < database/migrations/003_create_chat_table.sql

# (Optionnel) Charger des données de test
mysql -u root -p < database/seeds/test_data.sql
```

## 📁 Structure du Projet

```
MemoriA/
├── MemoriA-dev/              # Code source principal
│   ├── MemorIA_Backend/      # Spring Boot 3.3.0
│   └── MemorIA_Frontend/     # Angular 17
├── database/                 # Scripts SQL
│   ├── migrations/           # Schémas versionnés
│   ├── seeds/                # Données de test
│   └── cleanup/              # Nettoyage
├── scripts/                  # Utilitaires
├── docs/                     # Documentation
├── .gitignore               # Fichiers ignorés
└── README.md                # Ce fichier
```

## 🧪 Tests

### Backend
```bash
cd MemoriA-dev/MemorIA_Backend
mvn test
```

### Frontend
```bash
cd MemoriA-dev/MemorIA_Frontend
npm test
```

## 📚 Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Vue d'ensemble technique
- [SETUP.md](docs/SETUP.md) - Instructions d'installation détaillées
- [API.md](docs/API.md) - Documentation des endpoints API
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) - Guide de contribution

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine:

```env
# Database
DB_HOST=localhost
DB_PORT=3307
DB_NAME=memoria_db
DB_USERNAME=root
DB_PASSWORD=

# Twilio SMS (optionnel)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Profils Spring Boot

- `default` - Développement local
- `test` - Tests
- `prod` - Production

Voir `MemoriA-dev/MemorIA_Backend/src/main/resources/application-*.properties`

## 🤝 Architecture

### Backend
- **Pattern**: Clean Architecture (Controller → Service → Repository)
- **Framework**: Spring Boot 3.3.0 avec Spring Security
- **Database**: JPA/Hibernate + MySQL
- **Logging**: SLF4J avec Logback

### Frontend
- **Pattern**: Smart Components (Core/Shared/Features)
- **Framework**: Angular 17 avec standalone components
- **Styling**: Tailwind CSS
- **HTTP**: HttpClient avec intercepteurs

## ✅ Checklist Démarrage

- [ ] MySQL démarré sur le bon port
- [ ] Variables d'environnement configurées
- [ ] `mvn clean install` réussi en backend
- [ ] `npm install` réussi en frontend
- [ ] Backend démarre sur http://localhost:8089
- [ ] Frontend démarre sur http://localhost:4200
- [ ] Tests passent: `mvn test` et `npm test`

## 🐛 Troubleshooting

### La base de données ne se connecte pas
```
Vérifier:
1. MySQL est en cours d'exécution: netstat -ano | findstr :3307
2. Identifiants dans application.properties
3. Port correct (3307 ou 3306)
4. Base "memoria_db" existe
```

### Le port 3307 ou 4200 est déjà utilisé
```bash
# Trouver le processus
netstat -ano | findstr :3307

# Terminer le processus (remplacer PID)
taskkill /PID 1234 /F

# Ou utiliser un autre port
mvn spring-boot:run -Dserver.port=8090
ng serve --port 4201
```

### Les tests frontend échouent
```bash
cd MemoriA-dev/MemorIA_Frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm test
```

## 📞 Support

- **Issues**: Ouvrir une issue sur GitHub
- **Documentation**: Consulter le dossier [docs/](docs/)
- **Logs**: Vérifier `MemoriA-dev/MemorIA_Backend/logs/`

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE) - À adapter

## ✍️ Auteurs

- Équipe MemoriA

---

**Dernière mise à jour**: 29 avril 2026
**Version**: 1.0.0
