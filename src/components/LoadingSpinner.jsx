import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto text-center">
        {/* Spinner simple et élégant */}
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Analyse en cours...
        </h3>
        
        <p className="text-gray-600 text-sm">
          Exploration récursive des fichiers et dossiers
        </p>
        
        {/* Points d'animation simples */}
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}
