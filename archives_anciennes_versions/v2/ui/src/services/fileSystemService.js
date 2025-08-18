/**
 * Service pour la gestion du système de fichiers
 * Compatible Web (File System Access API) et Electron (IPC)
 */

import WebBackendService from './webBackendService.js';
import ElectronBackendService from './electronBackendService.js';

class FileSystemService {
  static webBackend = new WebBackendService();
  static electronBackend = new ElectronBackendService();
  /**
   * Détecte l'environnement d'exécution
   */
  static isElectron() {
    return typeof window !== 'undefined' && window.electronAPI;
  }

  /**
   * Vérifie si l'API File System Access est supportée (mode Web)
   */
  static isWebFSSupported() {
    return 'showDirectoryPicker' in window;
  }

  /**
   * Vérifie si une API de fichiers est disponible
   */
  static isSupported() {
    return this.isElectron() || this.isWebFSSupported();
  }

  /**
   * Sélectionne un dossier (mode hybride Web/Electron)
   */
  static async selectDirectory() {
    if (this.isElectron()) {
      // Mode Electron : utiliser l'API native
      const result = await window.electronAPI.selectDirectory();
      if (!result.success) {
        if (result.canceled) {
          throw new Error('ABORTED');
        }
        throw new Error('Erreur lors de la sélection du dossier');
      }
      return {
        name: result.name,
        path: result.path
      };
    } else {
      // Mode Web : utiliser File System Access API
      if (!this.isWebFSSupported()) {
        throw new Error('API File System Access non supportée. Utilisez Chrome/Edge récent ou l\'application Electron.');
      }

      try {
        const directoryHandle = await window.showDirectoryPicker();
        return {
          name: directoryHandle.name,
          handle: directoryHandle,
          path: directoryHandle.name // Pour compatibilité
        };
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('ABORTED');
        }
        throw new Error(`Erreur lors de la sélection du dossier: ${error.message}`);
      }
    }
  }

  /**
   * Lit le contenu d'un dossier
   */
  static async readDirectoryContents(directoryData) {
    if (this.isElectron()) {
      // Mode Electron : utiliser l'API backend
      const result = await window.electronAPI.exploreDirectory(directoryData.path);
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'exploration');
      }
      return this.sortFiles(result.files);
    } else {
      // Mode Web : lire via File System Access API
      const files = [];
      
      for await (const [name, handle] of directoryData.handle.entries()) {
        files.push({
          name: name,
          type: handle.kind,
          isDirectory: handle.kind === 'directory'
        });
      }

      return this.sortFiles(files);
    }
  }

  /**
   * Génère un rapport complet (Web et Electron)
   */
  static async generateReport(directoryData, options = {}) {
    if (this.isElectron()) {
      // Mode Electron : utiliser le service backend unifié
      const result = await this.electronBackend.generateReport(directoryData.path, {
        ...options,
        rootName: directoryData.name || 'Dossier sélectionné'
      });
      return result;
    } else {
      // Mode Web : utiliser le service web
      if (!directoryData.handle) {
        throw new Error('Handle de dossier manquant pour la génération de rapport web');
      }
      
      const result = await this.webBackend.generateReport(directoryData.handle, {
        ...options,
        rootName: directoryData.name || 'Dossier sélectionné'
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la génération du rapport');
      }
      
      return result;
    }
  }

  /**
   * Sauvegarde un fichier (Web et Electron)
   */
  static async saveFile(content, defaultName = 'liste_fichiers.txt') {
    if (this.isElectron()) {
      // Mode Electron : utiliser la boîte de dialogue native et notre service
      const result = await window.electronAPI.saveFileDialog(defaultName);
      if (!result.success) {
        if (result.canceled) {
          throw new Error('ABORTED');
        }
        throw new Error(result.error || 'Erreur lors de la sélection du fichier');
      }
      
      // Sauvegarder avec notre service
      await this.electronBackend.saveFile(result.path, content);
      return { success: true, path: result.path };
    } else {
      // Mode Web : utiliser File System Access API
      const result = await this.webBackend.saveFile(content, defaultName);
      if (!result.success) {
        if (result.canceled) {
          throw new Error('ABORTED');
        }
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }
      return result;
    }
  }

  /**
   * Trie les fichiers : dossiers d'abord, puis fichiers (ordre alphabétique)
   */
  static sortFiles(files) {
    return files.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Retourne les capacités de l'environnement actuel
   */
  static getCapabilities() {
    const webFSSupported = this.isWebFSSupported();
    const webSaveSupported = 'showSaveFilePicker' in window;
    
    return {
      isElectron: this.isElectron(),
      isWebFSSupported: webFSSupported,
      canSelectDirectory: this.isSupported(),
      canGenerateReport: this.isElectron() || webFSSupported,
      canSaveFile: this.isElectron() || webSaveSupported,
      platform: this.isElectron() ? window.electronAPI?.platform : 'web'
    };
  }
}

export default FileSystemService;
