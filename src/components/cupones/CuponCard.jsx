import React, { useState } from 'react';
import { formatearFecha, formatearPrecio } from '../../utils/formatters';

export const CuponCard = ({ cupon, onDescargarPDF, onVerDetalle, onCanjear }) => {
    const [canjeando, setCanjeando] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const obtenerEstiloEstado = () => {
        if (cupon.estado === 'canjeado') {
            return {
                bg: 'bg-gray-50',
                border: 'border-gray-300',
                badge: 'bg-gray-500',
                badgeIcon: '✔️',
                texto: 'text-gray-500',
                gradientFrom: 'from-gray-400',
                gradientTo: 'to-gray-500'
            };
        }

        const ahora = new Date();
        const fechaLimite = new Date(cupon.fechaLimiteUso);

        if (fechaLimite <= ahora) {
            return {
                bg: 'bg-red-50',
                border: 'border-red-300',
                badge: 'bg-red-500',
                badgeIcon: '⏰',
                texto: 'text-red-600',
                gradientFrom: 'from-red-400',
                gradientTo: 'to-red-500'
            };
        }

        return {
            bg: 'bg-white',
            border: 'border-emerald-400',
            badge: 'bg-emerald-500',
            badgeIcon: '✅',
            texto: 'text-emerald-600',
            gradientFrom: 'from-emerald-400',
            gradientTo: 'to-emerald-600'
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

    const calcularDiasRestantes = () => {
        const ahora = new Date();
        const fechaLimite = new Date(cupon.fechaLimiteUso);
        const diferencia = fechaLimite - ahora;
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    };

    const handleCanjear = async () => {
        if (!onCanjear) return;
        setCanjeando(true);
        setMensaje(null);
        try {
            await onCanjear(cupon);
            setMensaje({ tipo: 'exito', texto: '¡Cupón canjeado exitosamente!' });
        } catch (error) {
            setMensaje({ tipo: 'error', texto: error.message || 'Error al canjear el cupón' });
        } finally {
            setCanjeando(false);
        }
    };

    const estilos = obtenerEstiloEstado();
    const estadoTexto = obtenerTextoEstado();
    const porcentajeDescuento = calcularDescuento();
    const estaDisponible = cupon.estado === 'disponible' && new Date(cupon.fechaLimiteUso) > new Date();
    const diasRestantes = estaDisponible ? calcularDiasRestantes() : 0;

    return (
        <div className={`${estilos.bg} border-2 ${estilos.border} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden`}>
            
            {/* Banner de estado para canjeados y vencidos */}
            {cupon.estado === 'canjeado' && (
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2.5 flex items-center gap-2">
                    <span className="text-lg">✔️</span>
                    <span className="font-semibold text-sm">Cupón utilizado</span>
                    {cupon.fechaCanje && (
                        <span className="ml-auto text-xs opacity-80">
                            Canjeado el {formatearFecha(cupon.fechaCanje)}
                        </span>
                    )}
                </div>
            )}
            {cupon.estado !== 'canjeado' && !estaDisponible && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span className="font-semibold text-sm">Cupón vencido</span>
                    <span className="ml-auto text-xs opacity-80">
                        Venció el {formatearFecha(cupon.fechaLimiteUso)}
                    </span>
                </div>
            )}

            <div className="p-5">
                {/* Header: Badge + Descuento */}
                <div className="flex justify-between items-start mb-3">
                    <span className={`${estilos.badge} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
                        {estilos.badgeIcon} {estadoTexto}
                    </span>
                    <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                        {porcentajeDescuento}% OFF
                    </span>
                </div>

                {/* Info de la oferta */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                        {cupon.tituloOferta || 'Cupón de descuento'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                        🏢 {cupon.empresaOfertante || cupon.empresa}
                    </p>

                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-gray-400 line-through text-sm">
                            {formatearPrecio(cupon.precioRegular)}
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                            {formatearPrecio(cupon.precioOferta)}
                        </span>
                    </div>
                    <p className="text-sm text-emerald-600 font-semibold">
                        💰 Ahorras: {formatearPrecio(cupon.precioRegular - cupon.precioOferta)}
                    </p>
                </div>

                {/* Código del cupón */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1 text-center">Código del cupón:</p>
                    <p className="text-lg font-mono font-bold text-gray-800 tracking-wider text-center">
                        {cupon.codigo}
                    </p>
                </div>

                {/* Fechas */}
                <div className="mb-4 text-sm text-gray-600 space-y-1">
                    <p>
                        <span className="font-semibold">📅 Comprado:</span> {formatearFecha(cupon.fechaCompra)}
                    </p>
                    <p className={estaDisponible ? 'text-gray-600' : 'text-red-600 font-semibold'}>
                        <span className="font-semibold">{estaDisponible ? '📅' : '⚠️'} Válido hasta:</span> {formatearFecha(cupon.fechaLimiteUso)}
                    </p>
                    {estaDisponible && diasRestantes > 0 && (
                        <p className={`text-xs font-semibold ${diasRestantes <= 3 ? 'text-orange-500' : 'text-emerald-500'}`}>
                            ⏳ {diasRestantes} {diasRestantes === 1 ? 'día restante' : 'días restantes'}
                        </p>
                    )}
                </div>

                {/* Mensaje de resultado de canje */}
                {mensaje && (
                    <div className={`mb-3 p-3 rounded-lg text-sm font-semibold text-center animate-fade-in ${
                        mensaje.tipo === 'exito' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {mensaje.tipo === 'exito' ? '🎉' : '❌'} {mensaje.texto}
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-col gap-2">
                    {/* Botón Canjear - Solo para disponibles */}
                    {estaDisponible && onCanjear && (
                        <button
                            onClick={handleCanjear}
                            disabled={canjeando}
                            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md
                                ${canjeando 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg transform hover:scale-[1.02]'
                                }`}
                        >
                            {canjeando ? (
                                <>
                                    <span className="animate-spin text-lg">⏳</span>
                                    <span>Canjeando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">🎫</span>
                                    <span>Canjear Cupón</span>
                                </>
                            )}
                        </button>
                    )}

                    <div className="flex gap-2">
                        {estaDisponible && onDescargarPDF && (
                            <button
                                onClick={() => onDescargarPDF(cupon.id)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                            >
                                📄 Descargar PDF
                            </button>
                        )}

                        {onVerDetalle && (
                            <button
                                onClick={() => onVerDetalle(cupon)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                            >
                                👁️ Ver Detalle
                            </button>
                        )}
                    </div>
                </div>

                {/* Aviso para no disponibles */}
                {!estaDisponible && (
                    <div className={`mt-3 p-3 rounded-lg text-center text-sm font-semibold flex items-center justify-center gap-2 ${
                        cupon.estado === 'canjeado' 
                            ? 'bg-gray-100 text-gray-600 border border-gray-300' 
                            : 'bg-red-100 text-red-600 border border-red-300'
                    }`}>
                        {cupon.estado === 'canjeado' ? (
                            <>✓ Este cupón ya fue utilizado</>
                        ) : (
                            <>⚠️ Este cupón ha expirado y no puede ser canjeado</>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
