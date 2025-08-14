import React from 'react';
import { useFileSystem } from './hooks/useFileSystem';
import { CONTAINER_STYLES, FONTS } from './utils/styles';
import { Header, Controls, ErrorDisplay, FolderInfo, FileList } from './components';

/**
 * Composant App principal - Architecture modulaire
 * Orchestration des composants avec logique déportée dans les hooks et services
 */
function App() {
  const {
    selectedFolder,
    fileList,
    isLoading,
    error,
    selectFolder,
    reset,
    clearError,
    hasFiles,
    isSupported
  } = useFileSystem();

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
          />
          
          <ErrorDisplay error={error} onClearError={clearError} />
          
          <FolderInfo selectedFolder={selectedFolder} />
          
          {hasFiles && <FileList fileList={fileList} />}
        </div>
      </div>
    </div>
  );
}

export default App;
