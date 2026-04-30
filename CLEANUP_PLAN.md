# 📋 PLAN DE NETTOYAGE - MemoriA Project

## ✅ FICHIERS À SUPPRIMER (SANS RISQUE)

### Documentation texte (déjà en mémoire)
```
00_LIRE_MOI_D_ABORD.txt
00_START_HERE_DESIGN_ALERTS.txt
ALERT_FIXES_SUMMARY.txt
ALERTS_WORK_COMPLETED.txt
CONFIRMATION_FINALE.txt
EXECUTIVE_SUMMARY.txt
QUICK_COMMANDS.sh
QUICK_START.sh
SOMMAIRE_IMPRIMABLE.txt
START.sh
START_HERE.txt
SUMMARY.txt
ULTRA_QUICK_SUMMARY.txt
```
**Raison**: Docs temporaires de débogage. Remplacer par un README.md propre.

### Scripts de test/configuration (obsolètes)
```
check_alerts.sh
CLEANUP_COMMANDS.sh
compile_alertservice.ps1
compile_alertservice.sh
fix_alerte_error.ps1
memoria_alerts_setup.bat
memoria_alerts_setup.sh
test-alerts.ps1
test-alerts.sh
verify_alerts_system.sh
verify_fixes.sh
start-memoria.sh
start_alerts_system.bat
```
**Raison**: Scripts de débogage. À remplacer par des scripts propres dans `scripts/`.

### Fichiers de debug et logs
```
hs_err_pid20536.log
build.log (dans Frontend)
ng-serve.log (dans Frontend)
```
**Raison**: Fichiers de crash générés à la compilation.

### Fichiers obsolètes
```
CORRECTED_AlertController.java
CODE_COMPLET_CORRIGE_ALERTES.ts
```
**Raison**: Fichiers de sauvegarde, la version finale est dans le code.

### Dossiers dupliqués
```
Nouveau dossier/  (MemoriA-dev/Nouveau dossier/)
src/  (à la racine MemoriA-planning/)
node_modules/  (à la racine - mauvaise localisation)
```
**Raison**: Copies/duplicatas inutiles.

### À vérifier
```
pom.xml  (à la racine - devrait être dans Backend uniquement)
package-lock.json  (plusieurs fois)
```

---

## ⚠️ FICHIERS À GARDER

### Configuration
```
.gitignore
.git/
.idea/  (EditorConfig IntelliJ)
.mvn/  (Wrapper Maven)
.vscode/  (Configuration VS Code)
```

### Backend
```
MemoriA-dev/MemorIA_Backend/
  ├── pom.xml (Maven)
  ├── mvnw / mvnw.cmd
  ├── src/
  ├── target/
  └── .gitignore
```

### Frontend
```
MemoriA-dev/MemorIA_Frontend/
  ├── package.json
  ├── angular.json
  ├── src/
  ├── dist/
  ├── node_modules/  (généré, ignore via .gitignore)
  └── tsconfig.*.json
```

### Base de données
```
database/
  ├── create_schema.sql
  ├── create_alerts_table.sql
  ├── create_chat_table.sql
  └── cleanup_alerts.sql
```

---

## 📁 NOUVELLE STRUCTURE OPTIMISÉE

```
MemoriA/
│
├── 📄 README.md                    # Documentation principale
├── 📄 .gitignore                   # Fichiers ignorés
├── 📄 .editorconfig                # Cohérence éditeurs
├── 📄 LICENSE
│
├── 📁 backend/                     # Spring Boot
│   ├── 📄 pom.xml
│   ├── 📁 src/
│   │   ├── main/java/MemorIA/
│   │   │   ├── config/            # Configuration Spring
│   │   │   ├── controller/        # REST endpoints
│   │   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── entity/            # JPA entities
│   │   │   ├── exception/         # Custom exceptions
│   │   │   ├── mapper/            # DTO mappers
│   │   │   ├── repository/        # Data access
│   │   │   ├── security/          # Auth/Security
│   │   │   ├── service/           # Business logic
│   │   │   ├── util/              # Utilities
│   │   │   └── MemorIaBackendApplication.java
│   │   ├── resources/
│   │   │   ├── application.properties
│   │   │   ├── application-test.properties
│   │   │   ├── application-prod.properties
│   │   │   └── init.sql
│   │   └── test/java/
│   ├── 📁 .mvn/
│   └── 📁 target/                 # Build output (.gitignore)
│
├── 📁 frontend/                    # Angular
│   ├── 📄 package.json
│   ├── 📄 angular.json
│   ├── 📁 src/
│   │   ├── app/
│   │   │   ├── core/              # Singleton services
│   │   │   │   ├── services/
│   │   │   │   ├── guards/
│   │   │   │   └── interceptors/
│   │   │   ├── shared/            # Components réutilisables
│   │   │   │   ├── components/
│   │   │   │   ├── models/
│   │   │   │   ├── services/
│   │   │   │   ├── pipes/
│   │   │   │   └── directives/
│   │   │   ├── features/          # Modules métier
│   │   │   │   ├── auth/
│   │   │   │   ├── alerts/
│   │   │   │   ├── chat/
│   │   │   │   ├── profile/
│   │   │   │   ├── diagnostic/
│   │   │   │   └── rapport/
│   │   │   ├── layouts/           # Layouts
│   │   │   └── app.component.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   ├── main.ts
│   │   └── styles.css
│   ├── 📁 dist/                   # Build output (.gitignore)
│   ├── 📁 node_modules/           # (.gitignore)
│   └── tsconfig*.json
│
├── 📁 database/                    # Scripts SQL
│   ├── migrations/                # Versionning des schemas
│   │   ├── 001_init_schema.sql
│   │   ├── 002_create_alerts_table.sql
│   │   └── 003_create_chat_table.sql
│   ├── seeds/                     # Données de test
│   │   └── test_data.sql
│   └── cleanup/
│       └── cleanup_tables.sql
│
├── 📁 scripts/                     # Scripts utilitaires
│   ├── start-backend.sh
│   ├── start-frontend.sh
│   ├── build.sh
│   ├── test.sh
│   └── setup-dev-env.sh
│
├── 📁 docs/                        # Documentation détaillée
│   ├── ARCHITECTURE.md             # Vue d'ensemble
│   ├── SETUP.md                    # Installation
│   ├── API.md                      # API endpoints
│   ├── DEPLOYMENT.md               # Déploiement
│   └── CONTRIBUTING.md
│
├── 📁 .github/                     # GitHub (optionnel)
│   └── workflows/                  # CI/CD
│       └── ci.yml
│
└── 📄 docker-compose.yml           # (Si vous utilisez Docker)
```

