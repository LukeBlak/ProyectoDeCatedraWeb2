import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Button } from '../common/Button';

export const OfertaCard = ({ oferta }) => {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false);
  
  const {
    id,
    titulo,
    descripcion,
    imagen,
    precioOriginal,
    precioDescuento,
    descuento,
    fechaExpiracion,
    rubro,
    limiteVentas,
    cuponesVendidos = 0,
  } = oferta;

  // Determinar si está agotada
  const esSoldOut = limiteVentas != null && cuponesVendidos >= limiteVentas;
  const cuposRestantes = limiteVentas != null ? Math.max(0, limiteVentas - cuponesVendidos) : null;
  const porcentajeVendido = limiteVentas != null ? Math.min((cuponesVendidos / limiteVentas) * 100, 100) : 0;
  const pocosRestantes = cuposRestantes != null && cuposRestantes > 0 && cuposRestantes <= 10;

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

  const handleComprar = (e) => {
    e.stopPropagation();
    if (esSoldOut) return;

    const precioRegular = oferta.precioRegular || oferta.precioOriginal || 0;
    const precioOferta = oferta.precioOferta || oferta.precioDescuento || 0;
    const iconoImg = oferta.imagen || oferta.img || oferta.icono || '';

    agregarAlCarrito({
      id: oferta.id,
      titulo: oferta.titulo,
      empresa: oferta.empresa || oferta.rubro || 'Empresa',
      precioOferta: precioOferta,
      precioRegular: precioRegular,
      icono: iconoImg,
      cantidad: 1
    });

    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform cursor-pointer relative
        ${esSoldOut 
          ? 'opacity-75 hover:shadow-lg' 
          : 'hover:shadow-2xl hover:-translate-y-2'}`}
    >
      {/* Banner SOLD OUT */}
      {esSoldOut && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 rounded-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg]">
            <div className="bg-red-600 text-white font-black text-2xl px-8 py-3 rounded-lg shadow-2xl border-4 border-white tracking-widest uppercase">
              SOLD OUT
            </div>
          </div>
        </div>
      )}

      {/* Header de imagen */}
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

      {/* Contenido */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{titulo}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{descripcion}</p>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-gray-400 line-through text-lg">
            ${Number(precioOriginal || 0).toFixed(2)}
          </span>
          <span className="text-3xl font-bold text-green-600">
            ${Number(precioDescuento || 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-green-600 font-semibold">
            ¡Ahorras ${(precioOriginal - precioDescuento)?.toFixed(2)}!
          </span>
          <span className="text-xs text-gray-500">Vence: {fechaExp}</span>
        </div>

        {/* Barra de progreso de ventas */}
        {limiteVentas != null && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 font-medium">Cupones disponibles</span>
              <span className={`text-xs font-bold ${esSoldOut ? 'text-red-600' : pocosRestantes ? 'text-orange-500' : 'text-gray-600'}`}>
                {esSoldOut ? '¡Agotado!' : `${cuposRestantes} restantes`}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  esSoldOut ? 'bg-red-500' : pocosRestantes ? 'bg-orange-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${porcentajeVendido}%` }}
              />
            </div>
            {pocosRestantes && !esSoldOut && (
              <p className="text-xs text-orange-500 font-semibold mt-1 flex items-center gap-1">
                🔥 ¡Quedan pocos! Date prisa
              </p>
            )}
          </div>
        )}

        {/* Botón */}
        {esSoldOut ? (
          <button
            disabled
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            🚫 Cupones agotados
          </button>
        ) : (
          <Button 
            className={`w-full ${agregado ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : ''}`}
            onClick={handleComprar}
          >
            {agregado ? '¡Añadido! ✓' : '🛒 Comprar'}
          </Button>
        )}
      </div>
    </div>
  );
};
