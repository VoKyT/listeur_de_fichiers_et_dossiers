/**
 * Service backend web - Réplique les fonctionnalités Electron en mode web
 * Architecture modulaire utilisant File System Access API
 */

class WebBackendService {
  constructor() {
    this.defaultConfig = {
      exclusions: {
        directories: [
          '.git', '.svn', '.hg', '.bzr',
          'node_modules', '.npm', '.yarn',
          '.vscode', '.vs', '.idea',
          'bin', 'obj', 'build', 'dist',
          '.cache', '.temp', '.tmp',
          '$RECYCLE.BIN', 'System Volume Information'
        ],
        files: [
          '.DS_Store', 'Thumbs.db', 'desktop.ini',
          '*.tmp', '*.temp', '*.log', '*.cache'
        ],
        patterns: [
          /^\./,  // Fichiers cachés commençant par .
          /~$/,   // Fichiers de sauvegarde se terminant par ~
          /\.bak$/i,
          /\.old$/i
        ]
      },
      formatting: {
        useTreeView: true,
        showFileCount: true,
        showDirectoryCount: true,
        maxDepth: 100,
        version: '2.0.1'
      }
    };
    this.startTime = 0;
    this.explorationStats = {
      totalDirectories: 0,
      totalFiles: 0,
      totalItems: 0,
      explorationTime: 0,
      exclusionsApplied: []
    };
  }

  /**
   * Vérifie si un nom doit être exclu
   */
  shouldExclude(name, isDirectory = false) {
    const { exclusions } = this.defaultConfig;
    
    // Vérifier les exclusions spécifiques
    if (isDirectory && exclusions.directories.includes(name)) {
      return true;
    }
    
    if (!isDirectory && exclusions.files.includes(name)) {
      return true;
    }
    
    // Vérifier les patterns
    return exclusions.patterns.some(pattern => pattern.test(name));
  }

