# 📝 Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2025-08-14 - 🚀 MIGRATION MAJEURE : React + Vite + Tailwind + Electron

### 🎯 **TRANSFORMATION ARCHITECTURALE COMPLÈTE**
- **Frontend** : Migration complète HTML/CSS → **React 19 + Vite 7 + Tailwind 4**
- **Backend** : Architecture modulaire maintenue (20 modules spécialisés)
- **Interface** : **Application hybride** → Web development + Desktop native

### ✨ **Stack Frontend Moderne**
- **React 19.1.1** : Framework UI moderne (hooks, composants fonctionnels, JSX)
- **Vite 7.1.2** : Build tool ultra-rapide (HMR instantané, ESM, optimisation)
- **Tailwind CSS 4.1.11** : Framework CSS utility-first (PostCSS integration)
- **Electron 37.2.6** : Application desktop native (auto-port detection, UTF-8)

### 🏗️ **Restructuration Complète**
#### **Fichiers supprimés** (ancien système):
- `tailwind.config.js` → Remplacé par intégration PostCSS
- `ui/styles.css` → CSS généré, remplacé par composants React
- `ui/tailwind.css` → Déplacé vers `ui/src/tailwind.css`

#### **Fichiers ajoutés** (nouveau système):
- `postcss.config.js` → Configuration PostCSS + Tailwind + Autoprefixer
- `vite.config.js` → Configuration Vite avec React plugin
- `ui/src/App.jsx` → Composant principal React
- `ui/src/index.jsx` → Point d'entrée React (createRoot)
- `ui/src/tailwind.css` → Imports Tailwind CSS

### 🔧 **Nouvelles Fonctionnalités Développement**
- **Hot Module Replacement (HMR)** : Modifications instantanées
- **Dual deployment** : `npm run dev` (web) + `npm run start:window` (desktop)
- **Auto-port detection** : Gestion intelligente 3001→3002→3003
- **Process management** : Auto-cleanup, gestion processus Vite
- **DevTools intégrés** : Débogage React avancé
- **Encodage UTF-8** : Support complet français (accents)

### 📊 **Scripts Modernisés**
```json
{
  "dev": "vite",                           // Nouveau : développement React web
  "start:window": "electron ui/main.js",   // Amélioré : Electron + Vite auto
  "build:react": "vite build",             // Nouveau : build production React
  "preview": "vite preview",               // Nouveau : prévisualisation build
  "start": "node listeur_de_fichiers_et_dossiers.js"  // Maintenu : CLI original
}
```

### 📈 **Métriques de Migration**
- **Fichiers modifiés** : 11 files changed, +1777/-435 lines
- **Architecture** : Hybride React + Node.js (20 modules backend)
- **Performance build** : ~10x plus rapide (Vite vs compilation traditionnelle)
- **Temps de développement** : HMR instantané vs reload manuel
- **Compatibilité** : Backend CLI 100% maintenu + nouveau frontend React

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
