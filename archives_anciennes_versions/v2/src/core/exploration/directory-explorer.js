/**
 * Explorateur de répertoires récursif
 * Responsabilité unique : exploration du système de fichiers
 */

const fs = require('fs');
const ExclusionFilter = require('./exclusion-filter');
const PathResolver = require('./path-resolver');

class DirectoryExplorer {
  constructor() {
    this.exclusionFilter = new ExclusionFilter();
  }

  /**
   * Explore récursivement un répertoire
   */
  explore(dirPath, relativePath = '', scriptName, exeName, outputFileName) {
    const results = { dirs: [], files: [] };
    
    try {
      const entries = fs.readdirSync(dirPath);
      
      for (const name of entries) {
        // Évite les fichiers système et notre propre script/exe
        if (this.exclusionFilter.shouldExcludeFile(name, scriptName, exeName, outputFileName)) {
          continue;
        }
        
        const fullPath = PathResolver.buildFullPath(dirPath, name);
        const relativeItemPath = PathResolver.buildRelativePath(relativePath, name);
        
        try {
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            this._processDirectory(name, fullPath, relativeItemPath, results, scriptName, exeName, outputFileName);
          } else if (stats.isFile()) {
            this._processFile(relativeItemPath, results);
          }
        } catch (error) {
          console.log(`⚠️ Accès refusé: ${relativeItemPath || name}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Erreur lors de l'exploration de ${dirPath}: ${error.message}`);
    }
    
    return results;
  }

  /**
   * Traite un dossier trouvé
   */
  _processDirectory(name, fullPath, relativeItemPath, results, scriptName, exeName, outputFileName) {
    // Évite les dossiers système/cachés
    if (!this.exclusionFilter.shouldExcludeDirectory(name)) {
      results.dirs.push(relativeItemPath || name);
      
      // Exploration récursive du sous-dossier
      const subResults = this.explore(fullPath, relativeItemPath, scriptName, exeName, outputFileName);
      results.dirs.push(...subResults.dirs);
      results.files.push(...subResults.files);
    }
  }

  /**
   * Traite un fichier trouvé
   */
  _processFile(relativeItemPath, results) {
    results.files.push(relativeItemPath);
  }
}

module.exports = DirectoryExplorer;