---

## 🎯 BONNES PRATIQUES APPLIQUÉES

### **Backend - Clean Architecture**
✅ **Separation of Concerns**: controller → service → repository
✅ **Dependency Injection**: RequiredArgsConstructor pour les dépendances
✅ **DTOs**: Séparation model/API
✅ **Multi-profiles**: application-{test,prod}.properties
✅ **Logging**: @Slf4j pour structured logging

### **Frontend - Smart Components Architecture**
✅ **Core module**: Services singleton, Guards, Interceptors
✅ **Shared module**: Components/Pipes/Directives réutilisables
✅ **Features module**: Modules métier isolés (lazy-loaded)
✅ **Lazy loading**: Chaque feature chargée à la demande

### **Configuration & Versioning**
✅ **Gitignore**: Ignore `/node_modules`, `/target`, `/dist`, `.env`, logs
✅ **EditorConfig**: Cohérence entre IDE
✅ **README**: Clair et instructif

---

## ✅ FICHIERS À CRÉER

### 1. `.gitignore` (complété)
```gitignore
# IDE
.idea/
.vscode/
*.swp
*.swo

# Backend
backend/target/
backend/.mvn/
backend/*.log

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.angular/
frontend/*.log

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local

# Database
*.db
*.sqlite
```

### 2. `README.md`
```markdown
# MemoriA - Système d'Alerte Médicale

## 🎯 Objectif
Plateforme pour [décrire le cas d'usage]

## 🚀 Quick Start

### Backend
\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
ng serve
\`\`\`

### Database
- MySQL 8.0+
- Port 3306 (ou 3307)

## 📁 Structure
Voir [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 🧪 Tests
\`\`\`bash
./scripts/test.sh
\`\`\`
```

### 3. `scripts/setup-dev-env.sh`
```bash
#!/bin/bash
echo "🔧 Setting up MemoriA development environment..."

# Backend
cd backend
mvn clean install
cd ..

# Frontend
cd frontend
npm install
cd ..

echo "✅ Setup complete! Run:"
echo "  Backend:  cd backend && mvn spring-boot:run"
echo "  Frontend: cd frontend && ng serve"
```

---

## 🗂️ ÉTAPES DE MIGRATION

### Phase 1: Préparation
```bash
1. Créer backup: cp -r MemoriA-planning MemoriA-planning-backup
2. Créer nouvelle structure selon schéma ci-dessus
```

### Phase 2: Déplacement fichiers
```bash
1. Déplacer MemoriA-dev/MemorIA_Backend → backend/
2. Déplacer MemoriA-dev/MemorIA_Frontend → frontend/
3. Créer docs/, scripts/, database/migrations/
4. Créer fichiers config (README, .gitignore, etc.)
```

### Phase 3: Nettoyage
```bash
1. Supprimer tous les .txt files
2. Supprimer scripts de débogage
3. Supprimer dossiers dupliqués (Nouveau dossier, src/)
4. Vérifier .gitignore est complet
5. Commit initial: "chore: cleanup and reorganize project structure"
```

### Phase 4: Vérification
```bash
1. Backend: mvn clean test (tous les tests passent)
2. Frontend: npm test (tous les tests passent)
3. Git: git status (rien d'inattendu)
```

---

## 🎯 AMÉLIORATIONS RECOMMANDÉES

| Priorité | Action | Bénéfice |
|----------|--------|----------|
| 🔴 HAUTE | Nettoyer la racine | Clarté, maintenabilité |
| 🔴 HAUTE | Créer README.md | Onboarding nouveau dev |
| 🟠 MÉDIUM | Multi-profiles (test/prod) | Gestion configs |
| 🟠 MÉDIUM | Ajouter logging structuré | Debugging |
| 🟢 BASSE | Docker/docker-compose | Déploiement |
| 🟢 BASSE | CI/CD (GitHub Actions) | Tests automatisés |

