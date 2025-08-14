import React from 'react';
import { FONTS } from '../utils/styles';

/**
 * Composant ErrorDisplay - Affichage des erreurs
 */
const ErrorDisplay = ({ error, onClearError }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
      <div className="flex items-center justify-between">
        <p className="text-red-700 font-semibold" style={{ fontFamily: FONTS.body }}>
          ❌ {error}
        </p>
        <button 
          onClick={onClearError}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Fermer l'erreur"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
