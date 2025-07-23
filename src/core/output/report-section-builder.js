/**
 * ReportSectionBuilder - Construction des sections de rapport
 * Module spécialisé pour la génération des différentes sections du rapport de sortie
 */

const path = require('path');
const PerformanceTracker = require('../statistics/performance-tracker');

class ReportSectionBuilder {
  /**
   * Construit la section d'en-tête du rapport
   * @param {Object} stats - Statistiques des éléments
   * @param {number} explorationTime - Temps d'exploration en ms
   * @param {string} workingDirectory - Répertoire de travail
   * @param {Array} directories - Liste des répertoires trouvés
   * @returns {string} Contenu de la section d'en-tête
   */
  static buildHeaderSection(stats, explorationTime, workingDirectory, directories) {
    const now = new Date().toLocaleString('fr-FR');
    const hasNodeModules = directories.some(d => d.name === 'node_modules');

    let content = `DOSSIER RACINE ANALYSÉ: ${workingDirectory}\n`;
    content += `DATE DE GÉNÉRATION: ${now}\n`;
    content += `STATISTIQUES: ${stats.total} éléments (${stats.dossiers.total} dossiers, ${stats.fichiers.total} fichiers)\n`;
    content += `TEMPS D'EXPLORATION: ${PerformanceTracker.formatDuration(explorationTime)}\n`;
    content += `MODE: Exploration récursive avec structure arborescente\n\n`;
    
    content += `⚠️  EXCLUSIONS APPLIQUÉES:\n`;
    content += `   • node_modules/ (dépendances npm)\n`;
    content += `   • Dossiers cachés (.*)\n`;
    content += `   • Fichiers système ($RECYCLE.BIN)\n`;

    return content;
  }

  /**
   * Construit la section arborescence du rapport
   * @param {Array} hierarchicalLines - Lignes de l'arborescence
   * @param {Object} stats - Statistiques des éléments
   * @param {string} workingDirectory - Répertoire de travail
   * @returns {string} Contenu de la section arborescence
   */
  static buildTreeSection(hierarchicalLines, stats, workingDirectory) {
    const rootDirs = stats.dossiers.rootCount;
    const rootFiles = stats.fichiers.rootCount;
    
    const counterParts = [];
    if (rootDirs > 0) counterParts.push(`${rootDirs} dossier${rootDirs > 1 ? 's' : ''}`);
    if (rootFiles > 0) counterParts.push(`${rootFiles} fichier${rootFiles > 1 ? 's' : ''}`);
    const rootCounter = counterParts.length ? ` (${counterParts.join(' - ')})` : '';

    let content = `📁 ${path.basename(workingDirectory)}/${rootCounter}\n`;
    content += hierarchicalLines.join('\n');

    return content;
  }

  /**
   * Construit la section résumé du rapport
   * @param {Object} stats - Statistiques des éléments
   * @param {number} explorationTime - Temps d'exploration en ms
   * @returns {string} Contenu de la section résumé
   */
  static buildSummarySection(stats, explorationTime) {
    let content = `TOTAL GÉNÉRAL: ${stats.total} éléments trouvés\n`;
    content += `DÉTAIL: ${stats.dossiers.total} dossiers, ${stats.fichiers.total} fichiers\n`;
    content += `TEMPS D'EXPLORATION: ${PerformanceTracker.formatDuration(explorationTime)}\n\n`;
    
    content += `⚠️  EXCLUSIONS APPLIQUÉES:\n`;
    content += `   • node_modules/ (dépendances npm)\n`;
    content += `   • Dossiers cachés (.*)\n`;
    content += `   • Fichiers système ($RECYCLE.BIN)\n`;

    return content;
  }

  /**
   * Construit toutes les sections du rapport en une seule fois
   * @param {Object} params - Paramètres pour la construction
   * @returns {Object} Objet contenant toutes les sections
   */
  static buildAllSections(params) {
    const { stats, explorationTime, workingDirectory, directories, hierarchicalLines } = params;

    return {
      header: this.buildHeaderSection(stats, explorationTime, workingDirectory, directories),
      tree: this.buildTreeSection(hierarchicalLines, stats, workingDirectory),
      summary: this.buildSummarySection(stats, explorationTime)
    };
  }
}

module.exports = ReportSectionBuilder;
