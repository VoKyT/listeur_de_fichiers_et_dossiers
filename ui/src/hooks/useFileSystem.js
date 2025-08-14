import { useState } from 'react';
import FileSystemService from '../services/fileSystemService';

/**
 * Hook personnalisé pour gérer l'état des fichiers et dossiers
 */
export const useFileSystem = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sélectionne un dossier et charge son contenu
   */
  const selectFolder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const directory = await FileSystemService.selectDirectory();
      setSelectedFolder(directory.name);
      
      const files = await FileSystemService.readDirectoryContents(directory.handle);
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
   * Remet à zéro l'état
   */
  const reset = () => {
    setSelectedFolder(null);
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
    fileList,
    isLoading,
    error,
    
    // Actions
    selectFolder,
    reset,
    clearError,
    
    // Informations utiles
    hasFiles: fileList.length > 0,
    isSupported: FileSystemService.isSupported()
  };
};
