import React from 'react';
import { CONTAINER_STYLES, FONTS } from '../utils/styles';
import FileItem from './FileItem';

/**
 * Composant FileList - Affichage de la liste des fichiers
 */
const FileList = ({ fileList }) => {
  if (!fileList || fileList.length === 0) return null;

  return (
    <div className={CONTAINER_STYLES.content}>
      <h3 
        className="text-xl font-bold text-slate-800 mb-4 text-center" 
        style={{ fontFamily: FONTS.heading }}
      >
        📋 Contenu du dossier ({fileList.length} éléments)
      </h3>
      
      <div className="max-h-96 overflow-y-auto">
        <div className="grid gap-2">
          {fileList.map((item, index) => (
            <FileItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileList;
