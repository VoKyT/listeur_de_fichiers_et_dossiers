/**
 * Utilitaires de validation et de vérification
 * Responsabilité unique : validation de données et paramètres
 */

class ValidationUtils {
  /**
   * Valide un chemin de fichier/répertoire
   */
  static validatePath(path) {
    if (!path || typeof path !== 'string') {
      return {
        isValid: false,
        error: 'Le chemin doit être une chaîne non vide'
      };
    }

    const trimmedPath = path.trim();
    
    if (trimmedPath.length === 0) {
      return {
        isValid: false,
        error: 'Le chemin ne peut pas être vide'
      };
    }

    // Caractères interdits sur Windows
    if (process.platform === 'win32') {
      // On exclut les deux-points valides des lecteurs Windows (C:, D:, etc.)
      const pathWithoutDrive = trimmedPath.replace(/^[A-Za-z]:/, '');
      const invalidChars = /[<>:"|?*]/;
      if (invalidChars.test(pathWithoutDrive)) {
        return {
          isValid: false,
          error: 'Le chemin contient des caractères invalides'
        };
      }
    }

    // Vérifier la longueur maximale
    if (trimmedPath.length > 260) {
      return {
        isValid: false,
        error: 'Le chemin est trop long (max 260 caractères)'
      };
    }

    return {
      isValid: true,
      normalizedPath: trimmedPath
    };
  }

  /**
   * Valide un nom de fichier
   */
  static validateFileName(fileName) {
    if (!fileName || typeof fileName !== 'string') {
      return {
        isValid: false,
        error: 'Le nom de fichier doit être une chaîne non vide'
      };
    }

    const trimmed = fileName.trim();
    
    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Le nom de fichier ne peut pas être vide'
      };
    }

    // Caractères interdits
    const invalidChars = process.platform === 'win32' 
      ? /[<>:"/\\|?*\x00-\x1f]/
      : /[/\x00]/;
    
    if (invalidChars.test(trimmed)) {
      return {
        isValid: false,
        error: 'Le nom de fichier contient des caractères invalides'
      };
    }

    // Noms réservés sur Windows
    if (process.platform === 'win32') {
      const reserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
      if (reserved.test(trimmed)) {
        return {
          isValid: false,
          error: 'Nom de fichier réservé sur Windows'
        };
      }
    }

    // Longueur maximale
    if (trimmed.length > 255) {
      return {
        isValid: false,
        error: 'Le nom de fichier est trop long (max 255 caractères)'
      };
    }

    return {
      isValid: true,
      normalizedName: trimmed
    };
  }

