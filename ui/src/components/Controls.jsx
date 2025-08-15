import React from 'react';
import { BUTTON_STYLES, FONTS } from '../utils/styles';

/**
 * Composant Controls - Boutons de sélection et reset
 */
const Controls = ({ onFolderSelect, onReset, isLoading, isSupported, capabilities }) => {
  if (!isSupported) {
    return (
      <div className="text-center mb-8 p-4 bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-700 font-semibold">
          ⚠️ Aucune API de fichiers disponible
        </p>
        <p className="text-red-600 text-sm mt-2">
          {capabilities.isElectron ? 
            'Erreur de configuration Electron' : 
            'Utilisez Chrome/Edge récent ou l\'application Electron pour accéder aux fichiers.'
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center space-x-6 mb-6">
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

      {/* Informations sur l'environnement */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
          <span className="font-mono">
            {capabilities.isElectron ? '🖥️ Electron' : '🌐 Web'} | 
            {capabilities.platform} | 
            {capabilities.canGenerateReport ? '📊 Rapports' : '❌ Rapports'} | 
            {capabilities.canSaveFile ? '💾 Sauvegarde' : '❌ Sauvegarde'}
          </span>
        </div>
      </div>
    </>
  );
};

export default Controls;
