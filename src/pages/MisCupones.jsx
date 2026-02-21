import React, { useState } from 'react';
import { useCupones } from '../hooks/useCupones';
import {CuponCard} from '../components/cupones/CuponCard';
import {CuponDetalle} from '../components/cupones/CuponDetalle';
import { generarPDFCupon } from '../utils/pdfGenerator';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const MisCupones = () => {
    
    const {
        cuponesDisponibles,
        cuponesCanjeados,
        cuponesVencidos,
        loading,
        error,
        estadisticas,
        fetchCupones
    } = useCupones();

    const [cuponSeleccionado, setCuponSeleccionado] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('disponibles');
    const [descargando, setDescargando] = useState(false);

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
            alert('PDF descargado exitosamente');
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert('Error al generar el PDF. Por favor intenta de nuevo.');
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

        switch (vistaActiva) {
            case 'disponibles':
                cupones = cuponesDisponibles;
                mensaje = 'No tienes cupones disponibles';
                break;
            case 'canjeados':
                cupones = cuponesCanjeados;
                mensaje = 'No tienes cupones canjeados';
                break;
            case 'vencidos':
                cupones = cuponesVencidos;
                mensaje = 'No tienes cupones vencidos';
                break;
            default:
                cupones = cuponesDisponibles;
        }

        if (cupones.length === 0) {
            return (
                <div className="text-center py-12">
                    <img src="/icons/cupon.png" className="mx-auto mb-4 w-16 h-16" />
                    <p className="text-gray-500 text-lg">{mensaje}</p>
                    {vistaActiva === 'disponibles' && (
                        <button
                            onClick={() => window.location.href = '/'}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Explorar Ofertas
                        </button>
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
                    <p className="text-gray-600">Administra y utiliza tus cupones de descuento</p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                    {/* Total */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold">Total</p>
                                <p className="text-3xl font-bold text-gray-800">{estadisticas.total}</p>
                            </div>
                            <div className="text-4xl">🎫</div>
                        </div>
                    </div>

                    {/* Disponibles */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-semibold">Disponibles</p>
                                <p className="text-3xl font-bold text-green-600">{estadisticas.disponibles}</p>
                            </div>
                            <div className="text-4xl">✅</div>
                        </div>
                    </div>

                    {/* Canjeados */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold">Canjeados</p>
                                <p className="text-3xl font-bold text-gray-600">{estadisticas.canjeados}</p>
                            </div>
                            <div className="text-4xl">✔️</div>
                        </div>
                    </div>

                    {/* Ahorro Total */}
                    <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-lg shadow p-6">
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
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setVistaActiva('disponibles')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${vistaActiva === 'disponibles'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Disponibles ({cuponesDisponibles.length})
                        </button>
                        <button
                            onClick={() => setVistaActiva('canjeados')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${vistaActiva === 'canjeados'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Canjeados ({cuponesCanjeados.length})
                        </button>
                        <button
                            onClick={() => setVistaActiva('vencidos')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${vistaActiva === 'vencidos'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Vencidos ({cuponesVencidos.length})
                        </button>
                    </div>
                </div>

                {/* Lista de cupones */}
                <div className="mb-8">
                    {renderCupones()}
                </div>

                {/* Indicador de descarga */}
                {descargando && (
                    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generando PDF...</span>
                    </div>
                )}

                {/* Modal de detalle */}
                {mostrarDetalle && cuponSeleccionado && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
