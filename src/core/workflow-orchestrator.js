/**
 * WorkflowOrchestrator - Orchestration des étapes du workflow
 * Module spécialisé pour coordonner les différentes phases d'exécution
 */

const path = require('path');
const DirectoryExplorer = require('./exploration/directory-explorer');
const ExclusionFilter = require('./exploration/exclusion-filter');
const TreeBuilder = require('./formatting/tree-builder');
const ElementCounter = require('./statistics/element-counter');
const ReportSectionBuilder = require('./output/report-section-builder');
const ValidationUtils = require('../utils/validation-utils');

class WorkflowOrchestrator {
  constructor(context) {
    this.context = context;
  }

  /**
   * Phase d'initialisation et validation
   */
  async initializeAndValidate() {
    this.context.progressTracker.startOperation('Initialisation', 3);

    // Validation du répertoire de travail
    const pathValidation = ValidationUtils.validatePath(this.context.workingDirectory);
    if (!pathValidation.isValid) {
      throw new Error(`Répertoire de travail invalide: ${pathValidation.error}`);
    }

    this.context.progressTracker.incrementProgress('Répertoire validé');

    // Vérification d'accès au répertoire
    const accessCheck = await this.context.fileSystemManager.checkAccess(this.context.workingDirectory);
    if (!accessCheck.success || !accessCheck.accessible) {
      throw new Error(`Accès refusé au répertoire: ${this.context.workingDirectory}`);
    }

    this.context.progressTracker.incrementProgress('Accès vérifié');

    // Configuration du filtrage (exclusions comme dans l'original)
    const exclusionFilter = new ExclusionFilter();
    exclusionFilter.addExcludedDirectory('node_modules');
    exclusionFilter.addExcludedDirectory('.git');
    exclusionFilter.addExcludedDirectory('$RECYCLE.BIN');
    exclusionFilter.addExcludedFile(path.basename(this.context.scriptName)); // Script actuel
    exclusionFilter.addExcludedFile('listeur_de_fichiers_et_dossiers.exe'); // Exécutable
    exclusionFilter.addExcludedFile(path.basename(this.context.outputFile)); // Fichier de sortie

    this.context.exclusionFilter = exclusionFilter;
    this.context.progressTracker.completeOperation();
  }

  /**
   * Phase d'exploration récursive
   */
  async performExploration() {
    console.log('🔍 Exploration récursive en cours...');
    console.log('📁 Analyse de tous les sous-dossiers...');

    this.context.progressTracker.startOperation('Exploration récursive');
    this.context.performanceTracker.milestone('exploration_start');

    try {
      // Initialisation de l'explorateur
      const explorer = new DirectoryExplorer();
      
      // Lancement de l'exploration
      const scriptName = path.basename(this.context.scriptName);
      const exeName = 'listeur_de_fichiers_et_dossiers.exe';
      const outputFileName = path.basename(this.context.outputFile);
      
      const explorationResults = explorer.explore(this.context.workingDirectory, '', scriptName, exeName, outputFileName);

      // Adaptation du format de retour
      this.context.explorationResults = {
        directories: explorationResults.dirs.map(dir => ({ relativePath: dir, name: path.basename(dir) })),
        files: explorationResults.files.map(file => ({ relativePath: file, name: path.basename(file) }))
      };

      this.context.performanceTracker.milestone('exploration_end');
      const explorationTime = this.context.performanceTracker.getDurationBetween('exploration_start', 'exploration_end');
      
      console.log(`📊 Résultats: ${this.context.explorationResults.directories.length} dossiers, ${this.context.explorationResults.files.length} fichiers trouvés`);
      console.log(`⏱️ Temps d'exploration: ${this.context.performanceTracker.constructor.formatDuration(explorationTime)}`);

      this.context.progressTracker.completeOperation();
    } catch (error) {
      console.log('🔍 Erreur dans performExploration:', error.message);
      throw error;
    }
  }

