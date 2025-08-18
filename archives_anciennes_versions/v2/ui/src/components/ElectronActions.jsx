import React from 'react';
import { BUTTON_STYLES, FONTS } from '../utils/styles';

/**
 * Composant ElectronActions - Actions spécifiques à Electron
 */
const ElectronActions = ({ 
  capabilities, 
  hasFiles, 
  isLoading, 
  onGenerateReport, 
  onSaveList,
  selectedPath 
}) => {
  if (!capabilities.isElectron) return null;

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
      <h4 
        className="text-lg font-bold text-green-800 mb-3 text-center" 
        style={{ fontFamily: FONTS.heading }}
      >
        🖥️ Fonctionnalités Electron
      </h4>
      
      <div className="flex flex-wrap justify-center gap-3">
        {hasFiles && (
          <>
            <button 
              onClick={onSaveList}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide disabled:transform-none text-sm"
              style={{ fontFamily: FONTS.body }}
            >
              💾 Sauvegarder la liste
            </button>
            
            <button 
              onClick={onGenerateReport}
              disabled={isLoading || !selectedPath}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide disabled:transform-none text-sm"
              style={{ fontFamily: FONTS.body }}
            >
              📊 Rapport complet
            </button>
          </>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-green-600" style={{ fontFamily: FONTS.mono }}>
          ✅ Mode Electron activé - Fonctionnalités avancées disponibles
        </p>
        <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: FONTS.mono }}>
          Plateforme: {capabilities.platform} | Node.js intégré
        </p>
      </div>
    </div>
  );
};

export default ElectronActions;
