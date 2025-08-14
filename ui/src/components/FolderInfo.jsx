import React from 'react';
import { CONTAINER_STYLES, FONTS } from '../utils/styles';

/**
 * Composant FolderInfo - Affichage du dossier sélectionné
 */
const FolderInfo = ({ selectedFolder }) => {
  if (!selectedFolder) return null;

  return (
    <div className={CONTAINER_STYLES.info}>
      <p className="text-blue-800 font-semibold text-center" style={{ fontFamily: FONTS.body }}>
        📂 Dossier sélectionné : 
        <span className="font-mono bg-blue-100 px-2 py-1 rounded ml-2">
          {selectedFolder}
        </span>
      </p>
    </div>
  );
};

export default FolderInfo;
