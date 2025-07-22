#!/usr/bin/env node
// listeur_de_fichiers_et_dossiers.js
// Script Node.js pour lister fichiers et dossiers du répertoire courant - Version YAO-PKG

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Fonction pour afficher une pop-up Windows (version non-bloquante pour yao-pkg)
function showPopup(title, message) {
  try {
    console.log(`🔔 Tentative d'affichage popup: ${title}`);
    
    // Nettoie le message pour PowerShell
    const cleanTitle = title.replace(/'/g, "''").replace(/"/g, '""');
    const cleanMessage = message
      .replace(/'/g, "''")
      .replace(/"/g, '""')
      .replace(/\n/g, ' | ')  // Remplace les sauts de ligne par des séparateurs
      .replace(/\r/g, '');    // Supprime les retours chariot
    
    // Version PowerShell synchrone pour s'assurer que le popup s'affiche
    const powershellCmd = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${cleanMessage}', '${cleanTitle}', 'OK', 'Information')`;
    
    try {
      const result = execSync(`powershell.exe -Command "${powershellCmd}"`, { 
        encoding: 'utf8',
        timeout: 10000 
      });
      console.log(`✅ Popup affiché avec succès: ${title} - Résultat: ${result.trim()}`);
    } catch (execError) {
      console.log(`❌ Erreur execSync, tentative spawn: ${execError.message}`);
      
      // Fallback avec spawn
      const child = spawn('powershell.exe', ['-Command', powershellCmd], {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      child.stdout.on('data', (data) => {
        console.log(`📄 Stdout popup: ${data.toString().trim()}`);
      });
      
      child.stderr.on('data', (data) => {
        console.log(`⚠️ Stderr popup: ${data.toString().trim()}`);
      });
      
      child.on('close', (code) => {
        console.log(`🔚 Popup fermé avec code: ${code}`);
      });
    }
    
  } catch (error) {
    // Si PowerShell échoue complètement, affiche dans la console
    console.log(`❌ Erreur popup complète, affichage console: ${error.message}`);
    console.log(`\n=== ${title} ===`);
    console.log(message);
    console.log('========================\n');
  }
}

// Chemin du dossier à scanner (détection automatique pour yao-pkg)
const directory = process.pkg ? process.cwd() : __dirname;

// Fichier de sortie
const outputFile = path.join(directory, 'liste_de_fichiers_et_dossiers.txt');
const outputFileName = path.basename(outputFile);

// Pop-up d'information au début
showPopup(
  'Listeur de fichiers et dossiers - RÉCURSIF',
  `Ce programme explore RÉCURSIVEMENT tous les sous-dossiers et enregistre la liste complète dans "${outputFileName}"`
);

// Nom de ce script et de l'exécutable pour les exclure de la liste
const scriptName = path.basename(__filename);
const exeName = 'listeur_de_fichiers_et_dossiers.exe';

// Vérification de l'existence de node_modules
const hasNodeModules = fs.existsSync(path.join(directory, 'node_modules'));

// 🔍 Fonction récursive pour explorer tous les sous-dossiers
function exploreDirectory(dirPath, relativePath = '') {
  const results = { dirs: [], files: [] };
  
  try {
    const entries = fs.readdirSync(dirPath);
    
    entries.forEach(name => {
      // Évite les fichiers système et notre propre script/exe
      if (name === scriptName || name === exeName || name === path.basename(outputFile)) {
        return;
      }
      
      const fullPath = path.join(dirPath, name);
      const relativeItemPath = path.join(relativePath, name);
      
      try {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          // Évite certains dossiers système/cachés problématiques
          if (!name.startsWith('.') && name !== 'node_modules' && name !== '$RECYCLE.BIN') {
            results.dirs.push(relativeItemPath || name);
            
            // Exploration récursive du sous-dossier
            const subResults = exploreDirectory(fullPath, relativeItemPath);
            results.dirs.push(...subResults.dirs);
            results.files.push(...subResults.files);
          }
        } else if (stats.isFile()) {
          results.files.push(relativeItemPath || name);
        }
      } catch (error) {
        // Ignore les fichiers/dossiers inaccessibles (permissions, etc.)
        console.log(`⚠️ Accès refusé: ${relativeItemPath || name}`);
      }
    });
    
  } catch (error) {
    console.log(`❌ Erreur lors de l'exploration de ${dirPath}: ${error.message}`);
  }
  
  return results;
}

console.log('🔍 Exploration récursive en cours...');
console.log('📁 Analyse de tous les sous-dossiers...');

// 🌳 Fonction pour construire l'arborescence hiérarchique
function buildHierarchicalOutput(directory, allDirs, allFiles) {
  const outputLines = [];
  
  // Fonction pour compter les fichiers DIRECTS dans un dossier (non récursif)
  function countFilesInDirectory(dirPath) {
    const relativePath = path.relative(directory, dirPath).replace(/\\/g, '/');
    let count = 0;
    
    allFiles.forEach(file => {
      const fileRelative = file.replace(/\\/g, '/');
      if (relativePath === '') {
        // Pour la racine, cherche les fichiers de niveau 1
        if (!fileRelative.includes('/')) {
          count++;
        }
      } else {
        // Pour les autres dossiers, cherche les fichiers directs seulement
        if (fileRelative.startsWith(relativePath + '/') && 
            fileRelative.replace(relativePath + '/', '').indexOf('/') === -1) {
          count++;
        }
      }
    });
    
    return count;
  }
  
  // Fonction pour compter les dossiers DIRECTS dans un dossier (non récursif)
  function countDirsInDirectory(dirPath) {
    const relativePath = path.relative(directory, dirPath).replace(/\\/g, '/');
    let count = 0;
    
    allDirs.forEach(dir => {
      const dirRelative = dir.replace(/\\/g, '/');
      if (relativePath === '') {
        // Pour la racine, cherche les dossiers de niveau 1
        if (!dirRelative.includes('/')) {
          count++;
        }
      } else {
        // Pour les autres dossiers, cherche les sous-dossiers directs seulement
        if (dirRelative.startsWith(relativePath + '/') && 
            dirRelative.replace(relativePath + '/', '').indexOf('/') === -1) {
          count++;
        }
      }
    });
    
    return count;
  }
  
  // Fonction récursive pour traiter un dossier et son contenu
  function processDirectory(dirPath, indent = '') {
    const relativePath = path.relative(directory, dirPath);
    const folderName = path.basename(dirPath);
    
    // Trouve les sous-dossiers directs de ce dossier
    const childDirs = allDirs.filter(dir => {
      const dirRelative = dir.replace(/\\/g, '/');
      const parentRelative = relativePath.replace(/\\/g, '/');
      
      if (parentRelative === '') {
        // Pour la racine, cherche les dossiers de niveau 1
        return !dirRelative.includes('/');
      } else {
        // Pour les autres, cherche les sous-dossiers directs
        return dirRelative.startsWith(parentRelative + '/') && 
               dirRelative.replace(parentRelative + '/', '').indexOf('/') === -1;
      }
    }).toSorted();
    
    // Trouve les fichiers directs de ce dossier
    const childFiles = allFiles.filter(file => {
      const fileRelative = file.replace(/\\/g, '/');
      const parentRelative = relativePath.replace(/\\/g, '/');
      
      if (parentRelative === '') {
        // Pour la racine, cherche les fichiers de niveau 1
        return !fileRelative.includes('/');
      } else {
        // Pour les autres, cherche les fichiers directs
        return fileRelative.startsWith(parentRelative + '/') && 
               fileRelative.replace(parentRelative + '/', '').indexOf('/') === -1;
      }
    }).toSorted();

    const totalItems = childDirs.length + childFiles.length;
    const newIndent = relativePath === '' ? '' : indent + '│   ';
    
    // Calcule le nombre de chiffres nécessaires pour la numérotation
    const maxDirNumber = childDirs.length;
    const maxFileNumber = childFiles.length;
    const dirDigits = maxDirNumber > 0 ? maxDirNumber.toString().length : 1;
    const fileDigits = maxFileNumber > 0 ? maxFileNumber.toString().length : 1;
    
    // Traite d'abord les sous-dossiers (récursivement)
    childDirs.forEach((dir, index) => {
      const isLastItem = index === totalItems - 1;
      const dirPrefix = isLastItem ? '└──' : '├──';
      const fullChildPath = path.join(directory, dir);
      const dirName = path.basename(dir);
      
      // Compte les fichiers et dossiers dans ce dossier
      const fileCount = countFilesInDirectory(fullChildPath);
      const dirCount = countDirsInDirectory(fullChildPath);
      
      // Construit l'affichage du compteur
      let counterDisplay = '';
      if (dirCount > 0 && fileCount > 0) {
        counterDisplay = ` (${dirCount} dossier${dirCount > 1 ? 's' : ''} - ${fileCount} fichier${fileCount > 1 ? 's' : ''})`;
      } else if (dirCount > 0) {
        counterDisplay = ` (${dirCount} dossier${dirCount > 1 ? 's' : ''})`;
      } else if (fileCount > 0) {
        counterDisplay = ` (${fileCount} fichier${fileCount > 1 ? 's' : ''})`;
      }
      
      // Numérotation locale des dossiers avec formatage adaptatif
      const localDirNumber = (index + 1).toString().padStart(dirDigits, '0');
      
      // Affiche le dossier avec son numéro formaté, le compteur et le bon préfixe
      outputLines.push(`${indent}${dirPrefix} ${localDirNumber}. ${dirName}/${counterDisplay}`);
      
      // Ajuste l'indentation pour les enfants du dernier élément
      const childIndent = isLastItem ? indent + '    ' : indent + '│   ';
      processDirectory(fullChildPath, childIndent);
    });
    
    // Puis affiche les fichiers de ce dossier
    const fileStartIndex = childDirs.length;
    childFiles.forEach((file, index) => {
      const fileName = path.basename(file);
      const itemIndex = fileStartIndex + index;
      const isLastItem = itemIndex === totalItems - 1;
      const prefix = isLastItem ? '└──' : '├──';
      
      // Numérotation locale des fichiers avec formatage adaptatif
      const localFileNumber = (index + 1).toString().padStart(fileDigits, '0');
      outputLines.push(`${indent}${prefix} ${localFileNumber}. ${fileName}`);
    });
  }
  
  // Démarre le traitement depuis la racine
  processDirectory(directory);
  
  return outputLines;
}

// Lance l'exploration récursive depuis le dossier racine
const explorationResults = exploreDirectory(directory);
const dirs = explorationResults.dirs;
const files = explorationResults.files;

console.log(`📊 Résultats: ${dirs.length} dossiers, ${files.length} fichiers trouvés`);

// Formate la date actuelle en français (jj/mm/aaaa hh:mm:ss)
const now = new Date().toLocaleString('fr-FR');

// Construction de l'arborescence hiérarchique
const hierarchicalLines = buildHierarchicalOutput(directory, dirs, files);

// En-tête du fichier
const outputLines = [];
outputLines.push('='.repeat(80));
outputLines.push('LISTE RÉCURSIVE DES FICHIERS ET DOSSIERS - FORMAT ARBORESCENT');
outputLines.push('='.repeat(80));
outputLines.push(`Dossier racine analysé: ${directory}`);
outputLines.push(`Date de génération: ${now}`);
outputLines.push(`STATISTIQUES: ${dirs.length} dossiers, ${files.length} fichiers`);
outputLines.push('Mode: Exploration récursive avec structure arborescente');
outputLines.push('');
outputLines.push('⚠️  EXCLUSIONS: node_modules/, dossiers cachés (.*), $RECYCLE.BIN');
outputLines.push('   (Les dépendances npm ne sont pas comptabilisées)');
outputLines.push('='.repeat(80));
outputLines.push('');
outputLines.push('STRUCTURE ARBORESCENTE:');
outputLines.push('-'.repeat(50));

// Ajoute l'arborescence
outputLines.push(...hierarchicalLines);

outputLines.push('');
outputLines.push('='.repeat(80));
outputLines.push('Fin de l\'exploration récursive');
outputLines.push(`TOTAL: ${dirs.length + files.length} éléments trouvés`);
outputLines.push('(Exclusions: node_modules/, dossiers cachés, fichiers système)');
outputLines.push('='.repeat(80));

// Écrit chaque élément un par ligne dans le fichier de sortie
fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');
console.log(`Liste RÉCURSIVE des fichiers et dossiers enregistrée dans "${outputFile}"`);

// Pop-up de confirmation à la fin 
const nodeModulesMessage = hasNodeModules ? '\n\n📦 Note: Le dossier "node_modules/" (dépendances npm) a été exclu de l\'analyse pour éviter des milliers d\'éléments supplémentaires.' : '';
showPopup(
  'Exploration récursive terminée !',
  `✅ ${dirs.length + files.length} éléments trouvés dans tous les sous-dossiers !\n\n📁 ${dirs.length} dossiers\n📄 ${files.length} fichiers${nodeModulesMessage} \n💾 Liste sauvegardée dans "${outputFileName}"`
);


/*
Pour créer l'exécutable YAO-PKG :
npm run build
.\listeur_de_fichiers_et_dossiers.exe

🎯 Fonctionnalités VERSION RÉCURSIVE :
- Exploration COMPLÈTE de tous les sous-dossiers
- spawn() au lieu d'execSync() pour popups non-bloquantes
- process.pkg au lieu de process.env.NODE_SEA pour détection
- Compatible avec tous les modules npm externes
- Format de sortie hiérarchique avec indentation
- Exclusion automatique des dossiers système (.git, node_modules, etc.)
- Gestion d'erreurs pour les fichiers inaccessibles
- Statistiques complètes d'exploration
*/