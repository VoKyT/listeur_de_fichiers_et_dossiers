import React, { useState, useCallback } from 'react';
import { DirectorySelector } from '@components/DirectorySelector';
import { FileTree } from '@components/FileTree';
import { ResultsPanel } from '@components/ResultsPanel';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { useDirectoryScanner } from '@hooks/useDirectoryScanner';

function App() {
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const { scanResults, isLoading, error, scanDirectory } = useDirectoryScanner();

  const handleDirectorySelect = useCallback(async () => {
    if (window.electronAPI) {
      const directory = await window.electronAPI.selectDirectory();
      if (directory) {
        setSelectedDirectory(directory);
        await scanDirectory(directory, {
          excludeNodeModules: true,
          excludeHidden: true,
          maxDepth: 10
        });
      }
    } else {
      alert('Cette fonctionnalité nécessite Electron');
    }
  }, [scanDirectory]);

  const handleRescan = useCallback(() => {
    if (selectedDirectory) {
      scanDirectory(selectedDirectory, {
        excludeNodeModules: true,
        excludeHidden: true,
        maxDepth: 10
      });
    }
  }, [selectedDirectory, scanDirectory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header propre et simple */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Listeur de Fichiers et Dossiers
              </h1>
              <p className="text-gray-600 text-sm">
                Interface moderne avec React + Electron
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDirectorySelect}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
              >
                Sélectionner un dossier
              </button>
              {selectedDirectory && (
                <button
                  onClick={handleRescan}
                  disabled={isLoading}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Rescanner
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedDirectory ? (
          /* État initial */
          <DirectorySelector onSelect={handleDirectorySelect} />
        ) : isLoading ? (
          /* État de chargement */
          <LoadingSpinner />
        ) : error ? (
          /* État d'erreur */
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg animate-fade-in">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">❌</span>
              <h3 className="text-xl font-bold text-red-800">
                Erreur lors du scan
              </h3>
            </div>
            <p className="text-red-700 mb-6 bg-white/50 p-4 rounded-lg">{error}</p>
            <button
              onClick={handleRescan}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
            >
              🔄 Réessayer
            </button>
          </div>
        ) : scanResults ? (
          /* Résultats */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2">
              <FileTree data={scanResults} selectedDirectory={selectedDirectory} />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <ResultsPanel data={scanResults} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
