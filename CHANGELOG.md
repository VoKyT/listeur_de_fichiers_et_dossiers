# 📝 Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2025-08-16 - 🚀 FINALISATION ARCHITECTURE HYBRIDE : Services Unifiés + DevTools

### 🎯 **FINALISATION DE L'ARCHITECTURE TRIPLE-LAYER**
- **Frontend React** : Interface utilisateur complète avec 8 composants modulaires
- **Services Hybrides** : Couche d'abstraction Web/Electron avec APIs unifiées  
- **Backend Modulaire** : 20 modules spécialisés + 2 services Electron (IPC + preload)
- **DevTools Complets** : F12 débloqué, debug avancé, menu développement intégré

### 🌐 **SERVICES HYBRIDES WEB/ELECTRON - NOUVEAU**
- **`fileSystemService.js`** : API unifiée avec détection d'environnement automatique
- **`webBackendService.js`** : Implémentation File System Access API (navigateurs modernes)
- **`electronBackendService.js`** : Communication IPC sécurisée avec processus principal
- **`useFileSystem.js`** : Custom hook React avec état global et actions unifiées

### 📱 **COMPOSANTS REACT COMPLETS - NOUVEAU**
- **8 composants modulaires** : Header, Controls, AdvancedActions, FileList, etc.
- **Responsive design** : Tailwind CSS avec utility classes
- **État unifié** : Hook personnalisé avec capabilities et error handling
- **Actions avancées** : Génération rapport complet + sauvegarde flexible

### 🔧 **ELECTRON BACKEND UNIFIÉ - NOUVEAU**  
- **`backend-service.js`** : Handlers IPC complets avec logique unifiée Web/Electron
- **`preload.js`** : APIs sécurisées exposées via contextBridge
- **DevTools F12** : Raccourcis clavier + menu développement + gestionnaires événements
- **Process management** : Auto-détection port Vite, cleanup automatique, encodage UTF-8

### ✨ **Stack Frontend Moderne - COMPLÉTÉ**
- **React 19.1.1** : Framework UI moderne (hooks, composants fonctionnels, JSX)
- **Vite 7.1.2** : Build tool ultra-rapide (HMR instantané, ESM, port fixe 3001)
- **Tailwind CSS 4.1.11** : Framework CSS utility-first (PostCSS integration complète)
- **Electron 37.2.6** : Application desktop native (DevTools, menu, raccourcis clavier)

### 📊 **RAPPORTS PROFESSIONNELS UNIFIÉS - NOUVEAU**
- **Format unifié** : Même syntaxe exacte sur Web et Electron (2151 caractères)
- **En-têtes stylisés** : Bannières ASCII professionnelles avec métadonnées  
- **Statistiques complètes** : Compteurs, temps d'exécution, exclusions appliquées
- **Arborescence visuelle** : Structure Map avec connecteurs └── ├── et numérotation adaptative
- **Sauvegarde intelligente** : Sélection emplacement + nom généré automatiquement

### 🏗️ **Architecture Finale - Triple Layer**
#### **📱 Frontend React (ui/src/) - 20+ fichiers ajoutés**:
```
📁 ui/src/
├── components/           # 8 composants modulaires
│   ├── Header.jsx       
│   ├── Controls.jsx     
│   ├── AdvancedActions.jsx     # 🆕 Rapport complet + sauvegarde
│   ├── FileList.jsx     
│   ├── ErrorDisplay.jsx 
│   ├── FolderInfo.jsx   
│   ├── FileItem.jsx     
│   └── index.js         # Export centralisé
├── hooks/               
│   └── useFileSystem.js        # 🆕 Custom hook avec état global
├── services/            # 🆕 Couche d'abstraction
│   ├── fileSystemService.js    # API unifiée Web/Electron  
│   ├── webBackendService.js    # File System Access API
│   └── electronBackendService.js # IPC Communication
├── utils/               
│   └── styles.js               # 🆕 Constants Tailwind
├── App.jsx                     # Composant principal
├── index.jsx                   # Bootstrap React
└── tailwind.css                # Imports Tailwind
```

#### **🔧 Backend Electron (src/electron/) - 2 fichiers ajoutés**:
- `backend-service.js` → 🆕 IPC handlers avec logique business unifiée
- `preload.js` → 🆕 APIs sécurisées contextBridge

