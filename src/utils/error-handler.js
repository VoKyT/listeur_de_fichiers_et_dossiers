/**
 * Gestionnaire d'erreurs centralisé
 * Responsabilité unique : gestion et formatage des erreurs
 */

class ErrorHandler {
  constructor() {
    this.errorCounts = new Map();
    this.errorHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Types d'erreurs prédéfinis
   */
  static get ERROR_TYPES() {
    return {
      FILE_SYSTEM: 'filesystem',
      VALIDATION: 'validation',
      CONFIG: 'configuration',
      PERMISSION: 'permission',
      NETWORK: 'network',
      TIMEOUT: 'timeout',
      MEMORY: 'memory',
      UNKNOWN: 'unknown'
    };
  }

  /**
   * Niveaux de sévérité
   */
  static get SEVERITY_LEVELS() {
    return {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical'
    };
  }

  /**
   * Détermine le type d'erreur automatiquement
   */
  determineErrorType(error) {
    if (!error) return ErrorHandler.ERROR_TYPES.UNKNOWN;

    const message = error.message ? error.message.toLowerCase() : '';
    const code = error.code || '';

    // Erreurs de système de fichiers
    if (code.startsWith('E') || message.includes('file') || message.includes('directory')) {
      return ErrorHandler.ERROR_TYPES.FILE_SYSTEM;
    }

    // Erreurs de permission
    if (code === 'EACCES' || code === 'EPERM' || message.includes('permission')) {
      return ErrorHandler.ERROR_TYPES.PERMISSION;
    }

    // Erreurs de validation
    if (message.includes('invalid') || message.includes('validation')) {
      return ErrorHandler.ERROR_TYPES.VALIDATION;
    }

    // Erreurs de configuration
    if (message.includes('config') || message.includes('setting')) {
      return ErrorHandler.ERROR_TYPES.CONFIG;
    }

    // Erreurs de timeout
    if (code === 'ETIMEDOUT' || message.includes('timeout')) {
      return ErrorHandler.ERROR_TYPES.TIMEOUT;
    }

    // Erreurs de mémoire
    if (message.includes('memory') || message.includes('heap')) {
      return ErrorHandler.ERROR_TYPES.MEMORY;
    }

    return ErrorHandler.ERROR_TYPES.UNKNOWN;
  }

  /**
   * Détermine la sévérité d'une erreur
   */
  determineSeverity(error, context = {}) {
    const errorType = this.determineErrorType(error);
    const code = error.code || '';

    // Erreurs critiques
    if (errorType === ErrorHandler.ERROR_TYPES.MEMORY ||
        code === 'EMFILE' || code === 'ENFILE') {
      return ErrorHandler.SEVERITY_LEVELS.CRITICAL;
    }

    // Erreurs importantes
    if (errorType === ErrorHandler.ERROR_TYPES.PERMISSION ||
        errorType === ErrorHandler.ERROR_TYPES.CONFIG ||
        code === 'ENOTDIR' || code === 'EISDIR') {
      return ErrorHandler.SEVERITY_LEVELS.HIGH;
    }

    // Erreurs moyennes
    if (errorType === ErrorHandler.ERROR_TYPES.FILE_SYSTEM ||
        errorType === ErrorHandler.ERROR_TYPES.TIMEOUT) {
      return ErrorHandler.SEVERITY_LEVELS.MEDIUM;
    }

    // Erreurs faibles par défaut
    return ErrorHandler.SEVERITY_LEVELS.LOW;
  }

  /**
   * Formate un message d'erreur pour l'utilisateur
   */
  formatUserMessage(error, context = {}) {
    const errorType = this.determineErrorType(error);
    const code = error.code || '';

    const userMessages = {
      // Erreurs de système de fichiers
      'ENOENT': 'Le fichier ou répertoire demandé n\'existe pas',
      'EACCES': 'Accès refusé - permissions insuffisantes',
      'EPERM': 'Opération non autorisée',
      'EISDIR': 'Un répertoire a été trouvé alors qu\'un fichier était attendu',
      'ENOTDIR': 'Un fichier a été trouvé alors qu\'un répertoire était attendu',
      'EMFILE': 'Trop de fichiers ouverts simultanément',
      'ENFILE': 'Limite système de fichiers ouverts atteinte',
      'EBUSY': 'Ressource occupée ou verrouillée',
      'EXDEV': 'Opération entre systèmes de fichiers différents non supportée',

      // Messages par type d'erreur
      [ErrorHandler.ERROR_TYPES.FILE_SYSTEM]: 'Erreur d\'accès au système de fichiers',
      [ErrorHandler.ERROR_TYPES.VALIDATION]: 'Données invalides fournies',
      [ErrorHandler.ERROR_TYPES.CONFIG]: 'Erreur de configuration',
      [ErrorHandler.ERROR_TYPES.PERMISSION]: 'Permissions insuffisantes',
      [ErrorHandler.ERROR_TYPES.TIMEOUT]: 'Opération interrompue - délai dépassé',
      [ErrorHandler.ERROR_TYPES.MEMORY]: 'Mémoire insuffisante',
      [ErrorHandler.ERROR_TYPES.UNKNOWN]: 'Erreur inconnue'
    };

    // Prioriser le message par code d'erreur
    if (code && userMessages[code]) {
      return userMessages[code];
    }

    // Sinon utiliser le message par type
    if (userMessages[errorType]) {
      return userMessages[errorType];
    }

    // Fallback vers le message original si disponible
    return error.message || 'Une erreur inattendue s\'est produite';
  }

  /**
   * Suggère des solutions pour résoudre l'erreur
   */
  suggestSolutions(error, context = {}) {
    const errorType = this.determineErrorType(error);
    const code = error.code || '';

    const solutions = {
      'ENOENT': [
        'Vérifiez que le chemin spécifié existe',
        'Assurez-vous que l\'orthographe du chemin est correcte',
        'Vérifiez les permissions du répertoire parent'
      ],
      'EACCES': [
        'Exécutez le programme avec des privilèges administrateur',
        'Vérifiez les permissions du fichier/répertoire',
        'Assurez-vous que le fichier n\'est pas ouvert dans un autre programme'
      ],
      'EPERM': [
        'Exécutez avec des privilèges élevés',
        'Vérifiez que le fichier n\'est pas en lecture seule',
        'Fermez les programmes qui pourraient utiliser le fichier'
      ],
      'EMFILE': [
        'Fermez des fichiers inutilisés',
        'Redémarrez l\'application',
        'Augmentez la limite système de fichiers ouverts'
      ],
      [ErrorHandler.ERROR_TYPES.MEMORY]: [
        'Fermez d\'autres applications pour libérer de la mémoire',
        'Réduisez la taille des données à traiter',
        'Redémarrez l\'application'
      ],
      [ErrorHandler.ERROR_TYPES.TIMEOUT]: [
        'Réessayez l\'opération',
        'Vérifiez la connectivité réseau',
        'Augmentez le délai d\'attente dans la configuration'
      ]
    };

    if (code && solutions[code]) {
      return solutions[code];
    }

    if (solutions[errorType]) {
      return solutions[errorType];
    }

    return [
      'Vérifiez les logs pour plus de détails',
      'Redémarrez l\'application',
      'Contactez le support technique si le problème persiste'
    ];
  }

  /**
   * Enregistre une erreur dans l'historique
   */
  logError(error, context = {}) {
    const errorType = this.determineErrorType(error);
    const severity = this.determineSeverity(error, context);
    
    const errorEntry = {
      timestamp: new Date(),
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack
      },
      type: errorType,
      severity,
      context,
      userMessage: this.formatUserMessage(error, context),
      solutions: this.suggestSolutions(error, context)
    };

    // Ajouter à l'historique
    this.errorHistory.unshift(errorEntry);
    
    // Limiter la taille de l'historique
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }

