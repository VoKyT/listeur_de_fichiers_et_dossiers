# 📝 Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
