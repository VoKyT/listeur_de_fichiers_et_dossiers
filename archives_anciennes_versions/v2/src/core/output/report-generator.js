/**
 * Générateur de rapports formatés
 * Responsabilité unique : création de rapports structurés
 */

const TextFormatter = require('./text-formatter');

class ReportGenerator {
  constructor() {
    this.sections = [];
    this.metadata = {
      title: '',
      timestamp: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Définit les métadonnées du rapport
   */
  setMetadata(metadata) {
    Object.assign(this.metadata, metadata);
    return this;
  }

  /**
   * Ajoute une section au rapport
   */
  addSection(title, content, level = 1) {
    this.sections.push({
      title,
      content,
      level,
      timestamp: new Date()
    });
    return this;
  }

  /**
   * Ajoute une section de statistiques
   */
  addStatsSection(title, stats, level = 2) {
    const content = TextFormatter.formatKeyValuePairs(stats);
    return this.addSection(title, content, level);
  }

  /**
   * Ajoute une section de liste
   */
  addListSection(title, items, numbered = false, level = 2) {
    const content = numbered ? 
      TextFormatter.formatNumberedList(items) :
      TextFormatter.formatBulletList(items);
    return this.addSection(title, content, level);
  }

  /**
   * Ajoute une section de tableau
   */
  addTableSection(title, rows, headers = null, level = 2) {
    const content = TextFormatter.formatTable(rows, headers);
    return this.addSection(title, content, level);
  }

  /**
   * Ajoute un résumé exécutif
   */
  addExecutiveSummary(summary) {
    this.sections.unshift({
      title: 'Résumé exécutif',
      content: summary,
      level: 1,
      timestamp: new Date()
    });
    return this;
  }

  /**
   * Génère l'en-tête du rapport
   */
  generateHeader() {
    const { title, timestamp, version } = this.metadata;
    const formattedDate = timestamp.toLocaleString('fr-FR');
    
    let header = TextFormatter.formatSectionHeader(title || 'Rapport d\'analyse', 1);
    header += `Date de génération: ${formattedDate}\n`;
    header += `Version: ${version}\n`;
    header += `\n`;
    
    return header;
  }

  /**
   * Génère le pied de page du rapport
   */
  generateFooter() {
    const sectionCount = this.sections.length;
    const generationTime = new Date().toLocaleString('fr-FR');
    
    let footer = '\n' + TextFormatter.CONSTANTS.SEPARATORS.SECTION + '\n';
    footer += `Rapport généré automatiquement - ${sectionCount} section(s)\n`;
    footer += `Heure de finalisation: ${generationTime}\n`;
    
    return footer;
  }

  /**
   * Génère la table des matières
   */
  generateTableOfContents() {
    if (this.sections.length === 0) return '';
    
    let toc = TextFormatter.formatSectionHeader('Table des matières', 2);
    
    this.sections.forEach((section, index) => {
      const indent = '  '.repeat(Math.max(0, section.level - 1));
      const number = (index + 1).toString().padStart(2, '0');
      toc += `${indent}${number}. ${section.title}\n`;
    });
    
    return toc + '\n';
  }

  /**
   * Génère le contenu de toutes les sections
   */
  generateSections() {
    return this.sections.map(section => {
      let sectionContent = TextFormatter.formatSectionHeader(section.title, section.level);
      sectionContent += section.content;
      sectionContent += '\n';
      return sectionContent;
    }).join('\n');
  }

  /**
   * Génère le rapport complet
   */
  generate(options = {}) {
    const {
      includeHeader = true,
      includeTableOfContents = true,
      includeFooter = true,
      includeTimestamps = false
    } = options;
    
    let report = '';
    
    if (includeHeader) {
      report += this.generateHeader();
    }
    
    if (includeTableOfContents && this.sections.length > 1) {
      report += this.generateTableOfContents();
    }
    
    report += this.generateSections();
    
    if (includeFooter) {
      report += this.generateFooter();
    }
    
    return report;
  }

  /**
   * Génère un résumé du rapport
   */
  generateSummary() {
    const stats = {
      'Sections totales': this.sections.length,
      'Date de création': this.metadata.timestamp.toLocaleDateString('fr-FR'),
      'Titre': this.metadata.title || 'Sans titre'
    };
    
    const sectionsByLevel = this.sections.reduce((acc, section) => {
      acc[`Niveau ${section.level}`] = (acc[`Niveau ${section.level}`] || 0) + 1;
      return acc;
    }, {});
    
    Object.assign(stats, sectionsByLevel);
    
    return TextFormatter.formatKeyValuePairs(stats);
  }

  /**
   * Exporte le rapport dans différents formats
   */
  export(format = 'text', options = {}) {
    switch (format.toLowerCase()) {
      case 'text':
      case 'txt':
        return this.generate(options);
      
      case 'summary':
        return this.generateSummary();
      
      case 'json':
        return JSON.stringify({
          metadata: this.metadata,
          sections: this.sections,
          generated: new Date()
        }, null, 2);
      
      default:
        throw new Error(`Format non supporté: ${format}`);
    }
  }

  /**
   * Réinitialise le rapport
   */
  reset() {
    this.sections = [];
    this.metadata = {
      title: '',
      timestamp: new Date(),
      version: '1.0.0'
    };
    return this;
  }

  /**
   * Clone le rapport
   */
  clone() {
    const clone = new ReportGenerator();
    clone.metadata = { ...this.metadata };
    clone.sections = [...this.sections];
    return clone;
  }
}

module.exports = ReportGenerator;
