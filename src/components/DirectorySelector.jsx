import React from 'react';

export function DirectorySelector({ onSelect }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 max-w-md mx-auto">
        <div className="text-center">
          {/* Icône simple et proportionnée */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
            </svg>
          </div>

          {/* Titre simple */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Analyser un dossier
          </h3>
          
          {/* Description concise */}
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Sélectionnez un dossier pour explorer sa structure et générer un rapport détaillé.
          </p>
          
          {/* Bouton clean */}
          <button
            onClick={onSelect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Choisir un dossier
          </button>
        </div>
      </div>
    </div>
  );
}
