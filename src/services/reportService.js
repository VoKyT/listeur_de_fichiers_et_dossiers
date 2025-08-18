/**
 * Service de génération de rapports
 */

export const generateTextReport = (data, stats) => {
  const now = new Date().toLocaleString('fr-FR');
  
  let report = `==================================================
RAPPORT D'ANALYSE DE FICHIERS ET DOSSIERS
==================================================
Généré le: ${now}
Version: 3.0.0 (React + Electron)

==================================================
            STATISTIQUES GÉNÉRALES            
==================================================
TOTAL: ${stats.totalFiles + stats.totalDirs} éléments
- Dossiers: ${stats.totalDirs}
- Fichiers: ${stats.totalFiles}
- Taille totale: ${formatFileSize(stats.totalSize)}

==================================================
        TYPES DE FICHIERS LES PLUS FRÉQUENTS        
==================================================
`;

  stats.fileTypes.forEach(([ext, count], index) => {
    report += `${index + 1}. .${ext}: ${count} fichiers\n`;
  });

  report += `\n==================================================
              STRUCTURE ARBORESCENTE              
==================================================\n`;
  
  const buildTree = (items, prefix = '', isLast = true) => {
    let result = '';
    items.forEach((item, index) => {
      const isLastItem = index === items.length - 1;
      const connector = isLastItem ? '└── ' : '├── ';
      const icon = item.type === 'directory' ? '📁' : '📄';
      
      result += `${prefix}${connector}${icon} ${item.name}`;
      
      if (item.type === 'file' && item.size) {
        result += ` (${formatFileSize(item.size)})`;
      }
      
      result += '\n';
      
      if (item.children && (item.children.directories.length > 0 || item.children.files.length > 0)) {
        const nextPrefix = prefix + (isLastItem ? '    ' : '│   ');
        const allChildren = [...item.children.directories, ...item.children.files]
          .sort((a, b) => {
            // Dossiers d'abord, puis fichiers
            if (a.type !== b.type) {
              return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
          });
        
        result += buildTree(allChildren, nextPrefix);
      }
    });
    return result;
  };

  const allItems = [...data.directories, ...data.files]
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

  report += buildTree(allItems);

  report += `\n==================================================
                    RÉSUMÉ FINAL                    
==================================================
✅ Analyse terminée avec succès
📊 ${stats.totalDirs} dossiers et ${stats.totalFiles} fichiers analysés
💾 Taille totale: ${formatFileSize(stats.totalSize)}
🏷️  ${Object.keys(stats.fileTypes).length} types de fichiers différents

Généré par le Listeur de Fichiers et Dossiers v3.0.0
Interface React + Electron moderne
`;

  return report;
};

export const generateJsonReport = (data, stats) => {
  return JSON.stringify({
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '3.0.0',
      generator: 'Listeur de Fichiers et Dossiers (React + Electron)'
    },
    statistics: stats,
    structure: data
  }, null, 2);
};

export const generateCsvReport = (data, stats) => {
  let csv = 'Type,Nom,Chemin,Taille,Date de modification\n';
  
  const flattenData = (items) => {
    let result = [];
    items.forEach(item => {
      result.push({
        type: item.type,
        name: item.name,
        path: item.path,
        size: item.size || '',
        modified: item.modified || ''
      });
      
      if (item.children) {
        result = result.concat(flattenData([...item.children.directories, ...item.children.files]));
      }
    });
    return result;
  };

  const allItems = flattenData([...data.directories, ...data.files]);
  
  allItems.forEach(item => {
    csv += `"${item.type}","${item.name}","${item.path}","${item.size}","${item.modified}"\n`;
  });

  return csv;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
