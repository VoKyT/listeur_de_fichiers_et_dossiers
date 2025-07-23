/**
 * Calculateur de compteurs pour dossiers et fichiers
 * Responsabilité unique : calculs statistiques des éléments
 */

const PathResolver = require('../exploration/path-resolver');

class CounterCalculator {
  /**
   * Compte les éléments directs dans un chemin donné
   */
  static countDirectElements(items, targetPath) {
    const normalizedTarget = PathResolver.normalize(targetPath);
    return items.filter(item => {
      const normalized = PathResolver.normalize(item);
      if (normalizedTarget === '') {
        return PathResolver.isRootLevel(normalized);
      }
      return PathResolver.isDirectChild(item, targetPath);
    }).length;
  }

  /**
   * Construit le message de compteur formaté
   */
  static buildCounterMessage(dirCount, fileCount) {
    const counterParts = [];
    if (dirCount > 0) counterParts.push(`${dirCount} dossier${dirCount > 1 ? 's' : ''}`);
    if (fileCount > 0) counterParts.push(`${fileCount} fichier${fileCount > 1 ? 's' : ''}`);
    return counterParts.length ? ` (${counterParts.join(' - ')})` : '';
  }

  /**
   * Calcule les statistiques pour un dossier spécifique
   */
  static calculateFolderStats(allDirs, allFiles, folderPath) {
    const fileCount = this.countDirectElements(allFiles, folderPath);
    const dirCount = this.countDirectElements(allDirs, folderPath);
    return {
      fileCount,
      dirCount,
      message: this.buildCounterMessage(dirCount, fileCount)
    };
  }

  /**
   * Calcule les statistiques racine
   */
  static calculateRootStats(dirs, files) {
    const rootFiles = files.filter(file => 
      !file.includes('/') && !file.includes('\\')
    ).length;
    const rootDirs = dirs.filter(dir => 
      !dir.includes('/') && !dir.includes('\\')
    ).length;
    
    return {
      rootFiles,
      rootDirs,
      message: this.buildCounterMessage(rootDirs, rootFiles)
    };
  }
}

module.exports = CounterCalculator;
