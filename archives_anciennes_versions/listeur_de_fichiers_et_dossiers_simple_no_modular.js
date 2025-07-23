#!/usr/bin/env node
/**
 * Version simplifiée de l'orchestrateur pour test rapide
 * Utilise directement les modules principaux
 */

const path = require('path');
const fs = require('fs');

// Modules principaux
const ExclusionFilter = require('./src/core/exploration/exclusion-filter');
const DirectoryExplorer = require('./src/core/exploration/directory-explorer');
const TreeBuilder = require('./src/core/formatting/tree-builder');
const PerformanceTracker = require('./src/core/statistics/performance-tracker');
const TextFormatter = require('./src/core/output/text-formatter');
const NotificationService = require('./src/infrastructure/notification-service');

console.log('⏱️ Démarrage du chronomètre...');

// Initialisation
const startTime = Date.now();
const performanceTracker = new PerformanceTracker();
const notificationService = new NotificationService();

// Configuration des chemins (compatible yao-pkg)
const directory = process.pkg ? process.cwd() : __dirname;
const outputFile = path.join(directory, 'liste_de_fichiers_et_dossiers.txt');
const outputFileName = path.basename(outputFile);
const scriptName = path.basename(__filename);
const exeName = 'listeur_de_fichiers_et_dossiers.exe';

performanceTracker.start();

// Notification de démarrage
async function showStartNotification() {
  const message = `Ce programme explore RÉCURSIVEMENT tous les sous-dossiers et enregistre la liste complète dans "${outputFileName}"`;
  await notificationService.notify(message, 'Listeur de fichiers et dossiers - RÉCURSIF');
}

// Exploration
async function performExploration() {
  console.log('🔍 Exploration récursive en cours...');
  console.log('📁 Analyse de tous les sous-dossiers...');
  
  performanceTracker.milestone('exploration_start');
  
  const explorer = new DirectoryExplorer();
  const results = explorer.explore(directory, '', scriptName, exeName, outputFileName);
  
  performanceTracker.milestone('exploration_end');
  const explorationTime = performanceTracker.getDurationBetween('exploration_start', 'exploration_end');
  
  console.log(`📊 Résultats: ${results.dirs.length} dossiers, ${results.files.length} fichiers trouvés`);
  console.log(`⏱️ Temps d'exploration: ${TextFormatter.formatDuration(explorationTime)}`);
  
  return { results, explorationTime };
}

// Génération du rapport
function generateReport(explorationData) {
  console.log('📝 Génération du rapport...');
  
  const { results, explorationTime } = explorationData;
  
  const hierarchicalLines = TreeBuilder.build(directory, results.dirs, results.files);
  
  // Construction du contenu
  const now = new Date().toLocaleString('fr-FR');
  
  const outputLines = [];
  
  // En-tête
  outputLines.push('='.repeat(80));
  outputLines.push('LISTE RÉCURSIVE DES FICHIERS ET DOSSIERS - FORMAT ARBORESCENT');
  outputLines.push('='.repeat(80));
  outputLines.push(`DOSSIER RACINE ANALYSÉ: ${directory}`);
  outputLines.push(`DATE DE GÉNÉRATION: ${now}`);
  outputLines.push(`STATISTIQUES: ${results.dirs.length} dossiers, ${results.files.length} fichiers`);
  outputLines.push(`TEMPS D'EXPLORATION: ${TextFormatter.formatDuration(explorationTime)}`);
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
  
  // Compteur racine
  const rootFiles = results.files.filter(file => !file.includes('/') && !file.includes('\\')).length;
  const rootDirs = results.dirs.filter(dir => !dir.includes('/') && !dir.includes('\\')).length;
  const counterParts = [];
  if (rootDirs > 0) counterParts.push(`${rootDirs} dossier${rootDirs > 1 ? 's' : ''}`);
  if (rootFiles > 0) counterParts.push(`${rootFiles} fichier${rootFiles > 1 ? 's' : ''}`);
  const rootCounter = counterParts.length ? ` (${counterParts.join(' - ')})` : '';
  
  outputLines.push(`📁 ${path.basename(directory)}/${rootCounter}`);
  outputLines.push(...hierarchicalLines);
  
  // Résumé
  outputLines.push('');
  outputLines.push('='.repeat(80));
  outputLines.push('RÉSUMÉ DE L\'EXPLORATION RÉCURSIVE');
  outputLines.push('='.repeat(80));
  outputLines.push(`TOTAL GÉNÉRAL: ${results.dirs.length + results.files.length} éléments trouvés`);
  outputLines.push(`DÉTAIL: ${results.dirs.length} dossiers, ${results.files.length} fichiers`);
  outputLines.push(`TEMPS D'EXPLORATION: ${TextFormatter.formatDuration(explorationTime)}`);
  outputLines.push('');
  outputLines.push('⚠️  EXCLUSIONS APPLIQUÉES:');
  outputLines.push('   • node_modules/ (dépendances npm)');
  outputLines.push('   • Dossiers cachés (.*)');
  outputLines.push('   • Fichiers système ($RECYCLE.BIN)');
  outputLines.push('='.repeat(80));
  
  return outputLines.join('\n');
}

// Sauvegarde
function saveResults(content) {
  console.log('💾 Sauvegarde du fichier...');
  
  performanceTracker.milestone('file_write_start');
  fs.writeFileSync(outputFile, content, 'utf-8');
  performanceTracker.milestone('file_write_end');
  
  const writingTime = performanceTracker.getDurationBetween('file_write_start', 'file_write_end');
  
  console.log(`💾 Fichier généré en ${TextFormatter.formatDuration(writingTime)}`);
  console.log(`Liste RÉCURSIVE des fichiers et dossiers enregistrée dans "${outputFile}"`);
}

// Notification de fin
async function showCompletionNotification(explorationData) {
  const totalTime = performanceTracker.getDurationFromStart();
  const { results } = explorationData;
  const totalElements = results.dirs.length + results.files.length;
  
  const hasNodeModules = results.dirs.some(d => d.includes('node_modules'));
  const nodeModulesMessage = hasNodeModules ? 
    ' | 📦 Note: Le dossier "node_modules/" (dépendances npm) a été exclu de l\'analyse pour éviter des milliers d\'éléments supplémentaires.' : '';

  const message = `✅ ${totalElements} éléments trouvés dans tous les sous-dossiers ! | 📁 ${results.dirs.length} dossiers | 📄 ${results.files.length} fichiers | ⏱️ Temps total: ${TextFormatter.formatDuration(totalTime)}${nodeModulesMessage} | 💾 Liste sauvegardée dans "${outputFileName}"`;

  await notificationService.notifySuccess(message, 'Exploration récursive terminée !');
}

// Fonction principale
async function main() {
  try {
    await showStartNotification();
    const explorationData = await performExploration();
    const content = generateReport(explorationData);
    saveResults(content);
    await showCompletionNotification(explorationData);
    
    const totalTime = performanceTracker.getDurationFromStart();
    console.log(`⏱️ TEMPS TOTAL: ${TextFormatter.formatDuration(totalTime)}`);
    
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    await notificationService.notifyError(error.message, 'Erreur d\'exploration');
  }
}

// Exécution
if (require.main === module) {
  main();
}

module.exports = { main };