### 🔧 **Nouvelles Fonctionnalités Avancées**
- **DevTools F12** : Raccourcis clavier F12 + Ctrl+Shift+I + menu développement
- **Services hybrides** : Détection automatique Web/Electron avec APIs unifiées
- **File System Access API** : Accès natif fichiers navigateurs modernes (Chrome/Edge)
- **IPC Communication** : Communication sécurisée React ↔ Electron via contextBridge
- **Rapports unifiés** : Même logique d'exploration recursive sur Web et Desktop
- **Hot Module Replacement** : Modifications React instantanées avec préservation d'état
- **Dual deployment** : `npm run dev` (web) + `npm run start:window` (desktop)
- **Auto-port detection** : Gestion intelligente 3001→3002→3003 avec sync Vite/Electron
- **Process management** : Auto-cleanup, détection processus, restart intelligent
- **Error handling** : Gestion d'erreurs centralisée avec recovery automatique

### 📊 **Scripts Hybrides Complets**
```json
{
  "dev": "vite",                           // Développement React web (HMR)
  "start:window": "electron ui/main.js",   // Desktop app avec auto-détection Vite
  "build:react": "vite build",             // Build production React optimisé
  "preview": "vite preview",               // Prévisualisation build local
  "start": "node listeur_de_fichiers_et_dossiers.js",  // CLI original maintenu
  "build": "npx @yao-pkg/pkg...",          // Compilation .exe Windows
  "test": "node test/test-modules.js"      // Suite tests (35 tests)
}
```

### 🎯 **Fonctionnalités Cross-Platform Unifiées**
- **Web** : File System Access API (Chrome/Edge) + sauvegarde showSaveFilePicker
- **Desktop** : APIs natives Electron + IPC sécurisé + DevTools intégrés  
- **CLI** : Backend modulaire traditionnel + compilation autonome
- **Rapports** : Format identique sur toutes les plateformes (syntaxe unifiée)

### 📈 **Métriques Finales Architecture Hybride**
- **Fichiers ajoutés** : +25 nouveaux fichiers (React + Services + Electron)
- **Architecture totale** : Frontend React (8 composants) + Services (3 couches) + Backend (20 modules)
- **Performance** : HMR instantané + build 10x plus rapide + exploration ~4ms
- **Compatibilité** : 100% rétrocompatible CLI + nouvelles fonctionnalités Web/Desktop
- **Tests** : 35 tests unitaires (100% succès) + validation installation automatique
- **Taille rapport** : 2151 caractères format professionnel avec arborescence complète

---

## [2.0.1] - 2025-07-23 - Modularisation Avancée

### ✨ Nouveautés
- **ReportSectionBuilder** : Nouveau module spécialisé pour la construction des sections de rapport
- **WorkflowOrchestrator** : Nouveau module dédié à l'orchestration fine des étapes de workflow
- Architecture passée de 18 à **20 modules spécialisés**

### 🔧 Améliorations
- **Réduction drastique** du fichier principal : 376 lignes → 189 lignes (-49.7%)
- **Séparation des responsabilités** plus fine entre construction de rapports et orchestration
- **Maintenabilité** accrue avec des modules plus spécialisés
- **Tests complets** : 32 tests couvrent tous les modules (100% de réussite)

