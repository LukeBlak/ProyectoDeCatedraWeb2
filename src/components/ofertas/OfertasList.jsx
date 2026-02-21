import React from 'react';
import { OfertaCard } from './OfertaCard';

export const OfertasList = ({ ofertas, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎫</div>
          <p className="text-purple-600 text-xl">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center bg-red-50 p-8 rounded-2xl">
          <div className="text-6xl mb-4">😅</div>
          <p className="text-red-600 text-xl mb-4">Error al cargar ofertas</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!ofertas || ofertas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-500 text-lg">No hay ofertas disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ofertas.map(oferta => (
        <OfertaCard key={oferta.id} oferta={oferta} />
      ))}
    </div>
  );
};