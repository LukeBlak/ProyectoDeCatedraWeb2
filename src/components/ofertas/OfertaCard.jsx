// src/components/ofertas/OfertaCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OfertaCard = ({ oferta }) => {
  const navigate = useNavigate();
  
  const {
    id,
    titulo,
    descripcion,
    imagen,
    precioOriginal,
    precioDescuento,
    descuento,
    fechaExpiracion,
    rubro
  } = oferta;

  const fechaExp = fechaExpiracion?.toDate?.() 
    ? new Date(fechaExpiracion.toDate()).toLocaleDateString() 
    : 'Fecha no disponible';

  const handleClick = () => {
    navigate(`/detalle-oferta/${id}`);
  };

  const getRubroColor = (rubro) => {
    const colores = {
      'comida': 'from-orange-400 to-red-500',
      'restaurantes': 'from-orange-400 to-red-500',
      'belleza': 'from-pink-400 to-purple-500',
      'spa': 'from-pink-400 to-purple-500',
      'fitness': 'from-green-400 to-emerald-600',
      'entretenimiento': 'from-blue-400 to-indigo-600',
      'cine': 'from-blue-400 to-indigo-600',
    };
    return colores[rubro?.toLowerCase()] || 'from-purple-400 to-pink-500';
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
    >
      <div className={`bg-gradient-to-r ${getRubroColor(rubro)} p-6 text-center relative`}>
        <div className="absolute top-3 right-3 bg-white text-purple-600 font-bold px-3 py-1 rounded-full text-sm shadow">
          {descuento}% OFF
        </div>
        {imagen ? (
          <img src={imagen} alt={titulo} className="w-32 h-32 mx-auto object-cover rounded-full border-4 border-white" />
        ) : (
          <div className="text-6xl mb-2">🎫</div>
        )}
        <h3 className="text-white font-bold text-xl mt-2 capitalize">{rubro}</h3>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{titulo}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{descripcion}</p>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-gray-400 line-through text-lg">
            ${precioOriginal?.toFixed(2)}
          </span>
          <span className="text-3xl font-bold text-green-600">
            ${precioDescuento?.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-green-600 font-semibold">
            ¡Ahorras ${(precioOriginal - precioDescuento)?.toFixed(2)}!
          </span>
          <span className="text-xs text-gray-500">Vence: {fechaExp}</span>
        </div>
      </div>
    </div>
  );
};