  /**
   * Valide une configuration d'exploration
   */
  static validateExplorationConfig(config) {
    const errors = [];
    const warnings = [];

    if (!config || typeof config !== 'object') {
      return {
        isValid: false,
        errors: ['La configuration doit être un objet']
      };
    }

    // Valider maxDepth
    if (config.maxDepth !== undefined) {
      if (!Number.isInteger(config.maxDepth) || config.maxDepth < 1) {
        errors.push('maxDepth doit être un entier >= 1');
      } else if (config.maxDepth > 50) {
        warnings.push('maxDepth très élevé, peut impacter les performances');
      }
    }

    // Valider les exclusions
    if (config.excludedDirs && !Array.isArray(config.excludedDirs)) {
      errors.push('excludedDirs doit être un tableau');
    }

    if (config.excludedExtensions && !Array.isArray(config.excludedExtensions)) {
      errors.push('excludedExtensions doit être un tableau');
    }

    if (config.excludedFiles && !Array.isArray(config.excludedFiles)) {
      errors.push('excludedFiles doit être un tableau');
    }

    // Valider les booléens
    const booleanFields = ['followSymlinks', 'includeHidden', 'caseSensitive'];
    booleanFields.forEach(field => {
      if (config[field] !== undefined && typeof config[field] !== 'boolean') {
        errors.push(`${field} doit être un booléen`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valide une extension de fichier
   */
  static validateFileExtension(extension) {
    if (!extension || typeof extension !== 'string') {
      return {
        isValid: false,
        error: 'L\'extension doit être une chaîne non vide'
      };
    }

    let normalized = extension.trim();
    
    // Ajouter le point si manquant
    if (!normalized.startsWith('.')) {
      normalized = '.' + normalized;
    }

    // Vérifier le format
    if (!/^\.[a-zA-Z0-9]+$/.test(normalized)) {
      return {
        isValid: false,
        error: 'Format d\'extension invalide'
      };
    }

    return {
      isValid: true,
      normalizedExtension: normalized.toLowerCase()
    };
  }

  /**
   * Valide un motif de filtre
   */
  static validateFilterPattern(pattern) {
    if (!pattern || typeof pattern !== 'string') {
      return {
        isValid: false,
        error: 'Le motif doit être une chaîne non vide'
      };
    }

    try {
      // Tenter de créer une regex depuis le motif
      const regexPattern = pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Échapper les caractères spéciaux
        .replace(/\*/g, '.*') // * devient .*
        .replace(/\?/g, '.'); // ? devient .

      new RegExp(regexPattern);

      return {
        isValid: true,
        regexPattern
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Motif invalide: ' + error.message
      };
    }
  }

  /**
   * Valide des limites numériques
   */
  static validateNumericLimits(limits) {
    const errors = [];
    
    if (!limits || typeof limits !== 'object') {
      return {
        isValid: false,
        errors: ['Les limites doivent être un objet']
      };
    }

    const numericFields = {
      maxFiles: { min: 1, max: 1000000 },
      maxDirectories: { min: 1, max: 100000 },
      maxDepth: { min: 1, max: 100 },
      timeoutMs: { min: 1000, max: 300000 }
    };

    Object.entries(numericFields).forEach(([field, { min, max }]) => {
      if (limits[field] !== undefined) {
        const value = limits[field];
        
        if (!Number.isInteger(value)) {
          errors.push(`${field} doit être un entier`);
        } else if (value < min) {
          errors.push(`${field} doit être >= ${min}`);
        } else if (value > max) {
          errors.push(`${field} doit être <= ${max}`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un niveau de log
   */
  static validateLogLevel(level) {
    const validLevels = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];
    
    if (!level || typeof level !== 'string') {
      return {
        isValid: false,
        error: 'Le niveau doit être une chaîne'
      };
    }

    const normalized = level.toLowerCase();
    
    if (!validLevels.includes(normalized)) {
      return {
        isValid: false,
        error: `Niveau invalide. Doit être: ${validLevels.join(', ')}`
      };
    }

    return {
      isValid: true,
      normalizedLevel: normalized
    };
  }

  /**
   * Valide des options de formatage
   */
  static validateFormatOptions(options) {
    const errors = [];
    const warnings = [];

    if (!options || typeof options !== 'object') {
      return {
        isValid: false,
        errors: ['Les options doivent être un objet']
      };
    }

    // Valider maxLineLength
    if (options.maxLineLength !== undefined) {
      if (!Number.isInteger(options.maxLineLength) || options.maxLineLength < 10) {
        errors.push('maxLineLength doit être un entier >= 10');
      } else if (options.maxLineLength > 1000) {
        warnings.push('maxLineLength très élevé');
      }
    }

    // Valider les booléens
    const booleanFields = ['truncateNames', 'showExtensions', 'colorOutput'];
    booleanFields.forEach(field => {
      if (options[field] !== undefined && typeof options[field] !== 'boolean') {
        errors.push(`${field} doit être un booléen`);
      }
    });

    // Valider indent
    if (options.indent !== undefined) {
      if (typeof options.indent !== 'string') {
        errors.push('indent doit être une chaîne');
      } else if (options.indent.length > 10) {
        warnings.push('indent très long');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valide un objet complet
   */
  static validateObject(obj, schema) {
    const errors = [];
    
    if (!obj || typeof obj !== 'object') {
      return {
        isValid: false,
        errors: ['L\'objet doit être défini']
      };
    }

    if (!schema || typeof schema !== 'object') {
      return {
        isValid: false,
        errors: ['Le schéma doit être défini']
      };
    }

    // Valider chaque champ du schéma
    Object.entries(schema).forEach(([field, rules]) => {
      const value = obj[field];
      
      // Champ requis
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`Le champ '${field}' est requis`);
        return;
      }

      // Type
      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`Le champ '${field}' doit être de type ${rules.type}`);
        return;
      }

      // Validateur personnalisé
      if (value !== undefined && rules.validator) {
        const result = rules.validator(value);
        if (!result.isValid) {
          errors.push(`${field}: ${result.error}`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Nettoie et normalise une chaîne
   */
  static sanitizeString(str, options = {}) {
    if (typeof str !== 'string') {
      return '';
    }

    const {
      trim = true,
      removeExtraSpaces = true,
      maxLength = null
    } = options;

    let result = str;

    if (trim) {
      result = result.trim();
    }

    if (removeExtraSpaces) {
      result = result.replace(/\s+/g, ' ');
    }

    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }

    return result;
  }
}

module.exports = ValidationUtils;