### 📊 Métriques
- **Taille du fichier principal** : 189 lignes (vs 376 lignes précédemment)
- **Nombre de modules** : 20 (vs 18 précédemment)
- **Couverture de tests** : 100% (32/32 tests passent)
- **Performance** : Identique (~4.5s d'exécution totale)

## [2.0.0] - 2025-07-23 - Architecture Modulaire Complète

### ✨ Transformation Majeure
- **Décomposition complète** : Script monolithique (376 lignes) → 18 modules spécialisés
- **Architecture modulaire** suivant le principe de responsabilité unique
- **Compatibilité totale** avec les fonctionnalités du script original

### 🏗️ Modules Créés
- **Core Business Logic** (9 modules) : exploration, formatting, statistics, output
- **Infrastructure** (2 modules) : notifications, filesystem
- **Configuration** (2 modules) : config par défaut et dynamique
- **Utilitaires** (2 modules) : validation, gestion d'erreurs

## [3.1.2] - 2025-07-22

### 🎯 Amélioré
- **Syntaxe unifiée** : Harmonisation complète de tous les formats de sortie dans le fichier txt
- **Cohérence des titres** : Tous les labels en MAJUSCULES avec deux-points (ex: `DATE DE GÉNÉRATION:`)
- **Sections exclusions** : Format uniforme avec listes à puces dans l'en-tête ET la conclusion
- **Séparateurs standardisés** : Utilisation cohérente des `=` (80 caractères) partout
- **Présentation professionnelle** : Syntaxe identique dans toutes les sections pour une meilleure lisibilité

### 🔧 Optimisé
- **Code simplifié** : Réduction significative des redondances dans le code source
- **Performance améliorée** : Structures de données optimisées (Set vs Array)
- **Maintenabilité** : Fonctions consolidées et logique unifiée

## [3.1.1] - 2025-07-22

### ✨ Ajouté
- **Compteur répertoire racine** : Affichage du nombre de dossiers/fichiers directs dans le répertoire principal
- **En-tête arborescence** : `📁 nom_dossier/ (X dossiers - Y fichiers)` pour la racine

### 🔄 Modifié
- **Format de sortie** : Le répertoire racine affiche maintenant ses statistiques comme les sous-dossiers
- **Cohérence visuelle** : Tous les dossiers ont maintenant leur compteur d'éléments

## [3.1.0] - 2025-07-22

### ✨ Ajouté
- **Popups PowerShell fiables** : Remplacement de `msg.exe` par `System.Windows.Forms.MessageBox`
- **Gestion d'erreurs avancée** : Logs détaillés pour le debugging des popups
- **Nettoyage automatique** : Suppression des dossiers et fichiers obsolètes
- **Échappement robuste** : Caractères spéciaux et sauts de ligne dans les popups

### 🔧 Corrigé
- **Popups manquants** : Les deux popups s'affichent maintenant correctement
- **Caractères spéciaux** : Gestion des émojis et accents dans les messages
- **Timeout PowerShell** : Limitation à 10s pour éviter les blocages
- **Fallback intelligent** : `execSync` puis `spawn` en cas d'échec

### 🔄 Modifié
- **Méthode popup** : Migration de `msg.exe` vers PowerShell natif
- **Messages debug** : Ajout de logs pour tracer l'exécution des popups
- **Structure projet** : Nettoyage des dossiers de test et fichiers obsolètes

## [3.0.0] - 2025-07-22

### ✨ Ajouté
- **Exploration récursive complète** de tous les sous-dossiers
- **Format arborescent Unix** avec caractères `├──` et `└──`
- **Compteurs détaillés** : séparation dossiers/fichiers par niveau
- **Numérotation adaptative** avec zéros de remplissage automatique
- **Notifications popup Windows** non-bloquantes avec `spawn()`
- **Configuration IntelliSense** JavaScript complète
- **Support yao-pkg** pour exécutable autonome
- **Fichiers Git** : `.gitignore`, `.gitattributes`, documentation

### 🔄 Modifié
- **Migration vers yao-pkg** (remplacement de pkg obsolète)
- **API `toSorted()`** pour tri immutable moderne
- **Gestion d'erreurs robuste** pour fichiers inaccessibles
- **Exclusions intelligentes** : node_modules, dossiers cachés

### 🏗️ Technique
- **Node.js 22.0.0+** requis
- **Modules natifs uniquement** (fs, path, child_process)
- **Compatible process.pkg** pour détection d'environnement
- **Structure de code modulaire** et commentée

## [2.0.0] - Versions antérieures

### 📁 Archivé
- `listeur_de_fichiers.js` - Version simple sans récursion
- `listeur_de_fichiers.py` - Version Python
- `lanceur*.js` - Anciens scripts de lancement
- `*.bat` - Scripts batch Windows

### 🔄 Évolution
- **v1.x** : Scripts batch Windows basiques
- **v2.x** : Portage Node.js avec exploration simple
- **v3.x** : Refonte complète récursive avec arborescence

---

## 🎯 Prochaines versions

### [3.1.0] - Planifié
- [ ] **Barre de progression** pour gros volumes
- [ ] **Mode rapide** sans compteurs détaillés
- [ ] **Filtres personnalisés** par extension
- [ ] **Export JSON/CSV** en option

### [3.2.0] - Idées
- [ ] **Interface graphique** Electron optionnelle
- [ ] **Configuration externe** via fichier JSON
- [ ] **Support Linux/macOS** natif
- [ ] **API REST** pour intégration

---
📅 **Format des dates** : AAAA-MM-JJ
