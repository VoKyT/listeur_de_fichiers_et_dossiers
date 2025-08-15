import React from 'react';
import { useFileSystem } from './hooks/useFileSystem';
import { CONTAINER_STYLES, FONTS } from './utils/styles';
import { Header, Controls, ErrorDisplay, FolderInfo, FileList, AdvancedActions } from './components';

/**
 * Composant App principal - Architecture modulaire
 * Compatible Web et Electron avec backend intégré
 */
function App() {
  const {
    selectedFolder,
    selectedPath,
    selectedDirectory,
    fileList,
    isLoading,
    error,
    selectFolder,
    generateReport,
    saveCurrentList,
    reset,
    clearError,
    hasFiles,
    capabilities,
    isSupported
  } = useFileSystem();

  const handleGenerateReport = async () => {
    try {
      const result = await generateReport();
      // Optionnel : afficher une notification de succès
      console.log('Rapport généré:', result);
      return result; // Retourner le résultat pour l'utiliser dans AdvancedActions
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      throw error; // Re-lancer l'erreur pour la gestion dans AdvancedActions
    }
  };

  const handleSaveList = async (customContent = null) => {
    try {
      const result = await saveCurrentList(customContent);
      // Optionnel : afficher une notification de succès
      console.log('Liste sauvegardée:', result);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  return (
    <div className={CONTAINER_STYLES.main} style={{ fontFamily: FONTS.body }}>
      <div className="container mx-auto p-8">
        <Header />
        
        <div className={CONTAINER_STYLES.card}>
          <p 
            className="text-slate-700 text-center mb-6 text-lg font-medium leading-relaxed" 
            style={{ fontFamily: FONTS.body }}
          >
            Sélectionnez un dossier pour explorer son contenu
          </p>
          
          <Controls 
            onFolderSelect={selectFolder}
            onReset={reset}
            isLoading={isLoading}
            isSupported={isSupported}
            capabilities={capabilities}
          />
          
          <ErrorDisplay error={error} onClearError={clearError} />
          
          <FolderInfo selectedFolder={selectedFolder} />
          
          {hasFiles && <FileList fileList={fileList} />}
          
          <AdvancedActions
            capabilities={capabilities}
            hasFiles={hasFiles}
            isLoading={isLoading}
            onGenerateReport={handleGenerateReport}
            onSaveList={handleSaveList}
            selectedDirectory={selectedDirectory}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
