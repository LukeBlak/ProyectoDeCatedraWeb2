import React from 'react';
import {CuponCard} from './CuponCard';

export const CuponList = ({ cupones, onDescargarPDF, onVerDetalle, titulo }) => {
  
  if (!cupones || cupones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎫</div>
        <p className="text-gray-500 text-lg">
          {titulo ? `No hay ${titulo.toLowerCase()}` : 'No hay cupones para mostrar'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {titulo && (
        <h3 className="text-xl font-bold text-gray-800 mb-4">{titulo}</h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cupones.map(cupon => (
          <CuponCard
            key={cupon.id}
            cupon={cupon}
            onDescargarPDF={onDescargarPDF}
            onVerDetalle={onVerDetalle}
          />
        ))}
      </div>
    </div>
  );
};
