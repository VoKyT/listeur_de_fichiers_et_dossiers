import { useState, useCallback } from 'react';

export function useDirectoryScanner() {
  const [scanResults, setScanResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const scanDirectory = useCallback(async (path, options = {}) => {
    if (!window.electronAPI) {
      setError('Electron API non disponible');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await window.electronAPI.scanDirectory(path, options);
      
      if (result.success) {
        setScanResults(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setScanResults(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    scanResults,
    isLoading,
    error,
    scanDirectory,
    reset
  };
}
