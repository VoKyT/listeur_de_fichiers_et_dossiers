/**
 * Gestionnaire de configuration dynamique
 * Responsabilité unique : chargement et gestion de la configuration
 */

const fs = require('fs');
const path = require('path');
const DefaultConfig = require('./default-config');

class ConfigManager {
  constructor() {
    this.config = DefaultConfig.getFullConfig();
    this.configFile = null;
    this.loadHistory = [];
    this.watchers = new Map();
  }

  /**
   * Charge la configuration depuis un fichier
   */
  async loadFromFile(configPath) {
    try {
      const absolutePath = path.resolve(configPath);
      
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Fichier de configuration non trouvé: ${absolutePath}`);
      }

      const configContent = fs.readFileSync(absolutePath, 'utf8');
      let parsedConfig;

      // Support de différents formats
      const ext = path.extname(absolutePath).toLowerCase();
      switch (ext) {
        case '.json':
          parsedConfig = JSON.parse(configContent);
          break;
        case '.js':
          // Réinitialiser le cache require
          delete require.cache[require.resolve(absolutePath)];
          parsedConfig = require(absolutePath);
          break;
        default:
          throw new Error(`Format de configuration non supporté: ${ext}`);
      }

      // Valider la configuration
      const validation = DefaultConfig.validateConfig(parsedConfig);
      if (!validation.isValid) {
        throw new Error(`Configuration invalide: ${validation.errors.join(', ')}`);
      }

      // Fusionner avec la configuration par défaut
      this.config = DefaultConfig.mergeConfig(parsedConfig);
      this.configFile = absolutePath;

      // Enregistrer dans l'historique
      this.loadHistory.push({
        timestamp: new Date(),
        file: absolutePath,
        success: true,
        warnings: validation.warnings
      });

      return {
        success: true,
        config: this.config,
        warnings: validation.warnings
      };

    } catch (error) {
      this.loadHistory.push({
        timestamp: new Date(),
        file: configPath,
        success: false,
        error: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sauvegarde la configuration actuelle dans un fichier
   */
  async saveToFile(filePath, format = 'json') {
    try {
      const absolutePath = path.resolve(filePath);
      const dir = path.dirname(absolutePath);

      // Créer le répertoire si nécessaire
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let content;
      switch (format.toLowerCase()) {
        case 'json':
          content = JSON.stringify(this.config, null, 2);
          break;
        case 'js':
          content = `module.exports = ${JSON.stringify(this.config, null, 2)};`;
          break;
        default:
          throw new Error(`Format non supporté: ${format}`);
      }

      fs.writeFileSync(absolutePath, content, 'utf8');

      return {
        success: true,
        file: absolutePath,
        format
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Met à jour une section de la configuration
   */
  updateSection(sectionName, newValues) {
    if (!this.config[sectionName]) {
      throw new Error(`Section inconnue: ${sectionName}`);
    }

    // Deep merge de la section
    this.config[sectionName] = {
      ...this.config[sectionName],
      ...newValues
    };

    return this.config[sectionName];
  }

  /**
   * Met à jour une valeur spécifique par chemin
   */
  updateValue(keyPath, value) {
    const keys = keyPath.split('.');
    let current = this.config;

    // Naviguer jusqu'à l'avant-dernière clé
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    // Mettre à jour la valeur finale
    current[keys[keys.length - 1]] = value;

    return value;
  }

  /**
   * Obtient une valeur par chemin
   */
  getValue(keyPath, defaultValue = null) {
    const keys = keyPath.split('.');
    let current = this.config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Obtient la configuration complète
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Obtient une section spécifique
   */
  getSection(sectionName) {
    return this.config[sectionName] ? { ...this.config[sectionName] } : null;
  }

  /**
   * Recharge la configuration depuis le fichier
   */
  async reload() {
    if (!this.configFile) {
      throw new Error('Aucun fichier de configuration à recharger');
    }

    return this.loadFromFile(this.configFile);
  }

  /**
   * Surveille un fichier de configuration pour les changements
   */
  watchConfigFile(filePath, callback) {
    const absolutePath = path.resolve(filePath);
    
    if (this.watchers.has(absolutePath)) {
      return false; // Déjà surveillé
    }

    try {
      const watcher = fs.watchFile(absolutePath, (curr, prev) => {
        if (curr.mtime > prev.mtime) {
          this.loadFromFile(absolutePath).then(result => {
            callback(result);
          }).catch(error => {
            callback({ success: false, error: error.message });
          });
        }
      });

      this.watchers.set(absolutePath, watcher);
      return true;

    } catch (error) {
      return false;
    }
  }

  /**
   * Arrête la surveillance d'un fichier
   */
  unwatchConfigFile(filePath) {
    const absolutePath = path.resolve(filePath);
    
    if (this.watchers.has(absolutePath)) {
      fs.unwatchFile(absolutePath);
      this.watchers.delete(absolutePath);
      return true;
    }
    
    return false;
  }

  /**
   * Remet la configuration aux valeurs par défaut
   */
  resetToDefaults() {
    this.config = DefaultConfig.getFullConfig();
    this.configFile = null;
    return this.config;
  }

  /**
   * Crée un profil de configuration
   */
  createProfile(name, baseConfig = null) {
    const profileConfig = baseConfig || this.config;
    
    return {
      name,
      created: new Date(),
      config: { ...profileConfig }
    };
  }

  /**
   * Obtient l'historique de chargement
   */
  getLoadHistory() {
    return [...this.loadHistory];
  }

  /**
   * Valide la configuration actuelle
   */
  validateCurrentConfig() {
    return DefaultConfig.validateConfig(this.config);
  }

  /**
   * Génère un rapport de configuration
   */
  generateConfigReport() {
    const validation = this.validateCurrentConfig();
    
    return {
      current: this.config,
      validation,
      file: this.configFile,
      history: this.getLoadHistory(),
      watchers: Array.from(this.watchers.keys()),
      timestamp: new Date()
    };
  }

  /**
   * Nettoie les ressources
   */
  cleanup() {
    // Arrêter tous les watchers
    for (const filePath of this.watchers.keys()) {
      this.unwatchConfigFile(filePath);
    }
    this.watchers.clear();
  }
}

module.exports = ConfigManager;
