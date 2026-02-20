import React from 'react';
import { Navbar } from './Navbar';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-scampi-800 via-purple-600 to-scampi-900 shadow-lg">
      {/* Barra de anuncio superior */}
      <div className="bg-teal-500 text-gray-900 text-center py-2 px-4">
        <p className="text-sm font-semibold">
          ¡Ahorra hasta 70% en tus restaurantes favoritos! Cupones limitados
        </p>
      </div>

      {/* Navbar principal */}
      <Navbar />
    </header>
  );
};