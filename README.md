# 📁 Listeur de Fichiers et Dossiers v2.0.1

## 🚀 **MIGRATION MAJEURE : Stack Moderne React + Vite + Tailwind + Electron**

**Double transformation complète** :
1. **Backend** : Script monolithique → **20 modules spécialisés** (architecture modulaire)
2. **Frontend** : HTML/CSS basique → **React 19 + Vite 7 + Tailwind 4** (stack moderne)

> 📚 **[Documentation complète dans docs/](docs/README.md)**

### 🔥 **Stack Technologique**
- **React 19.1.1** - Interface utilisateur moderne
- **Vite 7.1.2** - Build tool ultra-rapide avec HMR  
- **Tailwind CSS 4.1.11** - Framework CSS utility-first
- **Electron 37.2.6** - Application desktop native
- **Node.js 22+** - Backend modulaire (20 modules)

---

## 🚀 **Installation et Utilisation**

### **Installation**
```bash
npm install
npm test  # Vérifier l'installation (35 tests)
```

### **🎯 Applications disponibles**

#### **1. Interface React Moderne (Recommandé)**
```bash
npm run dev                  # Développement web (http://localhost:3001+)
npm run start:window         # Application desktop Electron + React
npm run build:react          # Build production React
```

#### **2. Interface Backend Originale**
```bash
npm start                    # Version modulaire principale (CLI)
node listeur_de_fichiers_et_dossiers.js  # Exécution directe CLI
```

#### **3. Compilation Autonome**
```bash
npm run build               # Créer l'exécutable Windows
./listeur_de_fichiers_et_dossiers.exe    # Exécuter sans Node.js
```

### **⚡ Développement React (Hot Reload)**
- **HMR activé** : Modifications instantanées
- **Dual mode** : Web (navigateur) + Desktop (Electron)
- **DevTools** intégrés pour débogage
- **Support UTF-8** complet (accents français)

---

## 📊 **Fonctionnalités Principales**

### **🎯 Interface Utilisateur**
- 🚀 **Interface React moderne** avec composants réutilisables
- ⚡ **Hot Module Replacement** pour développement rapide
- 🎨 **Tailwind CSS** avec classes utility-first
- 💻 **Application desktop** native (Electron)
- 🌐 **Mode web** pour développement et test

### **🔍 Moteur de Listage (Backend)**
- 🔍 **Exploration récursive** avec arborescence visuelle
- 📊 **Statistiques détaillées** (compteurs, temps d'exécution)  
- 🔔 **Notifications PowerShell** multiplateformes
- ⚡ **Exclusions intelligentes** (node_modules, .git, etc.)
- 📄 **Rapport structuré** au format arborescent
- 🧪 **Tests complets** (35 tests, 100% de réussite)

---

## 🏗️ **Architecture Hybride (Backend + Frontend)**

### **📱 Frontend React (ui/src/)**
```
📁 ui/
├── 📄 index.html           # Point d'entrée minimal React
├── ⚡ main.js             # Processus principal Electron + Vite
└── 📁 src/
    ├── 🚀 App.jsx         # Composant principal React
    ├── 🎯 index.jsx       # Bootstrap React (createRoot)
    └── 🎨 tailwind.css    # Imports Tailwind CSS
```

### **🔧 Backend Modulaire (src/)**
```
📁 src/
├── 🔍 core/exploration/     # Exploration récursive (3 modules)
├── 📝 core/formatting/      # Formatage et arborescence (3 modules) 
├── 📊 core/statistics/      # Performances et compteurs (3 modules)
├── 📄 core/output/          # Génération de rapports (3 modules)
├── 🔀 core/workflow/        # Orchestration workflow (1 module)
├── 🔧 infrastructure/       # Notifications, filesystem (2 modules)
├── ⚙️ config/              # Configuration (2 modules)
└── 🛠️ utils/               # Validation, erreurs (2 modules)
```

### **⚙️ Configuration Build**
- `vite.config.js` - Configuration Vite + React
- `postcss.config.js` - PostCSS + Tailwind + Autoprefixer
- `package.json` - Scripts dual (React + CLI)

**Fichier principal CLI** : `listeur_de_fichiers_et_dossiers.js` (189 lignes, -49.7%)

---

## 🆕 **Nouveautés v2.0.1**

### **🚀 Migration Frontend Complète**
- **React 19.1.1** : Interface moderne avec composants fonctionnels
- **Vite 7.1.2** : Build ultra-rapide avec HMR instantané
- **Tailwind CSS 4.1.11** : Styling utility-first avec PostCSS
- **Electron 37.2.6** : App desktop native avec auto-port detection
- **Architecture hybride** : Web + Desktop en dual deployment

### **🏗️ Backend Modulaire Avancé**
- **ReportSectionBuilder** : Construction spécialisée des sections de rapport
- **WorkflowOrchestrator** : Orchestration fine des étapes de workflow
- **Tests étendus** : 35 tests couvrent tous les modules
- **Réduction** : 376 → 189 lignes dans le fichier principal

### **⚡ Développement Moderne**
- **Hot Module Replacement** : Changements instantanés
- **DevTools intégrés** : Débogage avancé
- **Dual mode** : `npm run dev` (web) + `npm run start:window` (desktop)
- **Auto-restart** : Gestion intelligente des processus Vite

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
