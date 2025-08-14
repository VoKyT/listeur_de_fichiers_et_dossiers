# 💻 Guide d'Utilisation Hybride - React + CLI

## 🚀 **Installation Complète**

### **Prérequis Système**
- **Node.js 22.0.0+** (LTS recommandé)
- **Windows 10/11** (pour les notifications popup + Electron)
- **PowerShell** (pour les notifications natives)
- **Navigateur moderne** (pour le développement React web)

### **Installation des dépendances**
```bash
# Cloner ou télécharger le projet
git clone https://github.com/VoKyT/listeur_de_fichiers_et_dossiers.git
cd listeur_de_fichiers_et_dossiers

# Installer les dépendances (React + Backend)
npm install

# Vérifier l'installation
npm test
```

---

## 🎯 **Utilisation - Dual Mode**

### **� Interface React Moderne (Recommandé)**

#### **Développement Web (Hot Reload)**
```bash
npm run dev                  # Interface web React sur http://localhost:3001+
                            # HMR activé, DevTools disponibles
```

#### **Application Desktop**
```bash
npm run start:window        # Application Electron native
                            # Auto-détection port Vite, gestion processus
```

#### **Build Production React**
```bash
npm run build:react         # Build optimisé pour déploiement web
npm run preview             # Prévisualiser le build (optionnel)
```

---

### **💻 Interface CLI Backend (Original)**

#### **Scripts npm disponibles**
```bash
# Exécution CLI
npm start                    # Version modulaire principale (20 modules)
npm run start:legacy         # Version legacy (script original)
npm run start:simple         # Version simple non-modulaire

# Compilation standalone
npm run build               # Créer l'exécutable principal (.exe)
npm run build:legacy        # Créer l'exécutable legacy
npm run build:simple        # Créer l'exécutable simple

# Tests backend
npm test                    # Exécuter tous les tests (35 tests)
```

#### **Exécution directe**
```bash
# Sans npm (CLI backend)
node listeur_de_fichiers_et_dossiers.js

# Avec l'exécutable (après npm run build)
./listeur_de_fichiers_et_dossiers.exe
```

---

## ⚡ **Développement React**

### **Hot Module Replacement (HMR)**
- **Changements instantanés** : Modification de `ui/src/App.jsx` → Reload automatique
- **État préservé** : Les composants React conservent leur état local
- **DevTools React** : Extension navigateur pour inspection des composants

### **Structure de développement**
```bash
# Terminal 1 : Vite dev server
npm run dev

# Terminal 2 : Application Electron (optionnel)
npm run start:window

# Fichiers à modifier :
# - ui/src/App.jsx        → Composant principal
# - ui/src/tailwind.css   → Styles Tailwind
# - vite.config.js        → Configuration build
```

## 📋 **Format de Sortie Détaillé**

### **Structure du fichier généré**
```
==================================================
LISTE RÉCURSIVE DES FICHIERS ET DOSSIERS - FORMAT ARBORESCENT
==================================================
Date de génération: 23/07/2025 14:38:58
Version: 2.0.1

==================================================
            Configuration de l'analyse            
==================================================
DOSSIER RACINE ANALYSÉ: C:\Users\...\mon_projet
DATE DE GÉNÉRATION: 23/07/2025 14:38:58
STATISTIQUES: 76 éléments (18 dossiers, 58 fichiers)
TEMPS D'EXPLORATION: 4ms
MODE: Exploration récursive avec structure arborescente

⚠️  EXCLUSIONS APPLIQUÉES:
   • node_modules/ (dépendances npm)
   • Dossiers cachés (.*)
   • Fichiers système ($RECYCLE.BIN)

==================================================
               STRUCTURE ARBORESCENTE               
==================================================
📁 mon_projet/ (3 dossiers - 5 fichiers)
├── 1. src/ (2 dossiers - 3 fichiers)
│   ├── 1. components/ (1 fichier)
│   │   └── 1. Button.js
│   ├── 2. utils/ (2 fichiers)
│   │   ├── 1. helpers.js
│   │   └── 2. formatters.js
│   ├── 1. index.js
│   ├── 2. App.js
│   └── 3. config.js
├── 2. tests/ (1 fichier)
│   └── 1. App.test.js
├── 3. docs/ (1 fichier)
│   └── 1. README.md
├── 1. package.json
├── 2. .gitignore
├── 3. LICENSE
├── 4. webpack.config.js
└── 5. babel.config.js

==================================================
        RÉSUMÉ DE L'EXPLORATION RÉCURSIVE        
==================================================
TOTAL GÉNÉRAL: 76 éléments trouvés
DÉTAIL: 18 dossiers, 58 fichiers
TEMPS D'EXPLORATION: 4ms
```

