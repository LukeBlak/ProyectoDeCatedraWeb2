import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OfertaDetalle = ({ oferta, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🎫</div>
          <p className="text-purple-600 text-xl">Cargando oferta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center bg-red-50 p-8 rounded-2xl">
          <div className="text-6xl mb-4">😅</div>
          <p className="text-red-600 text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-xl mb-4">Oferta no encontrada</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const {
    titulo,
    descripcion,
    imagen,
    precioOriginal,
    precioDescuento,
    descuento,
    fechaInicio,
    fechaExpiracion,
    rubro,
    disponible
  } = oferta;

  const fechaInicioStr = fechaInicio?.toDate?.() 
    ? new Date(fechaInicio.toDate()).toLocaleDateString() 
    : 'No disponible';
  
  const fechaExpStr = fechaExpiracion?.toDate?.() 
    ? new Date(fechaExpiracion.toDate()).toLocaleDateString() 
    : 'No disponible';

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 relative">
          {imagen ? (
            <img src={imagen} alt={titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-96 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
              <span className="text-9xl">🎫</span>
            </div>
          )}
          {!disponible && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white text-2xl font-bold px-6 py-3 rounded-lg transform -rotate-45">
                NO DISPONIBLE
              </span>
            </div>
          )}
        </div>
        
        <div className="md:w-1/2 p-8">
          <div className="mb-6">
            <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full capitalize">
              {rubro}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{titulo}</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 text-lg leading-relaxed">{descripcion}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-400 line-through text-2xl">
                ${precioOriginal?.toFixed(2)}
              </span>
              <span className="text-5xl font-bold text-green-600">
                ${precioDescuento?.toFixed(2)}
              </span>
              {descuento && (
                <span className="bg-green-100 text-green-800 text-lg font-bold px-4 py-2 rounded-full">
                  -{descuento}%
                </span>
              )}
            </div>
            
            <p className="text-green-600 font-semibold text-lg">
              ¡Ahorras ${(precioOriginal - precioDescuento)?.toFixed(2)}!
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Válido desde:</span> {fechaInicioStr}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Vence:</span> {fechaExpStr}
            </p>
          </div>
          
          {disponible ? (
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg">
              Canjear oferta
            </button>
          ) : (
            <button disabled className="w-full bg-gray-300 text-gray-500 text-xl font-bold py-4 rounded-xl cursor-not-allowed">
              No disponible
            </button>
          )}
          
          <button 
            onClick={() => navigate('/')}
            className="w-full mt-4 bg-gray-100 text-gray-600 text-lg font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all"
          >
            ← Volver a ofertas
          </button>
        </div>
      </div>
    </div>
  );
};