  /**
   * Phase de génération du rapport
   */
  async generateReport() {
    this.context.progressTracker.startOperation('Génération du rapport', 4);
    this.context.performanceTracker.milestone('report_start');

    try {
      // === 1. PRÉPARATION DES DONNÉES ===
      const { directories, files } = this.context.explorationResults;
      const allDirs = directories.map(d => d.relativePath);
      const allFiles = files.map(f => f.relativePath);

      this.context.progressTracker.incrementProgress('Données préparées');

      // === 2. CONSTRUCTION DE L'ARBORESCENCE ===
      const hierarchicalLines = TreeBuilder.build(
        this.context.workingDirectory,
        allDirs,
        allFiles
      );

      this.context.progressTracker.incrementProgress('Arborescence construite');

      // === 3. CALCUL DES STATISTIQUES ===
      const rootStats = ElementCounter.compareStats(allDirs, 'dossiers', allFiles, 'fichiers');
      const explorationTime = this.context.performanceTracker.getDurationBetween('exploration_start', 'exploration_end');

      this.context.progressTracker.incrementProgress('Statistiques calculées');

      // === 4. CONSTRUCTION DES SECTIONS VIA LE MODULE DÉDIÉ ===
      const sections = ReportSectionBuilder.buildAllSections({
        stats: rootStats,
        explorationTime,
        workingDirectory: this.context.workingDirectory,
        directories,
        hierarchicalLines
      });

      // === 5. ASSEMBLAGE DU RAPPORT ===
      this.context.reportGenerator.setMetadata({
        title: 'LISTE RÉCURSIVE DES FICHIERS ET DOSSIERS - FORMAT ARBORESCENT',
        timestamp: new Date(),
        version: '2.0.0'
      });

      // Ajout des sections
      this.context.reportGenerator.addSection('Configuration de l\'analyse', sections.header, 1);
      this.context.reportGenerator.addSection('STRUCTURE ARBORESCENTE', sections.tree, 1);
      this.context.reportGenerator.addSection('RÉSUMÉ DE L\'EXPLORATION RÉCURSIVE', sections.summary, 1);

      this.context.performanceTracker.milestone('report_end');
      this.context.progressTracker.completeOperation();
    } catch (error) {
      console.log('🔍 Erreur dans generateReport:', error.message);
      throw error;
    }
  }

  /**
   * Phase de sauvegarde des résultats
   */
  async saveResults() {
    this.context.progressTracker.startOperation('Sauvegarde du fichier');
    this.context.performanceTracker.milestone('file_writing_start');

    // Génération du contenu final
    const reportContent = this.context.reportGenerator.generate({
      includeTableOfContents: false,
      includeHeader: true,
      includeFooter: false
    });

    // Écriture sécurisée du fichier
    const writeResult = this.context.fileWriter.writeFile(this.context.outputFile, reportContent, {
      createBackup: false,
      atomic: true
    });

    if (!writeResult.success) {
      throw new Error(`Erreur d'écriture: ${writeResult.error}`);
    }

    this.context.performanceTracker.milestone('file_writing_end');
    const writingTime = this.context.performanceTracker.getDurationBetween('file_writing_start', 'file_writing_end');
    
    console.log(`💾 Fichier généré en ${this.context.performanceTracker.constructor.formatDuration(writingTime)}`);
    console.log(`Liste RÉCURSIVE des fichiers et dossiers enregistrée dans "${this.context.outputFile}"`);

    this.context.progressTracker.completeOperation();
  }

  /**
   * Notifications du workflow
   */
  async showStartNotification() {
    const outputFileName = path.basename(this.context.outputFile);
    const message = `Ce programme explore RÉCURSIVEMENT tous les sous-dossiers et enregistre la liste complète dans "${outputFileName}"`;
    
    await this.context.notificationService.notify(
      message,
      'Listeur de fichiers et dossiers - RÉCURSIF'
    );
  }

  async showCompletionNotification() {
    const totalDuration = this.context.performanceTracker.getDurationFromStart();
    const { directories, files } = this.context.explorationResults;
    const totalElements = directories.length + files.length;
    
    const hasNodeModules = directories.some(d => d.name === 'node_modules');
    const nodeModulesMessage = hasNodeModules ? 
      ' | 📦 Note: Le dossier "node_modules/" (dépendances npm) a été exclu de l\'analyse pour éviter des milliers d\'éléments supplémentaires.' : '';

    const message = `✅ ${totalElements} éléments trouvés dans tous les sous-dossiers ! | 📁 ${directories.length} dossiers | 📄 ${files.length} fichiers | ⏱️ Temps total: ${this.context.performanceTracker.constructor.formatDuration(totalDuration)}${nodeModulesMessage} | 💾 Liste sauvegardée dans "${path.basename(this.context.outputFile)}"`;

    await this.context.notificationService.notifySuccess(
      message,
      'Exploration récursive terminée !'
    );
  }
}

module.exports = WorkflowOrchestrator;
