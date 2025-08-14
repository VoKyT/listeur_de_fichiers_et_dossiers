import React from 'react';
import { BUTTON_STYLES, FONTS } from '../utils/styles';

/**
 * Composant Controls - Boutons de sélection et reset
 */
const Controls = ({ onFolderSelect, onReset, isLoading, isSupported }) => {
  if (!isSupported) {
    return (
      <div className="text-center mb-8 p-4 bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-700 font-semibold">
          ⚠️ Votre navigateur ne supporte pas l'API File System Access.
        </p>
        <p className="text-red-600 text-sm mt-2">
          Utilisez Chrome ou Edge récent pour accéder à cette fonctionnalité.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-6 mb-8">
      <button 
        onClick={onFolderSelect}
        disabled={isLoading}
        className={BUTTON_STYLES.primary}
        style={{ fontFamily: FONTS.heading }}
      >
        {isLoading ? '⏳ Chargement...' : '📁 Choisir un dossier'}
      </button>
      
      <button 
        onClick={onReset}
        className={BUTTON_STYLES.secondary}
        style={{ fontFamily: FONTS.mono }}
      >
        🔄 Reset
      </button>
    </div>
  );
};

export default Controls;
