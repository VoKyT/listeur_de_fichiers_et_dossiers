import React from 'react';
import { BUTTON_STYLES, FONTS } from '../utils/styles';

/**
 * Composant AdvancedActions - Actions avancées (Web et Electron)
 */
const AdvancedActions = ({ 
  capabilities, 
  hasFiles, 
  isLoading, 
  onGenerateReport, 
  onSaveList,
  selectedDirectory 
}) => {
  // Afficher les actions si les fonctionnalités sont disponibles
  const canGenerateReport = (capabilities.canGenerateReport || capabilities.canSaveFile) && hasFiles;
  
  if (!canGenerateReport) return null;

  // Fonction pour générer un rapport complet et permettre la sauvegarde avec sélection d'emplacement
  const handleCompleteReport = async () => {
    try {
      console.log('🚀 Début génération rapport complet...');
      
      // D'abord générer le rapport complet
      const reportResult = await onGenerateReport();
      console.log('📊 Rapport généré:', reportResult);
      
      // Gérer les deux formats : objet avec .content ou chaîne directe
      const reportContent = (typeof reportResult === 'string') 
        ? reportResult 
        : (reportResult && reportResult.content);
      
      if (reportContent && reportContent.length > 0) {
        console.log('💾 Démarrage sauvegarde avec sélection d\'emplacement...');
        // Puis sauvegarder avec sélection d'emplacement
        await onSaveList(reportContent);
        console.log('✅ Sauvegarde terminée avec succès');
      } else {
        console.error('❌ Pas de contenu dans le rapport généré');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération du rapport complet:', error);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
      <h4 
        className="text-lg font-bold text-green-800 mb-3 text-center" 
        style={{ fontFamily: FONTS.heading }}
      >
        {capabilities.isElectron ? '🖥️ Fonctionnalités Electron' : '🌐 Fonctionnalités Web'}
      </h4>
      
      <div className="flex flex-wrap justify-center gap-3">
        <button 
          onClick={handleCompleteReport}
          disabled={isLoading || !selectedDirectory}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide disabled:transform-none"
          style={{ fontFamily: FONTS.body }}
        >
          📊 Rapport complet récursif
        </button>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-xs text-blue-600" style={{ fontFamily: FONTS.body }}>
          Exploration complète avec statistiques et structure arborescente
        </p>
      </div>
      
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white bg-opacity-60 rounded-full text-xs text-gray-600">
          <span className="font-mono">
            {capabilities.isElectron ? 'Mode Desktop' : 'Mode Navigateur'} | 📊 Rapport professionnel
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedActions;
