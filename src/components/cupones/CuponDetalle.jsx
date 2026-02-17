import React from 'react';
import { formatearFecha, formatearPrecio } from '../../utils/formatters';

export const CuponDetalle = ({ cupon, onDescargarPDF, onCerrar }) => {
  const calcularDescuento = () => {
    const descuento = cupon.precioRegular - cupon.precioOferta;
    const porcentaje = Math.round((descuento / cupon.precioRegular) * 100);
    return { monto: descuento, porcentaje };
  };

  const estaDisponible = () => {
    if (cupon.estado === 'canjeado') return false;
    const ahora = new Date();
    const fechaLimite = new Date(cupon.fechaLimiteUso);
    return fechaLimite > ahora;
  };
  
  const obtenerEstiloEstado = () => {
    if (cupon.estado === 'canjeado') {
      return {
        bg: 'bg-gray-500',
        texto: 'Canjeado'
      };
    }

    if (!estaDisponible()) {
      return {
        bg: 'bg-red-500',
        texto: 'Vencido'
      };
    }

    return {
      bg: 'bg-green-500',
      texto: 'Disponible'
    };
  };

  // Calcular días restantes
  const diasRestantes = () => {
    if (!estaDisponible()) return 0;
    const ahora = new Date();
    const fechaLimite = new Date(cupon.fechaLimiteUso);
    const diferencia = fechaLimite - ahora;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  const descuento = calcularDescuento();
  const disponible = estaDisponible();
  const estiloEstado = obtenerEstiloEstado();
  const dias = diasRestantes();

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto">
      
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{cupon.tituloOferta}</h2>
            <p className="text-blue-100 text-lg">{cupon.empresaOfertante}</p>
          </div>
          
          {onCerrar && (
            <button
              onClick={onCerrar}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-4">
          <span className={`${estiloEstado.bg} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
            {estiloEstado.texto}
          </span>
        </div>
      </div>

      <div className="p-6">
        
        <div className="bg-linear-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="inline-block bg-orange-500 text-white text-2xl font-bold px-6 py-3 rounded-full shadow-lg">
              {descuento.porcentaje}% DE DESCUENTO
            </div>
          </div>

          <div className="flex justify-center items-center gap-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Precio Regular</p>
              <p className="text-gray-400 line-through text-2xl font-semibold">
                {formatearPrecio(cupon.precioRegular)}
              </p>
            </div>

            <div className="text-4xl text-gray-400">→</div>

            <div className="text-center">
              <p className="text-green-700 text-sm mb-1 font-semibold">Precio con Cupón</p>
              <p className="text-green-600 text-4xl font-bold">
                {formatearPrecio(cupon.precioOferta)}
              </p>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-green-700 text-xl font-bold">
              ¡Ahorras {formatearPrecio(descuento.monto)}!
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <p className="text-center text-gray-600 text-sm mb-2">CÓDIGO DEL CUPÓN</p>
          <p className="text-center text-3xl font-mono font-bold text-gray-800 tracking-widest mb-3">
            {cupon.codigo}
          </p>
          <p className="text-center text-gray-500 text-xs">
            Presenta este código en el establecimiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛒</span>
              <div>
                <p className="text-blue-900 font-semibold text-sm">Fecha de Compra</p>
                <p className="text-blue-700 text-lg font-bold">
                  {formatearFecha(cupon.fechaCompra)}
                </p>
              </div>
            </div>
          </div>

          <div className={`${disponible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{disponible ? '📅' : '⚠️'}</span>
              <div>
                <p className={`${disponible ? 'text-green-900' : 'text-red-900'} font-semibold text-sm`}>
                  Válido Hasta
                </p>
                <p className={`${disponible ? 'text-green-700' : 'text-red-700'} text-lg font-bold`}>
                  {formatearFecha(cupon.fechaLimiteUso)}
                </p>
                {disponible && dias > 0 && (
                  <p className="text-green-600 text-xs mt-1">
                    {dias} {dias === 1 ? 'día restante' : 'días restantes'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {cupon.estado === 'canjeado' && cupon.fechaCanje && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">Fecha de Canje</p>
                  <p className="text-gray-700 text-lg font-bold">
                    {formatearFecha(cupon.fechaCanje)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {cupon.descripcion && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Descripción de la Oferta</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line">
                {cupon.descripcion}
              </p>
            </div>
          </div>
        )}

        {cupon.otrosDetalles && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">ℹ️ Términos y Condiciones</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {cupon.otrosDetalles}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">👤 Información del Comprador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-600 text-sm">Nombre</p>
              <p className="text-gray-800 font-semibold">
                {cupon.nombreCliente || 'No especificado'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">DUI</p>
              <p className="text-gray-800 font-semibold font-mono">
                {cupon.dui}
              </p>
            </div>
          </div>
        </div>

        {!disponible && (
          <div className={`${cupon.estado === 'canjeado' ? 'bg-gray-100 border-gray-300' : 'bg-red-100 border-red-300'} border-2 rounded-lg p-4 mb-6`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{cupon.estado === 'canjeado' ? '✓' : '⚠️'}</span>
              <div>
                <p className={`${cupon.estado === 'canjeado' ? 'text-gray-800' : 'text-red-800'} font-bold text-lg`}>
                  {cupon.estado === 'canjeado' ? 'Este cupón ya fue utilizado' : 'Este cupón ha expirado'}
                </p>
                <p className={`${cupon.estado === 'canjeado' ? 'text-gray-600' : 'text-red-600'} text-sm`}>
                  {cupon.estado === 'canjeado' 
                    ? 'No puede ser usado nuevamente' 
                    : 'Ya no puede ser canjeado en el establecimiento'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {disponible && onDescargarPDF && (
            <button
              onClick={() => onDescargarPDF(cupon.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">📄</span>
              Descargar PDF
            </button>
          )}
          
          {onCerrar && (
            <button
              onClick={onCerrar}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>

        {disponible && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">📌 Cómo usar tu cupón:</h4>
            <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
              <li>Descarga el PDF o guarda el código del cupón</li>
              <li>Presenta el cupón en {cupon.empresaOfertante}</li>
              <li>Muestra tu DUI para verificación</li>
              <li>¡Disfruta tu descuento!</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
