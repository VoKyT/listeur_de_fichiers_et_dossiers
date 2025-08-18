/**
 * Configuration par défaut de l'application
 * Responsabilité unique : définition des paramètres par défaut
 */

class DefaultConfig {
  /**
   * Configuration principale de l'application
   */
  static get APPLICATION() {
    return {
      name: 'Listeur de Fichiers et Dossiers',
      version: '2.0.0',
      description: 'Explorateur de structure de fichiers avec affichage hiérarchique',
      author: 'Générateur automatique',
      encoding: 'utf8'
    };
  }

  /**
   * Configuration de l'exploration des fichiers
   */
  static get EXPLORATION() {
    return {
      // Répertoires à ignorer par défaut
      excludedDirs: [
        'node_modules',
        '.git',
        '.svn',
        '.hg',
        'dist',
        'build',
        'target',
        'bin',
        'obj',
        'temp',
        'tmp',
        'cache',
        '.cache',
        'logs',
        '.logs',
        'coverage',
        '.nyc_output',
        '__pycache__',
        '.pytest_cache',
        '.idea',
        '.vscode',
        '.vs',
        'Thumbs.db',
        '.DS_Store'
      ],

      // Extensions de fichiers à ignorer par défaut
      excludedExtensions: [
        '.tmp',
        '.temp',
        '.log',
        '.bak',
        '.backup',
        '.swp',
        '.swo',
        '~',
        '.lock'
      ],

      // Fichiers spécifiques à ignorer
      excludedFiles: [
        'Thumbs.db',
        '.DS_Store',
        'desktop.ini',
        '.gitkeep',
        '.npmignore',
        '.eslintcache'
      ],

      // Options de parcours
      maxDepth: Infinity,
      followSymlinks: false,
      includeHidden: false,
      caseSensitive: process.platform !== 'win32'
    };
  }

  /**
   * Configuration du formatage de sortie
   */
  static get OUTPUT() {
    return {
      // Symboles pour l'arbre hiérarchique
      treeSymbols: {
        branch: '├── ',
        lastBranch: '└── ',
        vertical: '│   ',
        space: '    '
      },

      // Options de numérotation
      numbering: {
        enabled: true,
        padStart: true,
        separator: '. ',
        format: 'decimal' // 'decimal', 'roman', 'alpha'
      },

      // Format des statistiques
      statistics: {
        showCounts: true,
        showPercentages: false,
        showSizes: false,
        showDates: false
      },

      // Options d'affichage
      display: {
        maxLineLength: 120,
        truncateNames: false,
        showExtensions: true,
        colorOutput: false,
        indent: '  '
      }
    };
  }

  /**
   * Configuration des fichiers de sortie
   */
  static get FILES() {
    return {
      // Noms des fichiers de sortie
      output: {
        combined: 'liste_de_fichiers_et_dossiers.txt',
        filesOnly: 'liste_fichiers.txt',
        dirsOnly: 'liste_dossiers.txt'
      },

      // Options d'écriture
      writing: {
        encoding: 'utf8',
        createBackup: true,
        atomic: true,
        overwrite: true
      },

      // En-têtes des fichiers
      headers: {
        includeTimestamp: true,
        includeConfig: false,
        includeStats: true,
        includeSystemInfo: false
      }
    };
  }

  /**
   * Configuration des notifications
   */
  static get NOTIFICATIONS() {
    return {
      // Types de notifications
      types: {
        completion: true,
        errors: true,
        warnings: false,
        progress: false
      },

      // Méthodes de notification
      methods: {
        popup: process.platform === 'win32',
        console: true,
        desktop: false,
        sound: false
      },

      // Messages par défaut
      messages: {
        completion: 'Exploration terminée avec succès',
        error: 'Une erreur est survenue pendant l\'exploration',
        noFiles: 'Aucun fichier trouvé dans le répertoire',
        accessDenied: 'Accès refusé au répertoire'
      }
    };
  }

  /**
   * Configuration de performance
   */
  static get PERFORMANCE() {
    return {
      // Limites de performance
      limits: {
        maxFiles: 10000,
        maxDirectories: 1000,
        maxDepth: 20,
        timeoutMs: 30000
      },

      // Optimisations
      optimizations: {
        useCache: false,
        batchSize: 100,
        concurrency: 4,
        throttleMs: 0
      },

      // Monitoring
      monitoring: {
        trackTiming: true,
        trackMemory: false,
        logProgress: false,
        profileOperations: false
      }
    };
  }

  /**
   * Configuration de débogage
   */
  static get DEBUG() {
    return {
      // Niveau de verbosité
      level: 'info', // 'silent', 'error', 'warn', 'info', 'debug', 'trace'
      
      // Options de logging
      logging: {
        console: true,
        file: false,
        timestamp: true,
        colors: true
      },

      // Informations à inclure
      include: {
        stackTrace: false,
        systemInfo: false,
        timing: false,
        memoryUsage: false
      }
    };
  }

  /**
   * Obtient la configuration complète par défaut
   */
  static getFullConfig() {
    return {
      application: this.APPLICATION,
      exploration: this.EXPLORATION,
      output: this.OUTPUT,
      files: this.FILES,
      notifications: this.NOTIFICATIONS,
      performance: this.PERFORMANCE,
      debug: this.DEBUG
    };
  }

  /**
   * Obtient une section spécifique de la configuration
   */
  static getSection(sectionName) {
    const sections = {
      application: this.APPLICATION,
      exploration: this.EXPLORATION,
      output: this.OUTPUT,
      files: this.FILES,
      notifications: this.NOTIFICATIONS,
      performance: this.PERFORMANCE,
      debug: this.DEBUG
    };

    return sections[sectionName.toLowerCase()] || null;
  }

  /**
   * Valide une configuration personnalisée
   */
  static validateConfig(config) {
    const errors = [];
    const warnings = [];

    // Validation de base
    if (config.exploration && config.exploration.maxDepth < 1) {
      errors.push('maxDepth doit être >= 1');
    }

    if (config.performance && config.performance.limits.maxFiles < 1) {
      errors.push('maxFiles doit être >= 1');
    }

    if (config.files && !config.files.output.combined) {
      warnings.push('Nom de fichier de sortie manquant');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Fusionne une configuration personnalisée avec les valeurs par défaut
   */
  static mergeConfig(customConfig) {
    const defaultConfig = this.getFullConfig();
    
    function deepMerge(target, source) {
      const result = { ...target };
      
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      
      return result;
    }

    return deepMerge(defaultConfig, customConfig || {});
  }
}

module.exports = DefaultConfig;
