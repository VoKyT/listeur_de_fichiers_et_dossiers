import { useState } from 'react';
import FileSystemService from '../services/fileSystemService';

/**
 * Hook personnalisé pour gérer l'état des fichiers et dossiers
 * Compatible Web et Electron
 */
export const useFileSystem = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedDirectory, setSelectedDirectory] = useState(null); // Conserver la référence complète
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Informations sur l'environnement
  const capabilities = FileSystemService.getCapabilities();

  /**
   * Sélectionne un dossier et charge son contenu
   */
  const selectFolder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const directory = await FileSystemService.selectDirectory();
      setSelectedFolder(directory.name);
      setSelectedPath(directory.path || null);
      setSelectedDirectory(directory); // Conserver la référence complète
      
      const files = await FileSystemService.readDirectoryContents(directory);
      setFileList(files);
    } catch (error) {
      if (error.message !== 'ABORTED') {
        setError(error.message);
        console.error('Erreur lors de la sélection du dossier:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Génère un rapport complet (Web et Electron)
   */
  const generateReport = async (options = {}) => {
    if (!capabilities.canGenerateReport || !selectedDirectory) {
      throw new Error('Génération de rapport non disponible');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await FileSystemService.generateReport(selectedDirectory, options);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sauvegarde la liste actuelle (Web et Electron)
   */
  const saveCurrentList = async (customContent = null) => {
    if (!capabilities.canSaveFile || fileList.length === 0) {
      throw new Error('Sauvegarde non disponible');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Générer le contenu de base si pas fourni
      const content = customContent || generateSimpleList();
      // Nom de fichier différent selon le type de contenu
      const defaultName = customContent ? 
        `rapport_complet_${selectedFolder || 'fichiers'}.txt` : 
        `liste_${selectedFolder || 'fichiers'}.txt`;
      const result = await FileSystemService.saveFile(content, defaultName);
      return result;
    } catch (error) {
      if (error.message !== 'ABORTED') {
        setError(error.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Génère une liste simple du contenu actuel
   */
  const generateSimpleList = () => {
    const timestamp = new Date().toLocaleString('fr-FR');
    let content = `=== LISTE DES FICHIERS ET DOSSIERS ===\n`;
    content += `Dossier: ${selectedFolder}\n`;
    content += `Date: ${timestamp}\n`;
    content += `Total: ${fileList.length} éléments\n\n`;

    fileList.forEach((item, index) => {
      const icon = item.isDirectory ? '📁' : '📄';
      const type = item.isDirectory ? '[DOSSIER]' : '[FICHIER]';
      content += `${index + 1}. ${icon} ${item.name} ${type}\n`;
    });

    return content;
  };

  /**
   * Remet à zéro l'état
   */
  const reset = () => {
    setSelectedFolder(null);
    setSelectedPath(null);
    setSelectedDirectory(null);
    setFileList([]);
    setError(null);
  };

  /**
   * Supprime l'erreur
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // État
    selectedFolder,
    selectedPath,
    selectedDirectory,
    fileList,
    isLoading,
    error,
    
    // Actions
    selectFolder,
    generateReport,
    saveCurrentList,
    reset,
    clearError,
    
    // Informations utiles
    hasFiles: fileList.length > 0,
    capabilities,
    isSupported: capabilities.canSelectDirectory
  };
};
