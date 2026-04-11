import React, { useState } from 'react';
import { useCupones } from '../hooks/useCupones';
import {CuponCard} from '../components/cupones/CuponCard';
import {CuponDetalle} from '../components/cupones/CuponDetalle';
import { generarPDFCupon } from '../utils/pdfGenerator';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';

export const MisCupones = () => {

    const {
        cuponesDisponibles,
        cuponesCanjeados,
        cuponesVencidos,
        loading,
        error,
        estadisticas,
        fetchCupones,
        canjearCupon
    } = useCupones();

    const { user } = useAuth();

    const [cuponSeleccionado, setCuponSeleccionado] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('disponibles');
    const [descargando, setDescargando] = useState(false);
    const [notificacion, setNotificacion] = useState(null);

    // Mostrar notificación temporal
    const mostrarNotificacion = (tipo, texto) => {
        setNotificacion({ tipo, texto });
        setTimeout(() => setNotificacion(null), 5000);
    };

    // Manejar canje de cupón
    const handleCanjearCupon = async (cupon) => {
        try {
            const dui = user?.dui;
            if (!dui) {
                throw new Error('Tu perfil no tiene DUI registrado. Actualiza tu perfil para poder canjear cupones.');
            }
            await canjearCupon(cupon.codigo, dui);
            mostrarNotificacion('exito', `¡Cupón "${cupon.tituloOferta}" canjeado exitosamente! 🎉`);
            // Los cupones se recargan automáticamente en el hook
        } catch (error) {
            if (error.message.includes('ya fue canjeado')) {
                mostrarNotificacion('warning', 'Este cupón ya ha sido canjeado anteriormente.');
            } else if (error.message.includes('vencido')) {
                mostrarNotificacion('error', 'Este cupón está vencido y no puede ser canjeado.');
            } else if (error.message.includes('DUI')) {
                mostrarNotificacion('error', error.message);
            } else {
                mostrarNotificacion('error', error.message || 'Error al canjear el cupón.');
            }
            throw error; // Re-throw so CuponCard can show its own message
        }
    };

    // Manejar descarga de PDF
    const handleDescargarPDF = async (cuponId) => {
        setDescargando(true);
        try {
            // Buscar el cupón completo
            const cupon = [...cuponesDisponibles, ...cuponesCanjeados, ...cuponesVencidos]
                .find(c => c.id === cuponId);

            if (!cupon) {
                alert('Cupón no encontrado');
                return;
            }

            // Generar y descargar PDF
            await generarPDFCupon(cupon);

            // Mostrar mensaje de éxito
            mostrarNotificacion('exito', 'PDF descargado exitosamente');
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            mostrarNotificacion('error', 'Error al generar el PDF. Por favor intenta de nuevo.');
        } finally {
            setDescargando(false);
        }
    };

    // Manejar ver detalle
    const handleVerDetalle = (cupon) => {
        setCuponSeleccionado(cupon);
        setMostrarDetalle(true);
    };

    // Cerrar modal de detalle
    const handleCerrarDetalle = () => {
        setMostrarDetalle(false);
        setCuponSeleccionado(null);
    };

    // Renderizar cupones según la vista activa
    const renderCupones = () => {
        let cupones = [];
        let mensaje = '';
        let icono = '';

        switch (vistaActiva) {
            case 'disponibles':
                cupones = cuponesDisponibles;
                mensaje = 'No tienes cupones disponibles';
                icono = '🎫';
                break;
            case 'canjeados':
                cupones = cuponesCanjeados;
                mensaje = 'No tienes cupones canjeados';
                icono = '✔️';
                break;
            case 'vencidos':
                cupones = cuponesVencidos;
                mensaje = 'No tienes cupones vencidos';
                icono = '⏰';
                break;
            default:
                cupones = cuponesDisponibles;
        }

        if (cupones.length === 0) {
            return (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">{icono}</div>
                    <p className="text-gray-500 text-lg mb-2">{mensaje}</p>
                    {vistaActiva === 'disponibles' && (
                        <>
                            <p className="text-gray-400 text-sm mb-6">
                                Compra ofertas y tus cupones aparecerán aquí para ser canjeados
                            </p>
                            <button
                                onClick={() => window.location.href = '/ofertas'}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                🔍 Explorar Ofertas
                            </button>
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cupones.map(cupon => (
                    <CuponCard
                        key={cupon.id}
                        cupon={cupon}
                        onDescargarPDF={handleDescargarPDF}
                        onVerDetalle={handleVerDetalle}
                        onCanjear={vistaActiva === 'disponibles' ? handleCanjearCupon : undefined}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando tus cupones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchCupones}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Cupones</h1>
                    <p className="text-gray-600">Administra, canjea y utiliza tus cupones de descuento</p>
                </div>

                {/* Notificación global */}
                {notificacion && (
                    <div className={`mb-6 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-down transition-all duration-300 ${
                        notificacion.tipo === 'exito' 
                            ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-800' 
                            : notificacion.tipo === 'warning'
                            ? 'bg-yellow-50 border-2 border-yellow-300 text-yellow-800'
                            : 'bg-red-50 border-2 border-red-300 text-red-800'
                    }`}>
                        <span className="text-2xl">
                            {notificacion.tipo === 'exito' ? '🎉' : notificacion.tipo === 'warning' ? '⚠️' : '❌'}
                        </span>
                        <span className="font-semibold flex-1">{notificacion.texto}</span>
                        <button 
                            onClick={() => setNotificacion(null)}
                            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                    {/* Total */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold">Total</p>
                                <p className="text-3xl font-bold text-gray-800">{estadisticas.total}</p>
                            </div>
                            <div className="text-4xl">🎫</div>
                        </div>
                    </div>

                    {/* Disponibles */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 text-sm font-semibold">Disponibles</p>
                                <p className="text-3xl font-bold text-emerald-600">{estadisticas.disponibles}</p>
                            </div>
                            <div className="text-4xl">✅</div>
                        </div>
                    </div>

                    {/* Canjeados */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-gray-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold">Canjeados</p>
                                <p className="text-3xl font-bold text-gray-600">{estadisticas.canjeados}</p>
                            </div>
                            <div className="text-4xl">✔️</div>
                        </div>
                    </div>

                    {/* Ahorro Total */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm font-semibold">Ahorro Total</p>
                                <p className="text-3xl font-bold text-white">
                                    ${estadisticas.ahorroTotal.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-4xl">💰</div>
                        </div>
                    </div>
                </div>

                {/* Tabs de navegación */}
                <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                    <div className="flex border-b">
                        <button
                            onClick={() => setVistaActiva('disponibles')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${vistaActiva === 'disponibles'
                                    ? 'text-emerald-600 border-b-3 border-emerald-600 bg-emerald-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span>✅</span> Disponibles ({cuponesDisponibles.length})
                        </button>
                        <button
                            onClick={() => setVistaActiva('canjeados')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${vistaActiva === 'canjeados'
                                    ? 'text-gray-700 border-b-3 border-gray-600 bg-gray-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span>✔️</span> Canjeados ({cuponesCanjeados.length})
                        </button>
                        <button
                            onClick={() => setVistaActiva('vencidos')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${vistaActiva === 'vencidos'
                                    ? 'text-red-600 border-b-3 border-red-600 bg-red-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span>⏰</span> Vencidos ({cuponesVencidos.length})
                        </button>
                    </div>
                </div>

                {/* Lista de cupones */}
                <div className="mb-8">
                    {renderCupones()}
                </div>

                {/* Indicador de descarga */}
                {descargando && (
                    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generando PDF...</span>
                    </div>
                )}

                {/* Modal de detalle */}
                {mostrarDetalle && cuponSeleccionado && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <CuponDetalle
                                cupon={cuponSeleccionado}
                                onDescargarPDF={handleDescargarPDF}
                                onCerrar={handleCerrarDetalle}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
        <Footer />
    </>
    );
};
