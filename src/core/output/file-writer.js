/**
 * Gestionnaire d'écriture de fichiers
 * Responsabilité unique : sauvegarde sécurisée de contenu
 */

const fs = require('fs');
const path = require('path');

class FileWriter {
  constructor() {
    this.encoding = 'utf8';
    this.backupEnabled = true;
    this.lastWritten = null;
  }

  /**
   * Configure l'encodage par défaut
   */
  setEncoding(encoding) {
    this.encoding = encoding;
    return this;
  }

  /**
   * Active ou désactive les sauvegardes automatiques
   */
  setBackupEnabled(enabled) {
    this.backupEnabled = enabled;
    return this;
  }

  /**
   * Vérifie si un fichier existe
   */
  fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Crée le répertoire parent si nécessaire
   */
  ensureDirectoryExists(filePath) {
    const directory = path.dirname(filePath);
    
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  /**
   * Crée une sauvegarde du fichier existant
   */
  createBackup(filePath) {
    if (!this.backupEnabled || !this.fileExists(filePath)) {
      return null;
    }
    
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .substring(0, 19);
    
    const backupPath = `${filePath}.backup_${timestamp}`;
    
    try {
      fs.copyFileSync(filePath, backupPath);
      return backupPath;
    } catch (error) {
      console.warn('Impossible de créer la sauvegarde:', error.message);
      return null;
    }
  }

  /**
   * Écrit du contenu dans un fichier de façon sécurisée
   */
  writeFile(filePath, content, options = {}) {
    const {
      encoding = this.encoding,
      createBackup = this.backupEnabled,
      atomic = true
    } = options;
    
    try {
      // S'assurer que le répertoire existe
      this.ensureDirectoryExists(filePath);
      
      // Créer une sauvegarde si demandé
      let backupPath = null;
      if (createBackup) {
        backupPath = this.createBackup(filePath);
      }
      
      // Écriture atomique via fichier temporaire
      if (atomic) {
        const tempPath = `${filePath}.tmp_${Date.now()}`;
        
        try {
          fs.writeFileSync(tempPath, content, { encoding });
          fs.renameSync(tempPath, filePath);
        } catch (error) {
          // Nettoyer le fichier temporaire en cas d'erreur
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
          throw error;
        }
      } else {
        // Écriture directe
        fs.writeFileSync(filePath, content, { encoding });
      }
      
      this.lastWritten = {
        path: filePath,
        timestamp: new Date(),
        size: Buffer.byteLength(content, encoding),
        backup: backupPath
      };
      
      return {
        success: true,
        path: filePath,
        size: this.lastWritten.size,
        backup: backupPath
      };
      
    } catch (error) {
      return {
        success: false,
        path: filePath,
        error: error.message
      };
    }
  }

  /**
   * Ajoute du contenu à la fin d'un fichier
   */
  appendToFile(filePath, content, options = {}) {
    const {
      encoding = this.encoding,
      newline = '\n'
    } = options;
    
    try {
      this.ensureDirectoryExists(filePath);
      
      let separator = '';
      if (this.fileExists(filePath)) {
        // Ajouter un saut de ligne si le fichier n'est pas vide
        const stats = fs.statSync(filePath);
        if (stats.size > 0) {
          separator = newline;
        }
      }
      
      fs.appendFileSync(filePath, separator + content, { encoding });
      
      return {
        success: true,
        path: filePath,
        appended: true
      };
      
    } catch (error) {
      return {
        success: false,
        path: filePath,
        error: error.message
      };
    }
  }

  /**
   * Écrit plusieurs fichiers en une opération
   */
  writeMultipleFiles(files, options = {}) {
    const results = [];
    
    for (const { path: filePath, content, options: fileOptions } of files) {
      const result = this.writeFile(filePath, content, {
        ...options,
        ...fileOptions
      });
      results.push(result);
      
      // Arrêter en cas d'erreur si demandé
      if (!result.success && options.stopOnError) {
        break;
      }
    }
    
    return {
      results,
      success: results.every(r => r.success),
      written: results.filter(r => r.success).length,
      total: files.length
    };
  }

  /**
   * Obtient des informations sur la dernière écriture
   */
  getLastWrittenInfo() {
    return this.lastWritten;
  }

  /**
   * Valide si un chemin est sûr pour l'écriture
   */
  validatePath(filePath) {
    try {
      const resolved = path.resolve(filePath);
      const normalized = path.normalize(resolved);
      
      // Vérifications de sécurité de base
      if (normalized.includes('..')) {
        return { valid: false, reason: 'Chemin contient des références parent (..)' };
      }
      
      if (normalized.length > 260) {
        return { valid: false, reason: 'Chemin trop long' };
      }
      
      return { valid: true, normalized };
      
    } catch (error) {
      return { valid: false, reason: error.message };
    }
  }

  /**
   * Nettoie les anciens fichiers de sauvegarde
   */
  cleanupBackups(directory, maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 jours par défaut
    try {
      const files = fs.readdirSync(directory);
      const backupFiles = files.filter(file => file.includes('.backup_'));
      const cutoffDate = Date.now() - maxAge;
      
      let cleaned = 0;
      
      backupFiles.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffDate) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      });
      
      return { cleaned, total: backupFiles.length };
      
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = FileWriter;
