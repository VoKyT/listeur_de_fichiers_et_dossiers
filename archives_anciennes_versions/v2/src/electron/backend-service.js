/**
 * Service Electron pour exposer les fonctionnalités backend via IPC
 * Permet à l'interface React d'utiliser directement les modules Node.js
 */

const { ipcMain, dialog } = require('electron');
const path = require('path');

// Imports des modules backend
const ExclusionFilter = require('../core/exploration/exclusion-filter');
const PathResolver = require('../core/exploration/path-resolver');
const DirectoryExplorer = require('../core/exploration/directory-explorer');
const ReportGenerator = require('../core/output/report-generator');
const FileWriter = require('../core/output/file-writer');
const ConfigManager = require('../config/config-manager');
const ErrorHandler = require('../utils/error-handler');

class ElectronBackendService {
  constructor() {
    this.setupIpcHandlers();
  }

  /**
   * Configure tous les handlers IPC pour l'interface React
   */
  setupIpcHandlers() {
    // Sélection de dossier natif
    ipcMain.handle('dialog:selectDirectory', async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Sélectionner un dossier à analyser'
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        return {
          success: true,
          path: result.filePaths[0],
          name: path.basename(result.filePaths[0])
        };
      }
      
      return { success: false, canceled: true };
    });

    // Boîte de dialogue de sauvegarde
    ipcMain.handle('dialog:saveFile', async (event, defaultName = 'rapport.txt') => {
      const result = await dialog.showSaveDialog({
        title: 'Enregistrer le rapport',
        defaultPath: defaultName,
        filters: [
          { name: 'Fichiers texte', extensions: ['txt'] },
          { name: 'Tous les fichiers', extensions: ['*'] }
        ]
      });
      
      if (!result.canceled && result.filePath) {
        return {
          success: true,
          path: result.filePath
        };
      }
      
      return { success: false, canceled: true };
    });

    // Exploration de dossier avec modules backend
    ipcMain.handle('filesystem:explore', async (event, directoryPath) => {
      try {
        const configManager = new ConfigManager();
        const config = configManager.getConfig();
        const directoryExplorer = new DirectoryExplorer();

        // Explorer le répertoire
        const results = directoryExplorer.explore(directoryPath);
        
        // Combiner dossiers et fichiers dans un format unifié
        const combinedResults = [
          ...results.dirs.map(dir => ({ name: dir, isDirectory: true })),
          ...results.files.map(file => ({ name: file, isDirectory: false }))
        ];
        
        // Trier les résultats : dossiers d'abord, puis fichiers
        const sortedResults = combinedResults.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });

        return {
          success: true,
          files: sortedResults,
          stats: {
            totalFiles: results.files.length,
            totalDirectories: results.dirs.length,
            totalItems: results.dirs.length + results.files.length
          }
        };
      } catch (error) {
        console.error('Erreur lors de l\'exploration:', error);
        return {
          success: false,
          error: `Erreur lors de l'exploration: ${error.message}`
        };
      }
    });

    // Génération de rapport complet avec la même logique que webBackendService
    ipcMain.handle('filesystem:generateReport', async (event, directoryPath, options = {}) => {
      try {
        const fs = require('fs').promises;
        const path = require('path');
        
        // Instance du service unifié
        const backendService = {
          version: '2.0.1',
          structure: new Map(),
          explorationStats: {
            totalDirectories: 0,
            totalFiles: 0,
            totalItems: 0,
            explorationTime: 0,
            exclusionsApplied: []
          },
          startTime: 0,
          defaultConfig: {
            exclusions: {
              directories: ['node_modules', '.git', '$RECYCLE.BIN', 'System Volume Information'],
              patterns: [/^\.[^.]/]
            },
            formatting: { maxDepth: 100 }
          }
        };

        // Fonction d'exclusion
        const shouldExclude = (name, isDirectory = false) => {
          if (isDirectory && backendService.defaultConfig.exclusions.directories.includes(name)) {
            backendService.explorationStats.exclusionsApplied.push(`Dossier exclu: ${name}`);
            return true;
          }
          for (const pattern of backendService.defaultConfig.exclusions.patterns) {
            if (pattern.test(name)) {
              backendService.explorationStats.exclusionsApplied.push(`Pattern exclu: ${name}`);
              return true;
            }
          }
          return false;
        };

        // Exploration récursive (EXACTEMENT comme webBackendService)
        const exploreDirectory = async (dirPath, currentPath = 'ROOT', depth = 0) => {
          if (depth === 0) {
            backendService.startTime = performance.now();
            backendService.structure.clear();
            backendService.explorationStats = {
              totalDirectories: 0, totalFiles: 0, totalItems: 0,
              explorationTime: 0, exclusionsApplied: []
            };
          }

          const results = { directories: [], files: [], structure: backendService.structure };
          if (depth >= backendService.defaultConfig.formatting.maxDepth) return results;

          try {
            const currentStructure = {
              directories: [], files: [], counts: { directories: 0, files: 0 }
            };

            const entries = await fs.readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
              const name = entry.name;
              const fullPath = path.join(dirPath, name);

              if (shouldExclude(name, entry.isDirectory())) continue;

              if (entry.isDirectory()) {
                backendService.explorationStats.totalDirectories++;
                results.directories.push(fullPath);
                currentStructure.directories.push(name);
                currentStructure.counts.directories++;

                const childPath = (currentPath === 'ROOT') ? name : `${currentPath}/${name}`;
                const childResults = await exploreDirectory(fullPath, childPath, depth + 1);
                results.directories.push(...childResults.directories);
                results.files.push(...childResults.files);

              } else if (entry.isFile()) {
                backendService.explorationStats.totalFiles++;
                results.files.push(fullPath);
                currentStructure.files.push(name);
                currentStructure.counts.files++;
              }
            }

            results.structure.set(currentPath || 'ROOT', currentStructure);

          } catch (error) {
            console.error(`Erreur exploration ${currentPath}:`, error);
          }

          if (depth === 0) {
            backendService.explorationStats.explorationTime = Math.round(performance.now() - backendService.startTime);
            backendService.explorationStats.totalItems = backendService.explorationStats.totalDirectories + backendService.explorationStats.totalFiles;
          }

          return results;
        };

        // Construction de l'arbre (EXACTEMENT comme webBackendService)
        const buildTreeView = (results, rootName) => {
          const structure = results.structure;
          let output = [];

          const countElements = (path) => {
            const currentStructure = structure.get(path);
            if (!currentStructure) return { dirs: 0, files: 0 };
            let totalDirs = currentStructure.directories.length;
            let totalFiles = currentStructure.files.length;
            currentStructure.directories.forEach(dirName => {
              const fullPath = (path === 'ROOT') ? dirName : (path ? `${path}/${dirName}` : dirName);
              const subCounts = countElements(fullPath);
              totalDirs += subCounts.dirs;
              totalFiles += subCounts.files;
            });
            return { dirs: totalDirs, files: totalFiles };
          };

          const generateLevel = (path, level = 0, prefix = '') => {
            const currentStructure = structure.get(path);
            if (!currentStructure) return;

            const totalElements = currentStructure.directories.length + currentStructure.files.length;

            currentStructure.directories.forEach((dirName, index) => {
              const fullPath = (path === 'ROOT') ? dirName : (path ? `${path}/${dirName}` : dirName);
              const isLastElement = index === totalElements - 1;
              const connector = level === 0 ? '' : (isLastElement ? '└── ' : '├── ');
              const nextPrefix = level === 0 ? '' : prefix + (isLastElement ? '    ' : '│   ');
              
              const subStructure = structure.get(fullPath);
              const directCounts = subStructure ? {
                dirs: subStructure.directories.length,
                files: subStructure.files.length
              } : { dirs: 0, files: 0 };
              
              let dirDisplay = `${prefix}${connector}${index + 1}. ${dirName}/`;
              if (directCounts.dirs > 0 || directCounts.files > 0) {
                const countsDisplay = [];
                if (directCounts.dirs > 0) countsDisplay.push(`${directCounts.dirs} dossier${directCounts.dirs > 1 ? 's' : ''}`);
                if (directCounts.files > 0) countsDisplay.push(`${directCounts.files} fichier${directCounts.files > 1 ? 's' : ''}`);
                dirDisplay += ` (${countsDisplay.join(' - ')})`;
              }
              
              output.push(dirDisplay);
              
              if (structure.has(fullPath)) {
                generateLevel(fullPath, level + 1, nextPrefix);
              }
            });
            
            currentStructure.files.forEach((fileName, index) => {
              const globalIndex = currentStructure.directories.length + index;
              const isLastElement = globalIndex === totalElements - 1;
              const connector = level === 0 ? '' : (isLastElement ? '└── ' : '├── ');
              const paddingLength = totalElements.toString().length;
              const fileNumber = (globalIndex + 1).toString().padStart(paddingLength, '0');
              output.push(`${prefix}${connector}${fileNumber}. ${fileName}`);
            });
          };

          // En-tête formaté
          const headerLine = '='.repeat(50);
          const title = 'STRUCTURE ARBORESCENTE';
          const titlePadding = Math.floor((headerLine.length - title.length) / 2);
          const titleLine = ' '.repeat(titlePadding) + title + ' '.repeat(headerLine.length - title.length - titlePadding);
          
          output.push(headerLine);
          output.push(titleLine);
          output.push(headerLine);

          const rootCounts = countElements('ROOT');
          const rootCountsDisplay = [];
          if (rootCounts.dirs > 0) rootCountsDisplay.push(`${rootCounts.dirs} dossier${rootCounts.dirs > 1 ? 's' : ''}`);
          if (rootCounts.files > 0) rootCountsDisplay.push(`${rootCounts.files} fichier${rootCounts.files > 1 ? 's' : ''}`);
          
          output.push(`📁 ${rootName}/${rootCountsDisplay.length > 0 ? ` (${rootCountsDisplay.join(' - ')})` : ''}`);
          generateLevel('ROOT', 0);
          
          return output.join('\n');
        };

        // Explorer le dossier
        const rootName = options.rootName || path.basename(directoryPath);
        const results = await exploreDirectory(directoryPath);
        
        // Générer le rapport complet
        const stats = {
          totalDirectories: backendService.explorationStats.totalDirectories,
          totalFiles: backendService.explorationStats.totalFiles,
          totalItems: backendService.explorationStats.totalItems,
          explorationTime: backendService.explorationStats.explorationTime,
          excludedItems: backendService.explorationStats.exclusionsApplied.length,
          exclusions: [...backendService.explorationStats.exclusionsApplied],
          timestamp: new Date().toISOString()
        };

        const now = new Date();
        let report = `┌${'─'.repeat(78)}┐\n`;
        report += `│${' '.repeat(78)}│\n`;
        report += `│${'📊 RAPPORT COMPLET D\'EXPLORATION RÉCURSIVE'.padStart(57).padEnd(78)}│\n`;
        report += `│${`Version ${backendService.version} - Générateur de listeur de fichiers`.padStart(60).padEnd(78)}│\n`;
        report += `│${' '.repeat(78)}│\n`;
        report += `└${'─'.repeat(78)}┘\n\n`;
        
        report += `📅 Date et heure    : ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}\n`;
        report += `🎯 Dossier analysé  : ${rootName}\n`;
        report += `⏱️  Temps d'exploration : ${stats.explorationTime} ms\n`;
        report += `📏 Profondeur max   : ${backendService.defaultConfig.formatting.maxDepth} niveaux\n\n`;
        
        report += `${'═'.repeat(80)}\n`;
        report += `                             📊 STATISTIQUES GLOBALES\n`;
        report += `${'═'.repeat(80)}\n`;
        report += `📁 TOTAL DOSSIERS   : ${stats.totalDirectories}\n`;
        report += `📄 TOTAL FICHIERS   : ${stats.totalFiles}\n`;
        report += `📊 TOTAL ÉLÉMENTS   : ${stats.totalItems}\n`;
        report += `⚠️  ÉLÉMENTS EXCLUS : ${stats.excludedItems}\n`;
        report += `⏱️  TEMPS D'ANALYSE : ${stats.explorationTime} ms\n\n`;
        
        if (stats.exclusions.length > 0) {
          report += `${'═'.repeat(80)}\n`;
          report += `                          ⚠️  EXCLUSIONS APPLIQUÉES\n`;
          report += `${'═'.repeat(80)}\n`;
          stats.exclusions.forEach(exclusion => {
            report += `• ${exclusion}\n`;
          });
          report += '\n';
        }
        
        report += `${'═'.repeat(80)}\n`;
        report += `                          🌳 STRUCTURE ARBORESCENTE COMPLÈTE\n`;
        report += `${'═'.repeat(80)}\n`;
        report += buildTreeView(results, rootName);
        report += '\n\n';
        
        report += `${'═'.repeat(80)}\n`;
        report += `Rapport généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}\n`;
        report += `Version ${backendService.version} - Listeur de fichiers et dossiers\n`;
        report += `${'═'.repeat(80)}`;
        
        return {
          success: true,
          content: report,
          stats: stats
        };
        
      } catch (error) {
        console.error('Erreur lors de la génération du rapport:', error);
        return {
          success: false,
          error: `Erreur lors de la génération: ${error.message}`
        };
      }
    });

    // Sauvegarde de fichier
    ipcMain.handle('filesystem:saveFile', async (event, content, defaultName = 'liste_fichiers.txt') => {
      try {
        const result = await dialog.showSaveDialog({
          title: 'Sauvegarder la liste',
          defaultPath: defaultName,
          filters: [
            { name: 'Fichiers texte', extensions: ['txt'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
          ]
        });

        if (!result.canceled && result.filePath) {
          const fileWriter = new FileWriter();
          const writeResult = fileWriter.writeFile(result.filePath, content);
          
          return {
            success: writeResult.success,
            filePath: result.filePath,
            error: writeResult.error
          };
        }

        return { success: false, canceled: true };
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        return {
          success: false,
          error: `Erreur lors de la sauvegarde: ${error.message}`
        };
      }
    });

    // Obtenir la configuration actuelle
    ipcMain.handle('config:get', async () => {
      try {
        const configManager = new ConfigManager();
        const config = configManager.getConfig();
        return {
          success: true,
          config: config
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    // Mettre à jour la configuration
    ipcMain.handle('config:update', async (event, newConfig) => {
      try {
        const configManager = new ConfigManager();
        configManager.updateConfig(newConfig);
        
        return {
          success: true,
          config: configManager.getConfig()
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('✅ Services IPC Electron configurés');
  }

  /**
   * Nettoie les handlers IPC
   */
  cleanup() {
    ipcMain.removeAllListeners('dialog:selectDirectory');
    ipcMain.removeAllListeners('filesystem:explore');
    ipcMain.removeAllListeners('filesystem:generateReport');
    ipcMain.removeAllListeners('filesystem:saveFile');
    ipcMain.removeAllListeners('config:get');
    ipcMain.removeAllListeners('config:update');
  }
}

module.exports = ElectronBackendService;
