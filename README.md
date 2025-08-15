# 📁 Listeur de Fichiers et Dossiers v2.0.1

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple.svg)](https://vitejs.dev/)
[![Electron](https://img.shields.io/badge/Electron-37.2.6-black.svg)](https://electronjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.1.11-teal.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 **ARCHITECTURE HYBRIDE MODERNE : Frontend React + Backend Modulaire**

**Triple transformation complète** :
1. **Backend** : Script monolithique → **20 modules spécialisés** (architecture modulaire)
2. **Frontend** : HTML/CSS basique → **React 19 + Vite 7 + Tailwind 4** (stack moderne)
3. **Services** : **Couche d'abstraction hybride** Web/Electron avec APIs unifiées

> 📚 **[Documentation complète dans docs/](docs/README.md)**

### 🔥 **Stack Technologique Complète**
- **React 19.1.1** - Framework UI moderne avec hooks et composants fonctionnels
- **Vite 7.1.2** - Build tool ultra-rapide avec Hot Module Replacement instantané
- **Tailwind CSS 4.1.11** - Framework CSS utility-first avec PostCSS integration
- **Electron 37.2.6** - Application desktop native avec DevTools intégrés
- **Node.js 22+** - Backend modulaire avec 20 modules spécialisés
- **Services hybrides** - Abstraction Web/Electron avec File System Access API

---

## 🚀 **Installation et Utilisation**

### **Installation**
```bash
npm install
npm test  # Vérifier l'installation (35 tests)
```

### **🎯 Triple Mode d'Utilisation**

#### **1. 🖥️ Application Desktop (Electron + React) - RECOMMANDÉ**
```bash
npm run start:window         # Interface native avec React intégré
# ✨ Fonctionnalités : DevTools F12, rapports professionnels, sauvegarde native
# 🎯 Usage : Production, utilisation quotidienne
```

#### **2. 🌐 Application Web (React + Vite)**
```bash
npm run dev                  # Développement web (http://localhost:3001+)
# ✨ Fonctionnalités : HMR, File System Access API, développement rapide
# 🎯 Usage : Développement, test de fonctionnalités
```

#### **3. ⚡ CLI Tool (Node.js modulaire)**
```bash
npm start                    # Version ligne de commande
node listeur_de_fichiers_et_dossiers.js [dossier]  # Exécution directe
# ✨ Fonctionnalités : Scripts automatisés, intégration CI/CD
# 🎯 Usage : Automation, développeurs avancés
```

#### **4. 📦 Executable Autonome**
```bash
npm run build               # Compiler l'exécutable Windows
./listeur_de_fichiers_et_dossiers.exe    # Exécuter sans Node.js
# ✨ Fonctionnalités : Portable, sans dépendances
# 🎯 Usage : Déploiement, utilisateurs finaux
```

### **⚡ Développement Moderne**
- **🔥 Hot Module Replacement** : Modifications React instantanées
- **🔧 DevTools intégrés** : F12 pour débogage avancé
- **🌐 Dual deploy** : Web development + Desktop application
- **🎨 Tailwind CSS** : Styling utility-first responsive
- **📱 Architecture hybride** : Services unifiés Web/Electron

---

## 📊 **Fonctionnalités Principales**

### **🎯 Interface Utilisateur**
- 🚀 **Interface React moderne** avec composants réutilisables
- ⚡ **Hot Module Replacement** pour développement rapide
- 🎨 **Tailwind CSS** avec classes utility-first
- 💻 **Application desktop** native (Electron)
- 🌐 **Mode web** pour développement et test

### **🔍 Moteur de Listage Unifié**
- 🔍 **Exploration récursive** avec structure Map et arborescence visuelle
- 📊 **Rapports professionnels** avec en-têtes, statistiques et temps d'exécution
- � **Sauvegarde flexible** avec sélection d'emplacement native/web
- ⚡ **Exclusions intelligentes** automatiques (node_modules, .git, fichiers cachés)
- 🌐 **Services hybrides** Web (File System Access API) + Electron (IPC)
- 🎯 **Architecture unifiée** Backend modulaire → Services → Composants React
- 🧪 **Tests complets** (35 tests, 100% de réussite)

---

## 🏗️ **Architecture Hybride Triple-Layer**

### **📱 Frontend React Moderne (ui/src/)**
```
📁 ui/
├── 📄 index.html                    # Point d'entrée React minimal
├── ⚡ main.js                      # Processus Electron + Vite + DevTools
├── 🛠️ ../vite.config.js            # Configuration Vite + React plugin  
├── 🎨 ../postcss.config.js          # PostCSS + Tailwind CSS 4
└── 📁 src/
    ├── 🚀 App.jsx                  # Composant principal avec hooks
    ├── 🎯 index.jsx                # Bootstrap React (createRoot)
    ├── 🎨 tailwind.css             # Imports Tailwind (@import "tailwindcss")
    ├── 📁 components/              # 8 composants modulaires
    │   ├── Header.jsx              # En-tête avec branding
    │   ├── Controls.jsx            # Sélection dossier + actions
    │   ├── AdvancedActions.jsx     # Rapport complet + sauvegarde
    │   ├── FileList.jsx            # Liste de fichiers avec tri
    │   └── ...                     # ErrorDisplay, FolderInfo, etc.
    ├── 📁 hooks/                   # Custom hooks React
    │   └── useFileSystem.js        # Hook principal avec état global
    ├── 📁 services/                # Couche d'abstraction
    │   ├── fileSystemService.js    # Service principal hybride
    │   ├── webBackendService.js    # Implémentation File System Access API
    │   └── electronBackendService.js # Implémentation IPC Electron
    └── 📁 utils/                   # Utilitaires React
        └── styles.js               # Styles Tailwind constants
```

### **🔧 Backend Modulaire (src/) - 20 Modules Spécialisés**
```
📁 src/
├── 🔍 core/exploration/            # 3 modules - Exploration récursive
│   ├── directory-explorer.js      # Algorithme principal
│   ├── exclusion-filter.js        # Logique d'exclusion
│   └── path-resolver.js           # Manipulation chemins
├── 📝 core/formatting/             # 3 modules - Formatage arborescence  
│   ├── tree-builder.js            # Construction arbres visuels
│   ├── numbering-formatter.js     # Padding numéros adaptatif
│   └── counter-calculator.js      # Calculs statistiques
├── 📊 core/statistics/             # 3 modules - Performance & compteurs
│   ├── performance-tracker.js     # Chronométrage
│   ├── element-counter.js         # Comptage avancé
│   └── progress-tracker.js        # Suivi progression
├── 📄 core/output/                 # 4 modules - Génération rapports
│   ├── report-generator.js        # Rapports structurés
│   ├── report-section-builder.js  # 🆕 Sections spécialisées
│   ├── text-formatter.js          # Formatage texte
│   └── file-writer.js             # Écriture atomique
├── 🔀 core/                        # 1 module - Orchestration
│   └── workflow-orchestrator.js   # 🆕 Coordination workflow
├── 🎯 electron/                    # 2 modules - Electron backend
│   ├── backend-service.js          # IPC handlers unifiés
│   └── preload.js                  # APIs sécurisées
├── 🔧 infrastructure/              # 2 modules - Services bas niveau
│   ├── filesystem-manager.js      # Opérations filesystem
│   └── notification-service.js    # Notifications multiplateforme
├── ⚙️ config/                      # 2 modules - Configuration
│   ├── default-config.js          # Configuration par défaut
│   └── config-manager.js          # Gestionnaire dynamique
└── 🛠️ utils/                       # 2 modules - Utilitaires
    ├── validation-utils.js         # Validation données
    └── error-handler.js            # Gestion erreurs centralisée
```

### **⚙️ Couche Services Hybride - Abstraction Web/Electron**
- **`fileSystemService.js`** - API unifiée avec détection d'environnement  
- **`webBackendService.js`** - File System Access API pour navigateurs modernes
- **`electronBackendService.js`** - IPC communication avec processus principal
- **`useFileSystem.js`** - Custom hook React avec état et actions

### **🛠️ Configuration & Build**
- **`vite.config.js`** - Vite 7 + React plugin + port 3001
- **`postcss.config.js`** - PostCSS + Tailwind CSS 4 + Autoprefixer  
- **`package.json`** - Scripts hybrides React + CLI + Electron
- **`jsconfig.json`** - Configuration IntelliSense

**🎯 Fichier principal CLI** : `listeur_de_fichiers_et_dossiers.js` (189 lignes, -49.7% optimisation)

---

## 🆕 **Nouveautés Majeures v2.0.1**

### **🚀 Migration Frontend Révolutionnaire**
- **React 19.1.1** : Interface moderne avec hooks, composants fonctionnels, état local
- **Vite 7.1.2** : Build ultra-rapide avec Hot Module Replacement instantané  
- **Tailwind CSS 4.1.11** : Framework utility-first avec PostCSS pipeline complet
- **Electron 37.2.6** : Application desktop native avec DevTools F12 débloqués

### **🌐 Services Hybrides Web/Electron**
- **File System Access API** : Accès natif aux fichiers dans navigateurs modernes
- **IPC Communication** : Communication sécurisée entre React et processus Electron
- **API unifiée** : Même interface pour Web et Desktop avec détection automatique
- **Sauvegarde flexible** : Sélection d'emplacement native + formats multiples

### **🔧 Backend Modulaire Optimisé**  
- **+2 nouveaux modules** : `WorkflowOrchestrator` + `ReportSectionBuilder`
- **Architecture affinée** : 20 modules spécialisés vs 18 précédents
- **Performance améliorée** : Fichier principal 189 lignes (-49.7% vs version précédente)
- **Tests robustes** : 35 tests unitaires couvrant tous les modules (100% succès)

### **📊 Rapports Professionnels Avancés**
- **Format unifié** : Même sortie sur Web et Electron avec syntaxe exacte utilisateur
- **En-têtes stylisés** : Bannières professionnelles avec métadonnées complètes  
- **Statistiques détaillées** : Compteurs, temps d'exécution, exclusions appliquées
- **Arborescence visuelle** : Structure Map avec connecteurs et numérotation adaptative

---

## ⚡ **Commandes de Développement**

### **🔥 Développement React (Recommandé)**
```bash
# Interface moderne avec HMR instantané
npm run dev                    # Mode web : http://localhost:3001 (auto-open)
npm run start:window           # Mode desktop : Electron + React + DevTools F12

# Build et déploiement
npm run build:react            # Build production optimisé
npm run preview                # Prévisualiser le build
```

### **⚡ CLI Tool Classique**
```bash
# Utilisation directe
npm start                      # Version modulaire (interface CLI)
node listeur_de_fichiers_et_dossiers.js dossier_test  # Exécution directe

# Compilation autonome
npm run build                  # Créer .exe Windows (pkg compiler)
```

### **🔧 Développement & Debug**
```bash
# Validation
npm test                       # 35 tests modules (validation installation)
npm run test-perf             # Tests de performance

# Maintenance  
npm run clean                  # Nettoyer node_modules + cache
npm run lint                   # Vérification code (ESLint)
```

### **🚀 Workflow Développement React**
1. **`npm run dev`** → Ouvre http://localhost:3001 avec HMR
2. **F12** → DevTools React pour débogage
3. **Ctrl+C** → Arrêter Vite dev server
4. **`npm run start:window`** → Tester version Electron desktop
5. **F12** → DevTools Electron (débloqués) pour logs backend

---

## 📚 **Documentation**

| Document | Description |
|----------|-------------|
| **[Architecture](docs/ARCHITECTURE.md)** | Structure détaillée des 20 modules |
| **[Utilisation](docs/UTILISATION.md)** | Guide complet d'installation et usage |
| **[Changelog](CHANGELOG.md)** | Historique des versions |
| **[Tests](test/test-modules.js)** | Suite de tests (35 tests) |

---

## 🎯 **Compatibilité**

### **🚀 Stack Moderne (Frontend)**
- ✅ **React 19+ + Vite 7+** (ESM, HMR, build optimisé)
- ✅ **Tailwind CSS 4+** (PostCSS, utility-first)
- ✅ **Electron 37+** (processus principal, auto-port detection)
- ✅ **Browsers modernes** (ES2022+, modules ES6)

### **💻 Compatibilité Système (Backend)**
- ✅ **Windows 10/11** (popups PowerShell natifs)
- ✅ **Node.js 22.0.0+** 
- ✅ **Compilation yao-pkg** (exécutable autonome)
- ✅ **Versions antérieures** (compatibilité totale CLI)

---

**Version**: 2.0.1 | **Architecture**: Hybride React+Node.js (20 modules) | **Tests**: 35/35 ✅  
**Stack**: React 19 + Vite 7 + Tailwind 4 + Electron 37 + Node.js 22