  /**
   * Explore récursivement un dossier (équivalent DirectoryExplorer)
   */
  async exploreDirectory(directoryHandle, currentPath = '', depth = 0) {
    if (depth === 0) {
      this.startTime = performance.now();
      this.explorationStats = {
        totalDirectories: 0,
        totalFiles: 0,
        totalItems: 0,
        explorationTime: 0,
        exclusionsApplied: []
      };
    }

    const results = { 
      dirs: [], 
      files: [],
      structure: new Map() // Pour conserver la structure hiérarchique
    };
    
    const { maxDepth } = this.defaultConfig.formatting;
    
    if (depth >= maxDepth) {
      console.warn(`⚠️ Profondeur maximale atteinte (${maxDepth}) pour: ${currentPath}`);
      return results;
    }

    if (depth === 0) {
      console.log(`🚀 Démarrage exploration complète de: ${currentPath || 'ROOT'}`);
    }

    try {
      const entries = [];
      for await (const [name, handle] of directoryHandle.entries()) {
        entries.push({ name, handle });
      }

      // Trier : dossiers d'abord, puis fichiers, par ordre alphabétique
      entries.sort((a, b) => {
        if (a.handle.kind === 'directory' && b.handle.kind !== 'directory') return -1;
        if (a.handle.kind !== 'directory' && b.handle.kind === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });

      const currentStructure = {
        directories: [],
        files: [],
        counts: { dirs: 0, files: 0 }
      };

      for (const { name, handle } of entries) {
        // Vérifier les exclusions
        if (this.shouldExclude(name, handle.kind === 'directory')) {
          if (!this.explorationStats.exclusionsApplied.includes(name)) {
            this.explorationStats.exclusionsApplied.push(name);
          }
          continue;
        }

        const fullPath = currentPath ? `${currentPath}/${name}` : name;

        if (handle.kind === 'directory') {
          this.explorationStats.totalDirectories++;
          results.dirs.push(fullPath);
          currentStructure.directories.push(name);
          currentStructure.counts.dirs++;
          
          // Explorer récursivement
          try {
            console.log(`🔍 Exploration récursive de: ${fullPath} (profondeur: ${depth + 1})`);
            const subResults = await this.exploreDirectory(handle, fullPath, depth + 1);
            results.dirs.push(...subResults.dirs);
            results.files.push(...subResults.files);
            
            // Fusionner les structures
            for (const [key, value] of subResults.structure) {
              results.structure.set(key, value);
            }
            console.log(`✅ Exploration terminée pour: ${fullPath} - ${subResults.dirs.length} dossiers, ${subResults.files.length} fichiers`);
          } catch (error) {
            console.warn(`❌ Accès refusé: ${fullPath}`, error);
          }
        } else {
          this.explorationStats.totalFiles++;
          results.files.push(fullPath);
          currentStructure.files.push(name);
          currentStructure.counts.files++;
        }
      }

      results.structure.set(currentPath || 'ROOT', currentStructure);
      console.log(`📋 Structure enregistrée pour: ${currentPath || 'ROOT'} - ${currentStructure.directories.length} dirs, ${currentStructure.files.length} files`);

    } catch (error) {
      console.error(`Erreur lors de l'exploration de ${currentPath}:`, error);
    }

    if (depth === 0) {
      this.explorationStats.explorationTime = Math.round(performance.now() - this.startTime);
      this.explorationStats.totalItems = this.explorationStats.totalDirectories + this.explorationStats.totalFiles;
      console.log(`🎯 Exploration terminée: ${this.explorationStats.totalDirectories} dossiers, ${this.explorationStats.totalFiles} fichiers (${this.explorationStats.explorationTime}ms)`);
      console.log(`📁 Structure créée avec ${results.structure.size} niveaux`);
    }

    return results;
  }

  /**
   * Génère un rapport de comptage (équivalent ElementCounter)
   */
  generateStats(results) {
    return {
      totalDirectories: this.explorationStats.totalDirectories,
      totalFiles: this.explorationStats.totalFiles,
      totalItems: this.explorationStats.totalItems,
      explorationTime: this.explorationStats.explorationTime,
      excludedItems: this.explorationStats.exclusionsApplied.length,
      exclusions: [...this.explorationStats.exclusionsApplied],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formate en arbre selon la syntaxe exacte désirée
   */
  buildTreeView(results, rootName = 'Dossier sélectionné') {
    const structure = results.structure;
    let output = [];

    // Fonction pour compter récursivement les éléments dans un chemin
    const countElements = (path) => {
      const currentStructure = structure.get(path);
      if (!currentStructure) return { dirs: 0, files: 0 };

      let totalDirs = currentStructure.directories.length;
      let totalFiles = currentStructure.files.length;

      // Compter récursivement dans les sous-dossiers
      currentStructure.directories.forEach(dirName => {
        const fullPath = (path === 'ROOT') ? dirName : (path ? `${path}/${dirName}` : dirName);
        const subCounts = countElements(fullPath);
        totalDirs += subCounts.dirs;
        totalFiles += subCounts.files;
      });

      return { dirs: totalDirs, files: totalFiles };
    };

    // Fonction pour générer l'arbre avec syntaxe précise
    const generateLevel = (path, level = 0, prefix = '') => {
      const currentStructure = structure.get(path);
      if (!currentStructure) {
        console.warn(`⚠️ Structure manquante pour le chemin: ${path}`);
        return;
      }

      console.log(`🔧 Génération niveau ${level} pour: ${path}, ${currentStructure.directories.length} dossiers, ${currentStructure.files.length} fichiers`);

      const totalElements = currentStructure.directories.length + currentStructure.files.length;

      // Traiter les dossiers
      currentStructure.directories.forEach((dirName, index) => {
        const fullPath = (path === 'ROOT') ? dirName : (path ? `${path}/${dirName}` : dirName);
        const isLastElement = index === totalElements - 1;
        const connector = level === 0 ? '' : (isLastElement ? '└── ' : '├── ');
        const nextPrefix = level === 0 ? '' : prefix + (isLastElement ? '    ' : '│   ');
        
        // Obtenir les compteurs DIRECTS (pas récursifs) du dossier
        const subStructure = structure.get(fullPath);
        const directCounts = subStructure ? {
          dirs: subStructure.directories.length,
          files: subStructure.files.length
        } : { dirs: 0, files: 0 };
        
        console.log(`📁 Traitement dossier: ${dirName} (${fullPath}), compteurs directs: ${directCounts.dirs} dirs, ${directCounts.files} files`);
        
        // Afficher le dossier avec compteurs directs seulement
        let dirDisplay = `${prefix}${connector}${index + 1}. ${dirName}/`;
        if (directCounts.dirs > 0 || directCounts.files > 0) {
          const countsDisplay = [];
          if (directCounts.dirs > 0) countsDisplay.push(`${directCounts.dirs} dossier${directCounts.dirs > 1 ? 's' : ''}`);
          if (directCounts.files > 0) countsDisplay.push(`${directCounts.files} fichier${directCounts.files > 1 ? 's' : ''}`);
          dirDisplay += ` (${countsDisplay.join(' - ')})`;
        }
        
        output.push(dirDisplay);
        
        // RÉCURSION pour descendre dans le sous-dossier
        console.log(`🔄 Tentative récursion pour: ${fullPath}`);
        if (structure.has(fullPath)) {
          console.log(`✅ Structure trouvée pour: ${fullPath}, récursion...`);
          generateLevel(fullPath, level + 1, nextPrefix);
        } else {
          console.log(`❌ Aucune structure trouvée pour: ${fullPath}`);
          console.log(`🔍 Structures disponibles:`, Array.from(structure.keys()));
        }
      });
      
      // Traiter les fichiers avec numérotation continue et padding dynamique
      currentStructure.files.forEach((fileName, index) => {
        const globalIndex = currentStructure.directories.length + index;
        const isLastElement = globalIndex === totalElements - 1;
        const connector = level === 0 ? '' : (isLastElement ? '└── ' : '├── ');
        
        // Calculer le padding nécessaire selon le nombre total d'éléments
        const paddingLength = totalElements.toString().length;
        const fileNumber = (globalIndex + 1).toString().padStart(paddingLength, '0');
        
        output.push(`${prefix}${connector}${fileNumber}. ${fileName}`);
      });
    };

    // En-tête formaté avec bordures (comme dans votre exemple)
    const headerLine = '='.repeat(50);
    const title = 'STRUCTURE ARBORESCENTE';
    const titlePadding = Math.floor((headerLine.length - title.length) / 2);
    const titleLine = ' '.repeat(titlePadding) + title + ' '.repeat(headerLine.length - title.length - titlePadding);
    
    output.push(headerLine);
    output.push(titleLine);
    output.push(headerLine);

    // Afficher le dossier racine avec compteurs (format exact)
    const rootCounts = countElements('ROOT');
    const rootCountsDisplay = [];
    if (rootCounts.dirs > 0) rootCountsDisplay.push(`${rootCounts.dirs} dossier${rootCounts.dirs > 1 ? 's' : ''}`);
    if (rootCounts.files > 0) rootCountsDisplay.push(`${rootCounts.files} fichier${rootCounts.files > 1 ? 's' : ''}`);
    
    output.push(`📁 ${rootName}/${rootCountsDisplay.length > 0 ? ` (${rootCountsDisplay.join(' - ')})` : ''}`);
    
    // Générer l'arbre
    generateLevel('ROOT', 0);
    
    return output.join('\n');
  }

  /**
   * Génère un rapport complet professionnel (équivalent ReportGenerator)
   */
  async generateReport(directoryHandle, options = {}) {
    const {
      format = 'tree',
      includeStats = true,
      rootName = 'Dossier sélectionné'
    } = options;

    try {
      // Explorer le dossier
      const results = await this.exploreDirectory(directoryHandle);
      
      // Générer les statistiques
      const stats = this.generateStats(results);
      const now = new Date();
      
      // En-tête professionnel
      let report = `┌${'─'.repeat(78)}┐\n`;
      report += `│${' '.repeat(78)}│\n`;
      report += `│${'📊 RAPPORT COMPLET D\'EXPLORATION RÉCURSIVE'.padStart(57).padEnd(78)}│\n`;
      report += `│${`Version ${this.version} - Générateur de listeur de fichiers`.padStart(60).padEnd(78)}│\n`;
      report += `│${' '.repeat(78)}│\n`;
      report += `└${'─'.repeat(78)}┘\n\n`;
      
      // Informations générales
      report += `📅 Date et heure    : ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}\n`;
      report += `🎯 Dossier analysé  : ${rootName}\n`;
      report += `⏱️  Temps d'exploration : ${stats.explorationTime} ms\n`;
      report += `📏 Profondeur max   : ${this.defaultConfig.formatting.maxDepth} niveaux\n\n`;
      
      // Statistiques principales
      report += `${'═'.repeat(80)}\n`;
      report += `                             📊 STATISTIQUES GLOBALES\n`;
      report += `${'═'.repeat(80)}\n`;
      report += `📁 Nombre de dossiers     : ${stats.totalDirectories.toString().padStart(8)}\n`;
      report += `📄 Nombre de fichiers     : ${stats.totalFiles.toString().padStart(8)}\n`;
      report += `📋 Total des éléments     : ${stats.totalItems.toString().padStart(8)}\n`;
      
      // Section exclusions si nécessaire
      if (stats.excludedItems > 0) {
        report += `\n${'─'.repeat(80)}\n`;
        report += `                          🚫 ÉLÉMENTS EXCLUS DE L'ANALYSE\n`;
        report += `${'─'.repeat(80)}\n`;
        report += `Nombre d'exclusions appliquées : ${stats.excludedItems}\n`;
        report += `Liste des éléments exclus :\n`;
        stats.exclusions.forEach((item, index) => {
          report += `  ${(index + 1).toString().padStart(2)}. ${item}\n`;
        });
      }
      
      // Structure arborescente
      report += `\n${'═'.repeat(80)}\n`;
      report += `                          🌳 STRUCTURE ARBORESCENTE COMPLÈTE\n`;
      report += `${'═'.repeat(80)}\n\n`;
      report += this.buildTreeView(results, rootName);
      
      // Pied de page
      report += `\n\n${'═'.repeat(80)}\n`;
      report += `Rapport généré par le Listeur de Fichiers et Dossiers v${this.version}\n`;
      report += `Exploration terminée avec succès - ${stats.totalItems} éléments analysés\n`;
      report += `${'═'.repeat(80)}\n`;
      
      return {
        success: true,
        content: report,
        stats,
        timestamp: stats.timestamp
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sauvegarde un fichier avec File System Access API
   */
  async saveFile(content, defaultName = 'liste_fichiers.txt') {
    try {
      // Vérifier le support de l'API
      if (!('showSaveFilePicker' in window)) {
        throw new Error('API showSaveFilePicker non supportée. Utilisez Chrome/Edge récent.');
      }

      const fileHandle = await window.showSaveFilePicker({
        suggestedName: defaultName,
        types: [
          {
            description: 'Fichiers texte',
            accept: { 'text/plain': ['.txt'] }
          },
          {
            description: 'Tous les fichiers',
            accept: { '*/*': [] }
          }
        ]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      return {
        success: true,
        filePath: fileHandle.name,
        size: new Blob([content]).size
      };

    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, canceled: true };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default WebBackendService;
