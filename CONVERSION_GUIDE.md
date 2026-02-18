# Memoria - Angular Conversion Guide

## Project Conversion Summary

Ce projet a été converti de **React + Vite** vers **Angular 18** avec les technologies suivantes:

### ✅ Conversion Effectuée

#### Dépendances Remplacées
- **React Router** → **Angular Router**
- **Radix UI** → **Angular Material**
- **React Hooks** → **Angular Signals & RxJS**
- **React Context** → **Angular Services & Dependency Injection**
- **Vite** → **Angular CLI**

#### Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # En-tête avec recherche et profil
│   │   ├── sidebar/         # Navigation latérale avec menus
│   │   └── layout/          # Composant parent pour layout
│   ├── pages/               # Pages de l'application (27 pages)
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── tests-cognitifs/
│   │   ├── analyses/
│   │   ├── alertes/
│   │   ├── planning/
│   │   ├── diagnosis/
│   │   ├── treatment/
│   │   ├── communaute/
│   │   ├── activites/
│   │   └── ...
│   ├── app.component.*      # Composant racine
│   └── app.routes.ts        # Configuration du routage
├── styles/
│   └── globals.css          # Design System Memoria
├── main.ts                  # Point d'entrée Angular
└── index.html               # HTML racine

Configuration:
├── angular.json             # Configuration Angular CLI
├── tsconfig.json            # Configuration TypeScript
├── tsconfig.app.json        # Configuration TypeScript App
└── package.json             # Dépendances
```

### 🚀 Installation et Démarrage

#### 1. Installer les dépendances
```bash
npm install
```

#### 2. Démarrer le serveur de développement
```bash
npm run dev
```
ou
```bash
ng serve
```

Le serveur démarrera sur `http://localhost:4200`

#### 3. Builder pour la production
```bash
npm run build
```
ou
```bash
ng build --configuration production
```

### 📋 Routes Disponibles

L'application contient 27 pages/routes:

**Navigation Principale:**
- `/` - Dashboard
- `/patients` - Gestion des patients
- `/tests-cognitifs` - Tests cognitifs
  - `/tests-cognitifs/memoire` - Tests mémoire
  - `/tests-cognitifs/langage` - Tests langage
  - `/tests-cognitifs/orientation` - Tests orientation
- `/analyses` - Analyses
- `/alertes` - Gestion des alertes
  - `/alertes/create` - Créer une alerte
  - `/alertes/reports` - Rapports
- `/planning` - Planning
  - `/planning/calendar` - Calendrier
  - `/planning/scheduling` - Planification
  - `/planning/tasks` - Tâches
  - `/planning/availability` - Disponibilités
- `/diagnosis` - Diagnostic
  - `/diagnosis/:id/execute` - Exécuter test
  - `/diagnosis/:id/results` - Résultats
- `/treatment` - Traitement
  - `/treatment/zones/create` - Créer zone
  - `/treatment/tracking` - Tracking GPS
- `/communaute` - Communauté
  - `/communaute/:id` - Feed communauté
  - `/communaute/analytics` - Analytics
- `/activites` - Activités
- `/parametres` - Paramètres

### 🎨 Design System

Le projet utilise le **Design System Memoria** défini dans `src/styles/globals.css`:

**Couleurs Principales:**
- Primaire: `#541A75` (Violet méédical)
- Secondaire: `#7E7F9A`
- Accent: `#CB1527` (Rouge)
- Success: `#00635D` (Vert)
- Warning: `#E6A800` (Jaune)
- Info: `#2A6EBB` (Bleu)

**Typographie:**
- Montserrat (700) - Titres
- Open Sans (400, 600) - Corps et UI
- Roboto Mono - Code

### 🛠️ Composants Utilisés

#### Angular Material
- Buttons, Icons, Forms, Input, Badge, Menu, etc.

#### Composants Personnalisés
- `HeaderComponent` - Barre d'en-tête
- `SidebarComponent` - Navigation latérale
- `LayoutComponent` - Composant parent

### 📱 Responsive Design

L'application est entièrement responsive avec breakpoints:
- Desktop: > 1024px (Sidebar fixe)
- Tablet: 768px - 1024px (Sidebar masqué, toggle button)
- Mobile: < 768px (Sidebar mobile avec overlay)

### ⚙️ Configuration Angular

**Angular Version:** 18.0.0
**TypeScript:** 5.5.0
**Platform:** @angular/platform-browser
**Router:** @angular/router
**Material:** @angular/material 18.0.0

### 📦 Scripts Disponibles

```bash
npm run ng                  # Exécuter Angular CLI
npm run dev                 # Démarrer le serveur de développement
npm run build              # Builder l'application
npm run watch              # Mode watch pour developpement
npm run test               # Exécuter les tests
```

### 🔄 Migration des Pages

Toutes les pages React ont été converties en Angular Components. Les pages sont actuellement des stubs avec un titre. Pour développer chaque page:

1. Accédez au fichier dans `src/app/pages/<page-name>/`
2. Convertissez le JSX en Angular template
3. Convertissez les React hooks en Angular services/signals
4. Mettez à jour les imports et dépendances

Exemple de conversion:
```typescript
// React
import { useState } from 'react';
export function MyPage() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// Angular
import { Component, signal } from '@angular/core';
@Component({...})
export class MyPageComponent {
  count = signal(0);
}
```

### 📚 Ressources Utiles

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Angular Router](https://angular.io/guide/routing-overview)
- [Angular Signals](https://angular.io/guide/signals)

### ✅ Prochaines Étapes

1. ✅ Configuration de base - Complétée
2. ✅ Layout and Navigation - Complétée  
3. ⏳ Développement des pages détaillées
4. ⏳ Intégration API/Services
5. ⏳ Tests unitaires
6. ⏳ Tests E2E

### 📝 Notes Importantes

- Assurez-vous d'avoir Node.js 18+ installé
- Utilisez `npm install` pour les dépendances fraîches
- Les fichiers React originaux sont conservés pour référence
- Le design system doit être respecté dans tous les nouveaux composants

---

Pour toute question ou problème, consultez la documentation Angular officielle.