    // Compter par type
    this.errorCounts.set(errorType, (this.errorCounts.get(errorType) || 0) + 1);

    return errorEntry;
  }

  /**
   * Crée une erreur enrichie avec contexte
   */
  createEnrichedError(originalError, context = {}) {
    const errorEntry = this.logError(originalError, context);
    
    const enrichedError = new Error(errorEntry.userMessage);
    enrichedError.originalError = originalError;
    enrichedError.type = errorEntry.type;
    enrichedError.severity = errorEntry.severity;
    enrichedError.solutions = errorEntry.solutions;
    enrichedError.context = context;
    enrichedError.timestamp = errorEntry.timestamp;

    return enrichedError;
  }

  /**
   * Gère une erreur de façon centralisée
   */
  handleError(error, context = {}, options = {}) {
    const {
      throwError = false,
      logToConsole = true,
      returnDetails = false
    } = options;

    const errorEntry = this.logError(error, context);

    if (logToConsole) {
      this.logToConsole(errorEntry);
    }

    if (throwError) {
      throw this.createEnrichedError(error, context);
    }

    if (returnDetails) {
      return errorEntry;
    }

    return {
      success: false,
      error: errorEntry.userMessage,
      solutions: errorEntry.solutions
    };
  }

  /**
   * Affiche l'erreur dans la console
   */
  logToConsole(errorEntry) {
    const { severity, userMessage, solutions, error } = errorEntry;
    
    const severityColors = {
      [ErrorHandler.SEVERITY_LEVELS.LOW]: '\x1b[36m',      // Cyan
      [ErrorHandler.SEVERITY_LEVELS.MEDIUM]: '\x1b[33m',   // Jaune
      [ErrorHandler.SEVERITY_LEVELS.HIGH]: '\x1b[31m',     // Rouge
      [ErrorHandler.SEVERITY_LEVELS.CRITICAL]: '\x1b[35m'  // Magenta
    };

    const reset = '\x1b[0m';
    const color = severityColors[severity] || '';
    
    console.error(`${color}[${severity.toUpperCase()}] ${userMessage}${reset}`);
    
    if (error.code) {
      console.error(`Code d'erreur: ${error.code}`);
    }
    
    if (solutions.length > 0) {
      console.error('Solutions suggérées:');
      solutions.forEach((solution, index) => {
        console.error(`  ${index + 1}. ${solution}`);
      });
    }
  }

  /**
   * Obtient les statistiques d'erreurs
   */
  getErrorStats() {
    const total = this.errorHistory.length;
    const byType = Object.fromEntries(this.errorCounts);
    const bySeverity = {};

    this.errorHistory.forEach(entry => {
      bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
    });

    const recent = this.errorHistory
      .filter(entry => Date.now() - entry.timestamp.getTime() < 60000) // Dernière minute
      .length;

    return {
      total,
      recent,
      byType,
      bySeverity,
      lastError: this.errorHistory[0] || null
    };
  }

  /**
   * Réinitialise les statistiques
   */
  reset() {
    this.errorHistory = [];
    this.errorCounts.clear();
  }

  /**
   * Exporte l'historique des erreurs
   */
  exportErrorHistory(format = 'json') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(this.errorHistory, null, 2);
      
      case 'text':
        return this.errorHistory.map(entry => {
          const time = entry.timestamp.toLocaleString();
          return `[${time}] ${entry.severity.toUpperCase()}: ${entry.userMessage}`;
        }).join('\n');
      
      default:
        throw new Error(`Format non supporté: ${format}`);
    }
  }
}

module.exports = ErrorHandler;
