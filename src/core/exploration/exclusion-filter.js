/**
 * Filtre d'exclusion pour l'exploration de fichiers
 * Responsabilité unique : déterminer quels éléments exclure
 */

class ExclusionFilter {
  constructor() {
    this.excludedDirs = new Set(['.git', 'node_modules', '$RECYCLE.BIN']);
    this.excludedFiles = new Set();
  }

  /**
   * Vérifie si un dossier doit être exclu
   */
  shouldExcludeDirectory(dirName) {
    return dirName.startsWith('.') || this.excludedDirs.has(dirName);
  }

  /**
   * Vérifie si un fichier doit être exclu
   */
  shouldExcludeFile(fileName, scriptName, exeName, outputFileName) {
    return fileName === scriptName || 
           fileName === exeName || 
           fileName === outputFileName ||
           this.excludedFiles.has(fileName);
  }

  /**
   * Ajoute un dossier à la liste d'exclusion
   */
  addExcludedDirectory(dirName) {
    this.excludedDirs.add(dirName);
  }

  /**
   * Ajoute un fichier à la liste d'exclusion
   */
  addExcludedFile(fileName) {
    this.excludedFiles.add(fileName);
  }
}

module.exports = ExclusionFilter;
