/**
 * Constructeur d'arborescence hiérarchique
 * Responsabilité unique : assemblage de l'arborescence complète
 */

const path = require('path');
const CounterCalculator = require('./counter-calculator');
const NumberingFormatter = require('./numbering-formatter');
const PathResolver = require('../exploration/path-resolver');

class TreeBuilder {
  /**
   * Construit l'arborescence hiérarchique complète
   */
  static build(directory, allDirs, allFiles) {
    const outputLines = [];
    this._processDirectory(directory, directory, allDirs, allFiles, outputLines);
    return outputLines;
  }

  /**
   * Traite récursivement un dossier et son contenu
   */
  static _processDirectory(directory, dirPath, allDirs, allFiles, outputLines, indent = '') {
    const relativePath = PathResolver.getRelativePath(directory, dirPath);
    
    // Trouve les enfants directs
    const childDirs = this._getDirectChildren(allDirs, relativePath, directory).toSorted();
    const childFiles = this._getDirectChildren(allFiles, relativePath, directory).toSorted();
    
    const totalItems = childDirs.length + childFiles.length;
    
    // Calcule le formatage des numéros
    const dirDigits = NumberingFormatter.calculateDigits(childDirs.length);
    const fileDigits = NumberingFormatter.calculateDigits(childFiles.length);
    
    // Traite les dossiers en premier
    this._processFolders(childDirs, directory, allDirs, allFiles, outputLines, indent, totalItems, dirDigits);
    
    // Puis traite les fichiers
    this._processFiles(childFiles, outputLines, indent, childDirs.length, totalItems, fileDigits);
  }

  /**
   * Obtient les enfants directs d'un dossier
   */
  static _getDirectChildren(items, relativePath, directory) {
    const normalizedRelative = PathResolver.normalize(relativePath);
    
    return items.filter(item => {
      if (normalizedRelative === '' || normalizedRelative === '.') {
        // Pour la racine, cherche les éléments de niveau 1
        return PathResolver.isRootLevel(PathResolver.normalize(item));
      } else {
        // Pour les autres, cherche les enfants directs
        return PathResolver.isDirectChild(item, relativePath);
      }
    });
  }

  /**
   * Traite et affiche les dossiers
   */
  static _processFolders(childDirs, directory, allDirs, allFiles, outputLines, indent, totalItems, dirDigits) {
    childDirs.forEach((dir, index) => {
      const isLastItem = index === totalItems - 1;
      const dirPrefix = NumberingFormatter.getTreePrefix(isLastItem);
      const fullChildPath = path.join(directory, dir);
      const dirName = PathResolver.getBaseName(dir);
      
      // Calcule les statistiques du dossier
      const relativePath = PathResolver.normalize(PathResolver.getRelativePath(directory, fullChildPath));
      const stats = CounterCalculator.calculateFolderStats(allDirs, allFiles, relativePath);
      
      // Formate le numéro
      const localDirNumber = NumberingFormatter.formatLocalNumber(index, childDirs.length);
      
      // Affiche le dossier
      const line = NumberingFormatter.formatElementLine(
        indent, 
        dirPrefix, 
        localDirNumber, 
        `${dirName}/`, 
        stats.message
      );
      outputLines.push(line);
      
      // Récursion pour les sous-dossiers
      const childIndent = NumberingFormatter.getChildIndentation(indent, isLastItem);
      this._processDirectory(directory, fullChildPath, allDirs, allFiles, outputLines, childIndent);
    });
  }

  /**
   * Traite et affiche les fichiers
   */
  static _processFiles(childFiles, outputLines, indent, fileStartIndex, totalItems, fileDigits) {
    childFiles.forEach((file, index) => {
      const fileName = PathResolver.getBaseName(file);
      const itemIndex = fileStartIndex + index;
      const isLastItem = itemIndex === totalItems - 1;
      const prefix = NumberingFormatter.getTreePrefix(isLastItem);
      
      // Formate le numéro
      const localFileNumber = NumberingFormatter.formatLocalNumber(index, childFiles.length);
      
      // Affiche le fichier
      const line = NumberingFormatter.formatElementLine(indent, prefix, localFileNumber, fileName);
      outputLines.push(line);
    });
  }
}

module.exports = TreeBuilder;
