import React, { useState } from 'react';
import { BUTTON_STYLES, FONTS } from '../utils/styles';

/**
 * Composant SmartActions - Actions intelligentes avec menu
 */
const SmartActions = ({ 
  capabilities, 
  hasFiles, 
  isLoading, 
  onGenerateReport, 
  onSaveList,
  selectedDirectory 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  // Afficher les actions si les fonctionnalités sont disponibles
  const canSave = capabilities.canSaveFile && hasFiles;
  const canGenerateReport = capabilities.canGenerateReport && hasFiles;
  
  if (!canSave && !canGenerateReport) return null;

  const handleSimpleSave = async () => {
    setShowMenu(false);
    await onSaveList();
  };

  const handleFullReport = async () => {
    setShowMenu(false);
    await onGenerateReport();
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
      <h4 
        className="text-lg font-bold text-green-800 mb-3 text-center" 
        style={{ fontFamily: FONTS.heading }}
      >
        {capabilities.isElectron ? '🖥️ Sauvegarde et Rapports' : '🌐 Sauvegarde et Rapports'}
      </h4>
      
      <div className="flex justify-center">
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide disabled:transform-none flex items-center gap-2"
            style={{ fontFamily: FONTS.body }}
          >
            💾 Sauvegarder / Rapporter
            <span className={`transform transition-transform ${showMenu ? 'rotate-180' : ''}`}>
              ⬇️
            </span>
          </button>
          
          {showMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
              {canSave && (
                <button
                  onClick={handleSimpleSave}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">💾</span>
                  <div>
                    <div className="font-semibold text-green-700">Liste simple</div>
                    <div className="text-xs text-gray-500">Niveau actuel uniquement</div>
                  </div>
                </button>
              )}
              
              {canGenerateReport && (
                <button
                  onClick={handleFullReport}
                  disabled={isLoading || !selectedDirectory}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-semibold text-blue-700">Rapport complet</div>
                    <div className="text-xs text-gray-500">Exploration récursive + stats</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white bg-opacity-60 rounded-full text-xs text-gray-600">
          <span className="font-mono">
            {capabilities.isElectron ? 'Mode Desktop' : 'Mode Navigateur'} | 
            {canGenerateReport ? '📊 Rapports' : ''} 
            {canGenerateReport && canSave ? ' | ' : ''}
            {canSave ? '💾 Sauvegarde' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmartActions;
