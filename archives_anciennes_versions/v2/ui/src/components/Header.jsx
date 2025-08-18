import React from 'react';
import { FONTS } from '../utils/styles';

/**
 * Composant Header - Titre et sous-titre de l'application
 */
const Header = () => {
  return (
    <>
      <h1 
        className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-blue-800 text-center mb-4 tracking-tight" 
        style={{ fontFamily: FONTS.heading }}
      >
        Listeur de Fichiers et Dossiers
      </h1>
      <p 
        className="text-xl text-slate-600 text-center mb-12 font-medium tracking-wide" 
        style={{ fontFamily: FONTS.body }}
      >
        Interface React moderne
      </p>
    </>
  );
};

export default Header;
