import React from 'react';
import { CONTAINER_STYLES, FONTS } from '../utils/styles';

/**
 * Composant FileItem - Affichage d'un élément de fichier ou dossier
 */
const FileItem = ({ item, index }) => {
  return (
    <div key={index} className={CONTAINER_STYLES.fileItem}>
      <span className="text-2xl mr-3">
        {item.isDirectory ? '📁' : '📄'}
      </span>
      <span 
        className="flex-1 font-medium text-slate-700" 
        style={{ fontFamily: FONTS.body }}
      >
        {item.name}
      </span>
      <span 
        className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded" 
        style={{ fontFamily: FONTS.mono }}
      >
        {item.isDirectory ? 'Dossier' : 'Fichier'}
      </span>
    </div>
  );
};

export default FileItem;
