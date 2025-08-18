/**
 * Gestionnaire de système de fichiers
 * Responsabilité unique : opérations bas niveau sur le système de fichiers
 */

const fs = require('fs');
const path = require('path');

class FileSystemManager {
  constructor() {
    this.stats = {
      reads: 0,
      writes: 0,
      scans: 0,
      errors: 0
    };
  }

  /**
   * Lit le contenu d'un répertoire de façon sécurisée
   */
  async readDirectory(dirPath) {
    try {
      this.stats.reads++;
      const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
      
      return {
        success: true,
        items: items.map(item => ({
          name: item.name,
          isDirectory: item.isDirectory(),
          isFile: item.isFile(),
          isSymlink: item.isSymbolicLink(),
          path: path.join(dirPath, item.name)
        }))
      };
    } catch (error) {
      this.stats.errors++;
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Obtient les statistiques d'un fichier ou répertoire
   */
  async getStats(itemPath) {
    try {
      this.stats.reads++;
      const stats = await fs.promises.stat(itemPath);
      
      return {
        success: true,
        stats: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          accessed: stats.atime,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          mode: stats.mode,
          uid: stats.uid,
          gid: stats.gid
        }
      };
    } catch (error) {
      this.stats.errors++;
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Vérifie l'existence et l'accessibilité d'un chemin
   */
  async checkAccess(itemPath, mode = fs.constants.F_OK) {
    try {
      await fs.promises.access(itemPath, mode);
      return {
        success: true,
        accessible: true,
        exists: true
      };
    } catch (error) {
      return {
        success: true,
        accessible: false,
        exists: error.code !== 'ENOENT',
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Résout un chemin en chemin absolu
   */
  resolvePath(inputPath) {
    try {
      const resolved = path.resolve(inputPath);
      const normalized = path.normalize(resolved);
      
      return {
        success: true,
        original: inputPath,
        resolved: normalized,
        dirname: path.dirname(normalized),
        basename: path.basename(normalized),
        extname: path.extname(normalized)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        original: inputPath
      };
    }
  }

  /**
   * Analyse un chemin et retourne ses composants
   */
  analyzePath(itemPath) {
    const parsed = path.parse(itemPath);
    const resolved = this.resolvePath(itemPath);
    
    return {
      ...resolved,
      parsed: {
        root: parsed.root,
        dir: parsed.dir,
        base: parsed.base,
        name: parsed.name,
        ext: parsed.ext
      },
      isAbsolute: path.isAbsolute(itemPath),
      platform: process.platform,
      separator: path.sep
    };
  }

  /**
   * Scanne un répertoire de façon récursive
   */
  async scanRecursive(startPath, options = {}) {
    const {
      maxDepth = Infinity,
      includeStats = false,
      followSymlinks = false,
      filter = null
    } = options;

    this.stats.scans++;
    const results = {
      files: [],
      directories: [],
      errors: [],
      totalScanned: 0
    };

    const scanLevel = async (currentPath, currentDepth = 0) => {
      if (currentDepth > maxDepth) return;

      const readResult = await this.readDirectory(currentPath);
      
      if (!readResult.success) {
        results.errors.push({
          path: currentPath,
          error: readResult.error,
          code: readResult.code
        });
        return;
      }

      for (const item of readResult.items) {
        results.totalScanned++;

        // Appliquer le filtre si défini
        if (filter && !filter(item)) {
          continue;
        }

        const itemData = {
          name: item.name,
          path: item.path,
          relativePath: path.relative(startPath, item.path),
          depth: currentDepth + 1
        };

        // Ajouter les stats si demandé
        if (includeStats) {
          const statsResult = await this.getStats(item.path);
          if (statsResult.success) {
            itemData.stats = statsResult.stats;
          }
        }

        if (item.isDirectory) {
          results.directories.push(itemData);
          // Récursion pour les sous-répertoires
          await scanLevel(item.path, currentDepth + 1);
        } else if (item.isFile) {
          results.files.push(itemData);
        } else if (item.isSymlink && followSymlinks) {
          // Gérer les liens symboliques si demandé
          const target = await this.resolveSymlink(item.path);
          if (target.success) {
            itemData.symlinkTarget = target.target;
            if (target.isDirectory) {
              results.directories.push(itemData);
              await scanLevel(target.target, currentDepth + 1);
            } else {
              results.files.push(itemData);
            }
          }
        }
      }
    };

    await scanLevel(startPath);
    return results;
  }

  /**
   * Résout un lien symbolique
   */
  async resolveSymlink(symlinkPath) {
    try {
      const target = await fs.promises.readlink(symlinkPath);
      const absoluteTarget = path.resolve(path.dirname(symlinkPath), target);
      const stats = await this.getStats(absoluteTarget);
      
      return {
        success: true,
        target: absoluteTarget,
        isDirectory: stats.success && stats.stats.isDirectory,
        isFile: stats.success && stats.stats.isFile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Trouve les fichiers correspondant à un motif
   */
  async findFiles(startPath, pattern, options = {}) {
    const {
      caseSensitive = false,
      matchDirs = false,
      maxResults = Infinity
    } = options;

    const isRegex = pattern instanceof RegExp;
    const testPattern = isRegex ? pattern : new RegExp(
      pattern.replace(/\*/g, '.*').replace(/\?/g, '.'),
      caseSensitive ? '' : 'i'
    );

    const scanResults = await this.scanRecursive(startPath, {
      filter: (item) => {
        if (!matchDirs && item.isDirectory) return false;
        return testPattern.test(item.name);
      }
    });

    const matches = [
      ...scanResults.files,
      ...(matchDirs ? scanResults.directories : [])
    ].slice(0, maxResults);

    return {
      matches,
      total: matches.length,
      truncated: matches.length >= maxResults,
      errors: scanResults.errors
    };
  }

  /**
   * Obtient un résumé des opérations effectuées
   */
  getOperationStats() {
    return {
      ...this.stats,
      total: this.stats.reads + this.stats.writes + this.stats.scans
    };
  }

  /**
   * Remet à zéro les statistiques
   */
  resetStats() {
    this.stats = {
      reads: 0,
      writes: 0,
      scans: 0,
      errors: 0
    };
  }

  /**
   * Valide qu'un chemin est sécurisé
   */
  validateSecurePath(inputPath) {
    try {
      const resolved = path.resolve(inputPath);
      
      // Vérifications de sécurité
      const checks = {
        hasParentReference: resolved.includes('..'),
        tooLong: resolved.length > 260,
        hasInvalidChars: /[<>:"|?*]/.test(resolved),
        isEmpty: !resolved.trim()
      };
      
      const isSecure = !Object.values(checks).some(check => check);
      
      return {
        isSecure,
        path: resolved,
        checks,
        warnings: Object.entries(checks)
          .filter(([_, failed]) => failed)
          .map(([check, _]) => check)
      };
    } catch (error) {
      return {
        isSecure: false,
        error: error.message,
        checks: { invalid: true }
      };
    }
  }
}

module.exports = FileSystemManager;
