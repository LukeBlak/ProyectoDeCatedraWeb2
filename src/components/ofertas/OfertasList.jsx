// src/components/ofertas/OfertasList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const OfertasList = ({ ofertas, loading, error }) => {
  const [rubroFiltro, setRubroFiltro] = useState('todos');

  // Obtener rubros únicos
  const rubros = ['todos', ...new Set(ofertas.map(o => o.rubro))];

  // Filtrar ofertas
  const ofertasFiltradas = rubroFiltro === 'todos' 
    ? ofertas 
    : ofertas.filter(o => o.rubro === rubroFiltro);

  // Calcular descuento
  const calcularDescuento = (precioOriginal, precioDescuento) => {
    if (!precioOriginal || !precioDescuento) return 0;
    return Math.round(((precioOriginal - precioDescuento) / precioOriginal) * 100);
  };

  // 🛒 Función placeholder para añadir al carrito (Futura integración)
  const handleAñadirAlCarrito = (oferta) => {
    console.log('🛒 [CARRITO] Añadiendo oferta al carrito:', {
      id: oferta.id,
      titulo: oferta.titulo,
      precio: oferta.precioDescuento,
      cantidad: 1
    });
    
    // 🔜 Aquí irá la lógica real del carrito:
    // 1. Dispatch a un contexto de carrito (CartContext)
    // 2. Guardar en localStorage para persistencia
    // 3. Mostrar notificación toast de "Añadido"
    
    // Por ahora, mostramos una alerta temporal
    alert(`✅ "${oferta.titulo}" se añadirá al carrito en la próxima actualización`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando ofertas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros por Rubro */}
      <div className="mb-8 flex flex-wrap gap-3">
        {rubros.map(rubro => (
          <button
            key={rubro}
            onClick={() => setRubroFiltro(rubro)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              rubroFiltro === rubro
                ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {rubro === 'todos' ? 'Todas' : rubro.charAt(0).toUpperCase() + rubro.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid de Ofertas */}
      {ofertasFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">No hay ofertas disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ofertasFiltradas.map(oferta => {
            const descuento = calcularDescuento(oferta.precioOriginal, oferta.precioDescuento);
            
            return (
              <div 
                key={oferta.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sky-100 to-emerald-100">
                  {oferta.img ? (
                    <img 
                      src={oferta.img} 
                      alt={oferta.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🎁
                    </div>
                  )}
                  
                  {/* Badge de descuento */}
                  <div className="absolute top-3 right-3 bg-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                    {descuento}% OFF
                  </div>

                  {/* Badge de disponibilidad */}
                  {oferta.disponible && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                      Disponible
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5">
                  {/* Rubro */}
                  <span className="text-xs text-sky-600 font-semibold uppercase">
                    {oferta.rubro}
                  </span>

                  {/* Título */}
                  <h3 className="text-lg font-bold text-gray-800 mt-2 mb-3 line-clamp-2">
                    {oferta.titulo}
                  </h3>

                  {/* Descripción */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {oferta.descripcion}
                  </p>

                  {/* Precios */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gray-400 line-through text-sm">
                      ${oferta.precioOriginal?.toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ${oferta.precioDescuento?.toFixed(2)}
                    </span>
                  </div>

                  {/* Info adicional */}
                  <div className="text-xs text-gray-500 mb-4">
                    <p>💰 Ahorras: ${(oferta.precioOriginal - oferta.precioDescuento)?.toFixed(2)}</p>
                    <p>🎫 Disponibles: {oferta.cantidadLimite ? oferta.cantidadLimite - (oferta.cuponesVendidos || 0) : 'Ilimitados'}</p>
                  </div>

                  {/* Botón de compra - Preparado para carrito */}
                  <button
                    onClick={() => handleAñadirAlCarrito(oferta)}
                    disabled={!oferta.disponible}
                    className={`block w-full font-bold py-3 px-4 rounded-lg text-center transition flex items-center justify-center gap-2 ${
                      oferta.disponible
                        ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    🛒 Comprar
                  </button>
                  
                  {/* Hint para futura funcionalidad */}
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Próximamente: Carrito de compras
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};