## 🔔 **Système de Notifications**

### **Popups PowerShell (Windows)**
Le script affiche **2 popups PowerShell** :

1. **Popup de début** : 
   - Information sur le fonctionnement récursif
   - Nom du fichier de sortie
   - Avertissement sur l'analyse complète

2. **Popup de fin** : 
   - Résultats avec statistiques complètes
   - Temps d'exécution total
   - Note sur les exclusions (node_modules, etc.)

### **Méthode technique**
- **Méthode primaire** : `System.Windows.Forms.MessageBox` via PowerShell
- **Fallback automatique** : Console si PowerShell échoue
- **Compatibilité** : Windows 10/11 avec PowerShell

## ⏱️ **Métriques de Performance**

### **Chronométrage Automatique**
Le script mesure automatiquement :
- **Temps d'exploration** : Durée de parcours récursif
- **Temps de génération** : Durée d'écriture du fichier
- **Temps total** : Durée complète d'exécution

### **Affichage des performances**
- **Console** : Logs en temps réel avec formatage (ms/s/min)
- **Fichier de sortie** : En-tête et pied avec temps d'exploration
- **Popup final** : Temps total dans le message de confirmation

### **Exemples de performances typiques**
```
⏱️ Temps d'exploration: 1.43s (projet moyen)
💾 Fichier généré en 23ms
⏱️ TEMPS TOTAL: 1.46s

📊 Résultats: 18 dossiers, 58 fichiers trouvés
```

## ⚙️ **Configuration et Exclusions**

### **Exclusions par défaut**
- **`node_modules/`** : Dépendances npm (peut contenir des milliers de fichiers)
- **Dossiers cachés** : `.git`, `.vscode`, `.idea`, etc.
- **Fichiers système** : `$RECYCLE.BIN`, `Thumbs.db`, `.DS_Store`
- **Fichiers temporaires** : `*.tmp`, `*.temp`, `*.log`
- **Script et exécutable** : Le script lui-même et son exécutable

### **Personnalisation**
Les exclusions sont configurables dans le module `ExclusionFilter` :
```javascript
// Dans src/core/exploration/exclusion-filter.js
exclusionFilter.addExcludedDirectory('mon_dossier_prive');
exclusionFilter.addExcludedFile('fichier_secret.txt');
```

## 🛠️ **Développement et Personnalisation**

### **Structure du projet**
```
listeur_de_fichiers_et_dossiers/
├── 📄 listeur_de_fichiers_et_dossiers.js  # Point d'entrée principal
├── 📦 package.json                        # Configuration npm et scripts
├── 📋 README.md                           # Documentation principale
├── 📝 CHANGELOG.md                        # Historique des versions
├── 🧪 test/                               # Tests automatisés
├── 📚 docs/                               # Documentation détaillée
├── 📁 src/                                # Code source modulaire (20 modules)
└── 🗂️ archives_anciennes_versions/        # Versions précédentes
```

### **Modification des fonctionnalités**
1. **Identifier le module** responsable de la fonctionnalité
2. **Modifier uniquement** ce module (principe de responsabilité unique)
3. **Tester le module** isolément
4. **Valider l'intégration** avec `npm test`
5. **Tester l'application** complète avec `npm start`

## 📦 **Compilation et Distribution**

### **Création de l'exécutable**
```bash
# Compilation avec yao-pkg
npm run build

# L'exécutable créé peut être distribué sans Node.js
# Compatible Windows 10/11
```

### **Avantages de l'exécutable**
- ✅ **Autonome** : Pas besoin d'installer Node.js
- ✅ **Rapide** : Démarrage instantané
- ✅ **Portable** : Un seul fichier à distribuer
- ✅ **Professionnel** : Interface utilisateur avec popups

## 🔧 **Compatibilité et Prérequis**

### **Systèmes supportés**
- ✅ **Windows 10/11** (recommandé pour les popups)
- ✅ **Windows 8.1** (avec PowerShell 5.0+)
- ⚠️ **Linux/macOS** (fonctionne mais sans popups PowerShell)

### **Versions Node.js**
- ✅ **Node.js 22.0.0+** (recommandé)
- ✅ **Node.js 20.x** (testé et compatible)
- ⚠️ **Node.js 18.x** (compatible mais non testé)

### **Environnements de développement**
- ✅ **VS Code** (configuration optimisée incluse)
- ✅ **WebStorm/IntelliJ** (support JavaScript complet)
- ✅ **Command Prompt / PowerShell** (exécution directe)
- ✅ **Git Bash** (compatible mais sans popups)
