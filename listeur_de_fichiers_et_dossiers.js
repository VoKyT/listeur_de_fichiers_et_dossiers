#!/usr/bin/env node
// listeur_de_fichiers_et_dossiers.js
// Script Node.js pour lister fichiers et dossiers du répertoire courant - Version YAO-PKG v3.1.2
// Popups PowerShell natifs + Compteur répertoire racine + Syntaxe unifiée

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Fonction pour formater le temps d'exécution
function formatDuration(milliseconds) {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else if (milliseconds < 60000) {
    const seconds = (milliseconds / 1000).toFixed(2);
    return `${seconds}s`;
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(1);
    return `${minutes}min ${seconds}s`;
  }
}

// Fonction pour afficher une pop-up Windows
function showPopup(title, message) {
  try {
    console.log(`🔔 Tentative d'affichage popup: ${title}`);
    
    // Nettoie le message pour PowerShell (une seule fois)
    const cleanTitle = title.replace(/['"]/g, match => match === "'" ? "''" : '""');
    const cleanMessage = message
      .replace(/['"]/g, match => match === "'" ? "''" : '""')
      .replace(/[\r\n]/g, ' | ');
    
    const powershellCmd = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${cleanMessage}', '${cleanTitle}', 'OK', 'Information')`;
    
    try {
      const result = execSync(`powershell.exe -Command "${powershellCmd}"`, { 
        encoding: 'utf8',
        timeout: 10000 
      });
      console.log(`✅ Popup affiché avec succès: ${title} - Résultat: ${result.trim()}`);
    } catch (execError) {
      console.log(`❌ Erreur execSync, tentative spawn: ${execError.message}`);
      
      // Fallback avec spawn simplifié
      spawn('powershell.exe', ['-Command', powershellCmd], { stdio: 'ignore' });
    }
    
  } catch (error) {
    // Fallback console
    console.log(`❌ Erreur popup, affichage console: ${error.message}`);
    console.log(`\n=== ${title} ===\n${message}\n${'='.repeat(24)}\n`);
  }
}

// Configuration et initialisation
const directory = process.pkg ? process.cwd() : __dirname;
const outputFile = path.join(directory, 'liste_de_fichiers_et_dossiers.txt');
const outputFileName = path.basename(outputFile);
const scriptName = path.basename(__filename);
const exeName = 'listeur_de_fichiers_et_dossiers.exe';
const hasNodeModules = fs.existsSync(path.join(directory, 'node_modules'));

// Démarrage du chronomètre
const startTime = Date.now();
console.log('⏱️ Démarrage du chronomètre...');

showPopup(
  'Listeur de fichiers et dossiers - RÉCURSIF',
  `Ce programme explore RÉCURSIVEMENT tous les sous-dossiers et enregistre la liste complète dans "${outputFileName}"`
);

// Fonction récursive pour explorer tous les sous-dossiers
function exploreDirectory(dirPath, relativePath = '') {
  const results = { dirs: [], files: [] };
  const excludedDirs = new Set(['.git', 'node_modules', '$RECYCLE.BIN']);
  
  try {
    const entries = fs.readdirSync(dirPath);
    
    for (const name of entries) {
      // Évite les fichiers système et notre propre script/exe
      if (name === scriptName || name === exeName || name === outputFileName) continue;
      
      const fullPath = path.join(dirPath, name);
      const relativeItemPath = path.join(relativePath, name);
      
      try {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          // Évite les dossiers système/cachés
          if (!name.startsWith('.') && !excludedDirs.has(name)) {
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
        console.log(`⚠️ Accès refusé: ${relativeItemPath || name}`);
      }
    }
    
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
  
  // Fonction optimisée pour compter les éléments directs
  function countDirectElements(items, targetPath) {
    const normalizedTarget = targetPath.replace(/\\/g, '/');
    return items.filter(item => {
      const normalized = item.replace(/\\/g, '/');
      if (normalizedTarget === '') {
        return !normalized.includes('/');
      }
      return normalized.startsWith(normalizedTarget + '/') && 
             normalized.replace(normalizedTarget + '/', '').indexOf('/') === -1;
    }).length;
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
      const relativePath = path.relative(directory, fullChildPath).replace(/\\/g, '/');
      const fileCount = countDirectElements(allFiles, relativePath);
      const dirCount = countDirectElements(allDirs, relativePath);
      
      // Construit l'affichage du compteur optimisé
      const counterParts = [];
      if (dirCount > 0) counterParts.push(`${dirCount} dossier${dirCount > 1 ? 's' : ''}`);
      if (fileCount > 0) counterParts.push(`${fileCount} fichier${fileCount > 1 ? 's' : ''}`);
      const counterDisplay = counterParts.length ? ` (${counterParts.join(' - ')})` : '';
      
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

// 🕐 Calcul du temps d'exploration
const explorationEndTime = Date.now();
const explorationDuration = explorationEndTime - startTime;

console.log(`📊 Résultats: ${dirs.length} dossiers, ${files.length} fichiers trouvés`);
console.log(`⏱️ Temps d'exploration: ${formatDuration(explorationDuration)}`);

// Formate la date actuelle en français (jj/mm/aaaa hh:mm:ss)
const now = new Date().toLocaleString('fr-FR');

// Construction de l'arborescence hiérarchique
const hierarchicalLines = buildHierarchicalOutput(directory, dirs, files);

// Calcul des éléments directs de la racine pour l'en-tête
const rootFiles = files.filter(file => !file.includes('/') && !file.includes('\\')).length;
const rootDirs = dirs.filter(dir => !dir.includes('/') && !dir.includes('\\')).length;

// Construction du message de compteur pour la racine avec logique simplifiée
const buildRootCounter = (dirs, files) => {
  const counters = [];
  if (dirs > 0) counters.push(`${dirs} dossier${dirs > 1 ? 's' : ''}`);
  if (files > 0) counters.push(`${files} fichier${files > 1 ? 's' : ''}`);
  return counters.length > 0 ? ` (${counters.join(' - ')})` : '';
};

const rootCounterMessage = buildRootCounter(rootDirs, rootFiles);

// En-tête du fichier
const outputLines = [];
outputLines.push('='.repeat(80));
outputLines.push('LISTE RÉCURSIVE DES FICHIERS ET DOSSIERS - FORMAT ARBORESCENT');
outputLines.push('='.repeat(80));
outputLines.push(`DOSSIER RACINE ANALYSÉ: ${directory}`);
outputLines.push(`DATE DE GÉNÉRATION: ${now}`);
outputLines.push(`STATISTIQUES: ${dirs.length} dossiers, ${files.length} fichiers`);
outputLines.push(`TEMPS D'EXPLORATION: ${formatDuration(explorationDuration)}`);
outputLines.push('MODE: Exploration récursive avec structure arborescente');
outputLines.push('');
outputLines.push('⚠️  EXCLUSIONS APPLIQUÉES:');
outputLines.push('   • node_modules/ (dépendances npm)');
outputLines.push('   • Dossiers cachés (.*)'); 
outputLines.push('   • Fichiers système ($RECYCLE.BIN)');
outputLines.push('='.repeat(80));
outputLines.push('');
outputLines.push('STRUCTURE ARBORESCENTE:');
outputLines.push('='.repeat(80));
outputLines.push(`📁 ${path.basename(directory)}/${rootCounterMessage}`);

// Ajoute l'arborescence
outputLines.push(...hierarchicalLines);

outputLines.push('');
outputLines.push('='.repeat(80));
outputLines.push('RÉSUMÉ DE L\'EXPLORATION RÉCURSIVE');
outputLines.push('='.repeat(80));
outputLines.push(`TOTAL GÉNÉRAL: ${dirs.length + files.length} éléments trouvés`);
outputLines.push(`DÉTAIL: ${dirs.length} dossiers, ${files.length} fichiers`);
outputLines.push(`TEMPS D'EXPLORATION: ${formatDuration(explorationDuration)}`);
outputLines.push('');
outputLines.push('⚠️  EXCLUSIONS APPLIQUÉES:');
outputLines.push('   • node_modules/ (dépendances npm)');
outputLines.push('   • Dossiers cachés (.*)');
outputLines.push('   • Fichiers système ($RECYCLE.BIN)');
outputLines.push('='.repeat(80));

// Écrit chaque élément un par ligne dans le fichier de sortie
fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

// 🕐 Calcul du temps total
const totalEndTime = Date.now();
const totalDuration = totalEndTime - startTime;
const fileGenerationDuration = totalDuration - explorationDuration;

console.log(`💾 Fichier généré en ${formatDuration(fileGenerationDuration)}`);
console.log(`⏱️ TEMPS TOTAL: ${formatDuration(totalDuration)}`);
console.log(`Liste RÉCURSIVE des fichiers et dossiers enregistrée dans "${outputFile}"`);

// Pop-up de confirmation à la fin 
const nodeModulesMessage = hasNodeModules ? ' | 📦 Note: Le dossier "node_modules/" (dépendances npm) a été exclu de l\'analyse pour éviter des milliers d\'éléments supplémentaires.' : '';
showPopup(
  'Exploration récursive terminée !',
  `✅ ${dirs.length + files.length} éléments trouvés dans tous les sous-dossiers ! | 📁 ${dirs.length} dossiers | 📄 ${files.length} fichiers | ⏱️ Temps total: ${formatDuration(totalDuration)}${nodeModulesMessage} | 💾 Liste sauvegardée dans "${outputFileName}"`
);


/*
Pour créer l'exécutable YAO-PKG :
npm run build
.\listeur_de_fichiers_et_dossiers.exe

🎯 Fonctionnalités VERSION 3.1.1 :
- Exploration COMPLÈTE de tous les sous-dossiers
- Popups PowerShell natifs avec System.Windows.Forms.MessageBox
- execSync() puis spawn() en fallback pour popups fiables
- process.pkg pour détection d'environnement yao-pkg
- Échappement robuste des caractères spéciaux dans popups
- Format de sortie hiérarchique avec indentation Unix
- Exclusion automatique des dossiers système (.git, node_modules, etc.)
- Gestion d'erreurs pour les fichiers inaccessibles
- Logs détaillés pour debugging des popups
- Numérotation locale par dossier avec formatage adaptatif
- Compteurs intelligents (dossiers/fichiers séparés)
- ⏱️ CHRONOMÈTRE INTÉGRÉ : Mesure temps d'exploration et génération de fichier
- 📁 COMPTEUR RÉPERTOIRE RACINE : Affichage statistiques du dossier principal
*/