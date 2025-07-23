/**
 * Résolveur de chemins pour l'exploration
 * Responsabilité unique : gestion et résolution des chemins
 */

const path = require('path');

class PathResolver {
  /**
   * Normalise un chemin pour la comparaison
   */
  static normalize(filePath) {
    return filePath.replace(/\\/g, '/');
  }

  /**
   * Construit le chemin relatif d'un élément
   */
  static buildRelativePath(relativePath, name) {
    return path.join(relativePath, name);
  }

  /**
   * Construit le chemin complet d'un élément
   */
  static buildFullPath(dirPath, name) {
    return path.join(dirPath, name);
  }

  /**
   * Obtient le nom de base d'un chemin
   */
  static getBaseName(filePath) {
    return path.basename(filePath);
  }

  /**
   * Obtient le chemin relatif entre deux chemins
   */
  static getRelativePath(from, to) {
    return path.relative(from, to);
  }

  /**
   * Vérifie si un chemin est un chemin racine (sans séparateurs)
   */
  static isRootLevel(normalizedPath) {
    return !normalizedPath.includes('/');
  }

  /**
   * Vérifie si un chemin est un enfant direct d'un parent
   */
  static isDirectChild(childPath, parentPath) {
    const normalizedChild = this.normalize(childPath);
    const normalizedParent = this.normalize(parentPath);
    
    if (normalizedParent === '') {
      return this.isRootLevel(normalizedChild);
    }
    
    return normalizedChild.startsWith(normalizedParent + '/') && 
           normalizedChild.replace(normalizedParent + '/', '').indexOf('/') === -1;
  }
}

module.exports = PathResolver;
