# 📁 Listeur de Fichiers et Dossiers v2.0.1

## 🎯 **Architecture Modulaire Avancée**

**Transformation complète** d'un script monolithique de 376 lignes en **20 modules spécialisés** suivant le principe de responsabilité unique.

> 📚 **[Documentation complète dans docs/](docs/README.md)**

---

## 🚀 **Installation et Utilisation**

### **Installation**
```bash
npm install
npm test  # Vérifier l'installation (35 tests)
```

### **Exécution**
```bash
npm start                    # Version modulaire principale
node listeur_de_fichiers_et_dossiers.js  # Exécution directe
```

### **UI (Electron) + Tailwind CSS v4**
```bash
npm run build-css            # Build CSS en watch (v4)
npm run build-css:prod       # Build CSS minifié (v4)
npm run start:window         # Lancer la fenêtre Electron
```

### **Compilation en Exécutable**
```bash
npm run build               # Créer l'exécutable Windows
./listeur_de_fichiers_et_dossiers.exe    # Exécuter sans Node.js
```

---

## 📊 **Fonctionnalités Principales**

- 🔍 **Exploration récursive** avec arborescence visuelle
- 📊 **Statistiques détaillées** (compteurs, temps d'exécution)  
- 🔔 **Notifications PowerShell** multiplateformes
- ⚡ **Exclusions intelligentes** (node_modules, .git, etc.)
- 📄 **Rapport structuré** au format arborescent
- 🧪 **Tests complets** (35 tests, 100% de réussite)

---

## 🏗️ **Architecture (20 modules)**

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

**Fichier principal** : `listeur_de_fichiers_et_dossiers.js` (189 lignes, -49.7%)

---

## 🆕 **Nouveautés v2.0.1**

- **ReportSectionBuilder** : Construction spécialisée des sections de rapport
- **WorkflowOrchestrator** : Orchestration fine des étapes de workflow
- **Tests étendus** : 35 tests couvrent tous les modules
- **Réduction** : 376 → 189 lignes dans le fichier principal

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

- ✅ **Windows 10/11** (popups PowerShell natifs)
- ✅ **Node.js 22.0.0+** 
- ✅ **Compilation yao-pkg** (exécutable autonome)
- ✅ **Versions antérieures** (compatibilité totale)

---

**Version**: 2.0.1 | **Architecture**: Modulaire (20 modules) | **Tests**: 35/35 ✅
