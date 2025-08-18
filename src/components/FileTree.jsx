import React, { useState, useMemo } from 'react';

export function FileTree({ data, selectedDirectory }) {
  const [expandedDirs, setExpandedDirs] = useState(new Set());
  const [filter, setFilter] = useState('');

  const toggleDirectory = (path) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const filteredData = useMemo(() => {
    if (!filter) return data;
    
    const filterRecursive = (item) => {
      if (item.name.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      if (item.children) {
        return item.children.directories.some(filterRecursive) || 
               item.children.files.some(filterRecursive);
      }
      return false;
    };

    return {
      ...data,
      directories: data.directories.filter(filterRecursive),
      files: data.files.filter(filterRecursive)
    };
  }, [data, filter]);

  const FileIcon = ({ isDirectory, name }) => {
    if (isDirectory) {
      return (
        <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    }
    
    const ext = name.split('.').pop()?.toLowerCase();
    let color = 'text-gray-500';
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) color = 'text-yellow-500';
    else if (['css', 'scss', 'less'].includes(ext)) color = 'text-blue-500';
    else if (['html', 'htm'].includes(ext)) color = 'text-orange-500';
    else if (['json', 'xml'].includes(ext)) color = 'text-green-500';

    return (
      <svg className={h-4 w-4 } fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    );
  };

  const TreeItem = ({ item, level = 0, isDirectory = false }) => {
    const isExpanded = expandedDirs.has(item.path);
    const hasChildren = isDirectory && item.children && 
      (item.children.directories.length > 0 || item.children.files.length > 0);

    return (
      <div>
        <div 
          className={lex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors duration-150 }
          onClick={() => isDirectory && toggleDirectory(item.path)}
        >
          {isDirectory && hasChildren && (
            <svg 
              className={h-3 w-3 mr-2 text-gray-400 transform transition-transform }
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <FileIcon isDirectory={isDirectory} name={item.name} />
          <span className={ml-2 text-sm }>
            {item.name}
          </span>
          {isDirectory && item.count !== undefined && (
            <span className="ml-auto text-xs text-gray-500">
              {item.count} éléments
            </span>
          )}
        </div>
        
        {isDirectory && isExpanded && item.children && (
          <div>
            {item.children.directories.map(dir => (
              <TreeItem key={dir.path} item={dir} level={level + 1} isDirectory={true} />
            ))}
            {item.children.files.map(file => (
              <TreeItem key={file.path} item={file} level={level + 1} isDirectory={false} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Structure des fichiers
        </h2>
        <input
          type="text"
          placeholder="Filtrer les fichiers..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        />
        <p className="text-xs text-gray-600 mt-2 truncate">
          {selectedDirectory}
        </p>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-1">
          {filteredData.directories.map(dir => (
            <TreeItem key={dir.path} item={dir} level={0} isDirectory={true} />
          ))}
          {filteredData.files.map(file => (
            <TreeItem key={file.path} item={file} level={0} isDirectory={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
