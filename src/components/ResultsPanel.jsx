import React, { useMemo } from 'react';

export function ResultsPanel({ data }) {
  const stats = useMemo(() => {
    const calculateStats = (item) => {
      let totalFiles = 0;
      let totalDirs = 0;
      let totalSize = 0;
      const fileTypes = {};

      const traverse = (currentItem) => {
        if (currentItem.type === 'file') {
          totalFiles++;
          totalSize += currentItem.size || 0;
          const ext = currentItem.name.split('.').pop()?.toLowerCase() || 'sans extension';
          fileTypes[ext] = (fileTypes[ext] || 0) + 1;
        } else if (currentItem.type === 'directory') {
          totalDirs++;
          if (currentItem.children) {
            currentItem.children.directories.forEach(traverse);
            currentItem.children.files.forEach(traverse);
          }
        }
      };

      // Traiter les répertoires racine
      data.directories.forEach(traverse);
      data.files.forEach(traverse);

      return {
        totalFiles,
        totalDirs,
        totalSize,
        fileTypes: Object.entries(fileTypes)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
      };
    };

    return calculateStats();
  }, [data]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleExport = async () => {
    if (window.electronAPI) {
      const content = generateReport(data, stats);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `rapport-fichiers-${timestamp}.txt`;
      
      try {
        const result = await window.electronAPI.saveFile(filename, content);
        if (result.success) {
          alert(`Rapport sauvegardé: ${filename}`);
        } else {
          alert(`Erreur: ${result.error}`);
        }
      } catch (error) {
        alert(`Erreur lors de la sauvegarde: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          📊 <span className="ml-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Statistiques</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {stats.totalDirs}
            </div>
            <div className="text-sm font-medium text-blue-700">📁 Dossiers</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {stats.totalFiles}
            </div>
            <div className="text-sm font-medium text-green-700">📄 Fichiers</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {formatFileSize(stats.totalSize)}
            </div>
            <div className="text-sm font-medium text-purple-700">💾 Taille totale</div>
          </div>
        </div>
      </div>

      {/* Types de fichiers */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          🏷️ <span className="ml-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Types de fichiers</span>
        </h3>
        
        <div className="space-y-3">
          {stats.fileTypes.map(([ext, count], index) => (
            <div key={ext} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
              <span className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-full border">
                📄 .{ext}
              </span>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          ⚡ <span className="ml-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Actions</span>
        </h3>
        
        <button
          onClick={handleExport}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus-ring"
        >
          💾 Exporter le rapport
        </button>
      </div>
    </div>
  );
}

function generateReport(data, stats) {
  const now = new Date().toLocaleString('fr-FR');
  
  let report = `RAPPORT D'ANALYSE DE FICHIERS
Généré le: ${now}

STATISTIQUES GÉNÉRALES:
- Dossiers: ${stats.totalDirs}
- Fichiers: ${stats.totalFiles}
- Taille totale: ${stats.totalSize} octets

TYPES DE FICHIERS LES PLUS FRÉQUENTS:
`;

  stats.fileTypes.forEach(([ext, count]) => {
    report += `- .${ext}: ${count} fichiers\n`;
  });

  report += '\n\nSTRUCTURE DÉTAILLÉE:\n';
  
  const buildTree = (items, prefix = '', isDirectory = false) => {
    let result = '';
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      result += `${prefix}${connector}${item.name}\n`;
      
      if (item.children) {
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        result += buildTree(item.children.directories, nextPrefix, true);
        result += buildTree(item.children.files, nextPrefix, false);
      }
    });
    return result;
  };

  report += buildTree(data.directories, '', true);
  report += buildTree(data.files, '', false);

  return report;
}
