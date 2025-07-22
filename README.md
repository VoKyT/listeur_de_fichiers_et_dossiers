# 📁 Listeur de Fichiers et Dossiers

## 🎯 Description
Script Node.js pour explorer récursivement tous les fichiers et dossiers d'un répertoire et générer une liste structurée au format arborescent avec compteurs intelligents.

## ✨ Fonctionnalités
- ✅ **Exploration récursive** complète de tous les sous-dossiers
- ✅ **Format arborescent Unix** avec caractères `├──` et `└──`
- ✅ **Compteurs intelligents** : dossiers et fichiers séparés par niveau
- ✅ **Numérotation adaptative** avec zéros de remplissage automatique
- ✅ **Exclusions automatiques** : `node_modules/`, dossiers cachés, fichiers système
- ✅ **Notifications Windows** avec popups non-bloquantes
- ✅ **Compatible yao-pkg** pour création d'exécutable autonome

## 🚀 Installation

### Prérequis
- Node.js 22.0.0+ (LTS recommandé)
- Windows (pour les notifications popup)

### Installation des dépendances
```bash
npm install
```

## 💻 Utilisation

### Exécution du script
```bash
npm start
# ou
node listeur_de_fichiers_et_dossiers.js
```

### Création de l'exécutable
```bash
npm run build
```

L'exécutable `listeur_de_fichiers_et_dossiers.exe` sera créé et pourra être utilisé sans Node.js.

## 📊 Exemple de sortie
```
STRUCTURE ARBORESCENTE:
--------------------------------------------------
├── 1. src/ (2 dossiers - 3 fichiers)
│   ├── 1. components/ (1 fichier)
│   │   └── 1. Button.js
│   ├── 2. utils/ (2 fichiers)
│   │   ├── 1. helpers.js
│   │   └── 2. constants.js
│   ├── 01. index.js
│   ├── 02. app.js
│   └── 03. config.js
```

## 📋 Fichier de sortie
Le script génère automatiquement `liste_de_fichiers_et_dossiers.txt` contenant :
- En-tête avec statistiques complètes
- Structure arborescente avec compteurs détaillés
- Informations d'exclusion et métadonnées

## ⚙️ Configuration

### Exclusions par défaut
- `node_modules/` (dépendances npm)
- Dossiers cachés (`.git`, `.vscode`, etc.)
- `$RECYCLE.BIN` (corbeille Windows)
- Fichiers système et temporaires

## 🛠️ Développement

### Scripts disponibles
- `npm start` : Exécuter le script
- `npm run build` : Créer l'exécutable avec yao-pkg

### Structure du projet
```
├── listeur_de_fichiers_et_dossiers.js  # Script principal
├── package.json                        # Configuration npm
├── jsconfig.json                       # Configuration JavaScript/VS Code
├── .gitignore                          # Exclusions Git
└── archives_anciennes_versions/        # Anciennes versions
```

## 📦 Technologies
- **Node.js** : Runtime JavaScript
- **APIs natives** : `fs`, `path`, `child_process`
- **yao-pkg** : Compilation en exécutable Windows
- **Unicode** : Caractères arborescents Unix standard

## 🔧 Compatibilité
- ✅ Windows 10/11
- ✅ Node.js 22.0.0+
- ✅ PowerShell / Command Prompt
- ✅ VS Code avec IntelliSense

## 📄 Licence
MIT License - Libre d'utilisation et modification

## 👨‍💻 Auteur
**VoKyT** - Projet personnel

---
⭐ N'hésitez pas à star ce projet si il vous est utile !
