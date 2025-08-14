/**
 * Service pour la gestion du système de fichiers
 * Encapsule la logique d'accès aux fichiers et dossiers
 */

class FileSystemService {
  /**
   * Vérifie si l'API File System Access est supportée
   */
  static isSupported() {
    return 'showDirectoryPicker' in window;
  }

  /**
   * Sélectionne un dossier et retourne ses informations
   */
  static async selectDirectory() {
    if (!this.isSupported()) {
      throw new Error('API File System Access non supportée. Utilisez Chrome/Edge récent.');
    }

    try {
      const directoryHandle = await window.showDirectoryPicker();
      return {
        name: directoryHandle.name,
        handle: directoryHandle
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('ABORTED');
      }
      throw new Error(`Erreur lors de la sélection du dossier: ${error.message}`);
    }
  }

  /**
   * Lit le contenu d'un dossier
   */
  static async readDirectoryContents(directoryHandle) {
    const files = [];
    
    for await (const [name, handle] of directoryHandle.entries()) {
      files.push({
        name: name,
        type: handle.kind,
        isDirectory: handle.kind === 'directory'
      });
    }

    return this.sortFiles(files);
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
}

export default FileSystemService;
