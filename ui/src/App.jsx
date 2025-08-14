import React, { useState } from 'react';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFolderSelect = async () => {
    setIsLoading(true);
    try {
      // Utilisation de l'API File System Access (moderne)
      if ('showDirectoryPicker' in window) {
        const directoryHandle = await window.showDirectoryPicker();
        setSelectedFolder(directoryHandle.name);
        
        // Lire les fichiers du dossier
        const files = [];
        for await (const [name, handle] of directoryHandle.entries()) {
          files.push({
            name: name,
            type: handle.kind, // 'file' ou 'directory'
            isDirectory: handle.kind === 'directory'
          });
        }
        
        // Trier : dossiers d'abord, puis fichiers
        files.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
        
        setFileList(files);
      } else {
        alert('Votre navigateur ne supporte pas l\'API File System Access. Utilisez Chrome/Edge récent.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erreur lors de la sélection du dossier:', error);
        alert('Erreur lors de la sélection du dossier');
      }
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setSelectedFolder(null);
    setFileList([]);
  };
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-blue-800 text-center mb-4 tracking-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
          Listeur de Fichiers et Dossiers
        </h1>
        <p className="text-xl text-slate-600 text-center mb-12 font-medium tracking-wide" style={{fontFamily: 'Inter, sans-serif'}}>
          Interface React moderne
        </p>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <p className="text-slate-700 text-center mb-6 text-lg font-medium leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
            Sélectionnez un dossier pour explorer son contenu
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <button 
              onClick={handleFolderSelect}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide disabled:transform-none" 
              style={{fontFamily: 'Poppins, sans-serif'}}
            >
              {isLoading ? '⏳ Chargement...' : '📁 Choisir un dossier'}
            </button>
            <button 
              onClick={handleReset}
              className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide" 
              style={{fontFamily: 'JetBrains Mono, monospace'}}
            >
              🔄 Reset
            </button>
          </div>
          
          {/* Affichage du dossier sélectionné */}
          {selectedFolder && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 font-semibold text-center" style={{fontFamily: 'Inter, sans-serif'}}>
                📂 Dossier sélectionné : <span className="font-mono bg-blue-100 px-2 py-1 rounded">{selectedFolder}</span>
              </p>
            </div>
          )}
          
          {/* Liste des fichiers */}
          {fileList.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4 text-center" style={{fontFamily: 'Poppins, sans-serif'}}>
                📋 Contenu du dossier ({fileList.length} éléments)
              </h3>
              <div className="max-h-96 overflow-y-auto">
                <div className="grid gap-2">
                  {fileList.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                      <span className="text-2xl mr-3">
                        {item.isDirectory ? '📁' : '📄'}
                      </span>
                      <span className="flex-1 font-medium text-slate-700" style={{fontFamily: 'Inter, sans-serif'}}>
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                        {item.isDirectory ? 'Dossier' : 'Fichier'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
