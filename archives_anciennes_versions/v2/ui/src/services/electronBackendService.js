/**
 * Service Electron simple qui utilise les APIs IPC
 * Compatible avec le navigateur (pas de modules Node.js)
 */

class ElectronBackendService {
  constructor() {
    this.version = '2.0.1';
  }

  /**
   * Génère un rapport complet via l'IPC Electron
   */
  async generateReport(directoryPath, options = {}) {
    // Utiliser l'API IPC existante
    if (window.electronAPI) {
      const result = await window.electronAPI.generateReport(directoryPath, options);
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la génération du rapport');
      }
      return result.content;
    } else {
      throw new Error('API Electron non disponible');
    }
  }

  /**
   * Sauvegarde un fichier via l'IPC Electron
   */
  async saveFile(fileName, content) {
    if (window.electronAPI) {
      // Utiliser l'API de sauvegarde existante
      const result = await window.electronAPI.saveFile(content, fileName);
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }
      return result;
    } else {
      throw new Error('API Electron non disponible');
    }
  }
}

export default ElectronBackendService;
