import React from 'react';
import { formatearFecha, formatearPrecio } from '../../utils/formatters';

export const CuponCard = ({ cupon, onDescargarPDF, onVerDetalle }) => {
    const obtenerEstiloEstado = () => {
        if (cupon.estado === 'canjeado') {
            return {
                bg: 'bg-gray-100',
                border: 'border-gray-300',
                badge: 'bg-gray-500',
                texto: 'text-gray-500'
            };
        }

        const ahora = new Date();
        const fechaLimite = new Date(cupon.fechaLimiteUso);

        if (fechaLimite <= ahora) {
            return {
                bg: 'bg-red-50',
                border: 'border-red-300',
                badge: 'bg-red-500',
                texto: 'text-red-600'
            };
        }

        return {
            bg: 'bg-white',
            border: 'border-green-400',
            badge: 'bg-green-500',
            texto: 'text-green-600'
        };
    };

    const obtenerTextoEstado = () => {
        if (cupon.estado === 'canjeado') {
            return 'Canjeado';
        }

        const ahora = new Date();
        const fechaLimite = new Date(cupon.fechaLimiteUso);

        if (fechaLimite <= ahora) {
            return 'Vencido';
        }

        return 'Disponible';
    };

    const calcularDescuento = () => {
        const descuento = cupon.precioRegular - cupon.precioOferta;
        const porcentaje = Math.round((descuento / cupon.precioRegular) * 100);
        return porcentaje;
    };

    const estilos = obtenerEstiloEstado();
    const estadoTexto = obtenerTextoEstado();
    const porcentajeDescuento = calcularDescuento();
    const estaDisponible = cupon.estado === 'disponible' && new Date(cupon.fechaLimiteUso) > new Date();

    return (
        <div className={`${estilos.bg} border-2 ${estilos.border} rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow`}>

            <div className="flex justify-between items-start mb-3">
                <span className={`${estilos.badge} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {estadoTexto}
                </span>
                <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {porcentajeDescuento}% OFF
                </span>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {cupon.tituloOferta || 'Cupón de descuento'}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                    {cupon.empresaOfertante || cupon.empresa}
                </p>

                <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400 line-through text-sm">
                        {formatearPrecio(cupon.precioRegular)}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                        {formatearPrecio(cupon.precioOferta)}
                    </span>
                </div>

                <p className="text-sm text-green-600 font-semibold">
                    Ahorras: {formatearPrecio(cupon.precioRegular - cupon.precioOferta)}
                </p>
            </div>

            <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-3 mb-3">
                <p className="text-xs text-gray-500 mb-1">Código del cupón:</p>
                <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">
                    {cupon.codigo}
                </p>
            </div>

            <div className="mb-4 text-sm text-gray-600">
                <p className="mb-1">
                    <span className="font-semibold">Comprado:</span> {formatearFecha(cupon.fechaCompra)}
                </p>
                <p className={estaDisponible ? 'text-gray-600' : 'text-red-600 font-semibold'}>
                    <span className="font-semibold">Válido hasta:</span> {formatearFecha(cupon.fechaLimiteUso)}
                </p>
                {cupon.estado === 'canjeado' && cupon.fechaCanje && (
                    <p className="text-gray-500">
                        <span className="font-semibold">Canjeado:</span> {formatearFecha(cupon.fechaCanje)}
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                {estaDisponible && onDescargarPDF && (
                    <button
                        onClick={() => onDescargarPDF(cupon.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                        📄 Descargar PDF
                    </button>
                )}

                {onVerDetalle && (
                    <button
                        onClick={() => onVerDetalle(cupon)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                        👁️ Ver Detalle
                    </button>
                )}
            </div>

            {!estaDisponible && (
                <div className={`mt-3 p-2 rounded text-center text-sm font-semibold ${cupon.estado === 'canjeado' ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {cupon.estado === 'canjeado' ? '✓ Este cupón ya fue utilizado' : '⚠️ Este cupón ha expirado'}
                </div>
            )}
        </div>
    );
};

