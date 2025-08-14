import React from 'react';

function App() {
  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
          Listeur de Fichiers et Dossiers - React
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-700 text-center mb-4">
            Interface React avec Tailwind CSS - Ready to start from scratch!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Commencer avec React
            </button>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Bouton test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
