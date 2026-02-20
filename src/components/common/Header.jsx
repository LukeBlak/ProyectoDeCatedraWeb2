// src/components/common/Header.jsx

import React from 'react';
import { Navbar } from './Navbar';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-sky-500 via-sky-600 to-emerald-500 shadow-lg">
      
      {/* Barra de anuncio superior */}
      <div className="bg-white/80 backdrop-blur text-sky-800 text-center py-2 px-4 border-b border-sky-200">
        <p className="text-sm font-semibold">
          <img src="/icons/megafono.png" alt="Anuncio" className="inline w-4 h-4 mr-1" />
          Ahorra hasta <span className="text-emerald-600">70%</span> en tus restaurantes favoritos.
          <span className="ml-1 text-sky-600">Cupones limitados</span>
        </p>
      </div>

      {/* Navbar principal */}
      <Navbar />
    </header>
  );
};
