import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCupones } from '../hooks/useCupones';

export const MiCarrito = () => {
    const { carrito, eliminarDelCarrito, actualizarCantidad, calcularTotales, vaciarCarrito } = useCart();
    const { user } = useAuth();
    const { comprarCuponesCarrito } = useCupones();
    const totales = calcularTotales();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);

    const handleProcesarPago = async () => {
        if (!user) {
            alert('Debes iniciar sesión para realizar la compra');
            navigate('/login');
            return;
        }

        setProcesando(true);
        try {
            const pedidoRef = collection(db, 'pedidos');
            const docRef = await addDoc(pedidoRef, {
                usuarioId: user.uid || user.id || 'anonimo',
                usuarioNombre: user.nombres || '',
                usuarioEmail: user.email || '',
                items: carrito,
                totales: totales,
                fecha: serverTimestamp(),
                estado: 'completado'
            });

            // Generar los cupones individuales para cada elemento del carrito
            await comprarCuponesCarrito(carrito, docRef.id);

            setProcesando(false);
            setPagoExitoso(true);
            vaciarCarrito();
        } catch (error) {
            console.error('Error al procesar el pago', error);
            alert('Ocurrió un error al procesar el pago. Revisa la consola.');
            setProcesando(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mi Carrito</h1>
                        <p className="text-gray-600">Revisa y administra tu carrito de compras</p>
                    </div>

                    {/* Carrito vacío */}
                    {carrito.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
                            <p className="text-gray-600 mb-6">Aún no has agregado ningún producto</p>
                            <Link
                                to="/ofertas"
                                className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
                            >
                                Ver ofertas disponibles
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Listado de productos */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    {carrito.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border-b p-6 flex gap-4 hover:bg-gray-50 transition items-start"
                                        >
                                            {/* Imagen */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={item.icono}
                                                    alt={item.titulo}
                                                    className="w-20 h-20 object-cover rounded bg-gray-100"
                                                />
                                            </div>

                                            {/* Información */}
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-800">{item.titulo}</h3>
                                                <p className="text-gray-600 text-sm">{item.empresa}</p>
                                                <div className="mt-2 flex gap-3 items-center">
                                                    <span className="line-through text-gray-400">
                                                        ${item.precioRegular}
                                                    </span>
                                                    <span className="font-bold text-emerald-600 text-lg">
                                                        ${item.precioOferta}
                                                    </span>
                                                    <span className="text-sky-600 text-sm font-semibold">
                                                        Ahorro: ${(item.precioRegular - item.precioOferta).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Controles */}
                                            <div className="flex-shrink-0 flex flex-col items-end gap-3">
                                                {/* Cantidad */}
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                                                    <button
                                                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded transition"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                                                    <button
                                                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">Subtotal</p>
                                                    <p className="font-bold text-lg">
                                                        ${(item.precioOferta * item.cantidad).toFixed(2)}
                                                    </p>
                                                </div>

                                                {/* Eliminar */}
                                                <button
                                                    onClick={() => eliminarDelCarrito(item.id)}
                                                    className="text-red-600 hover:text-red-700 font-semibold text-sm hover:underline"
                                                >
                                                    ✕ Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumen de compra */}
                            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-6">
                                <h3 className="text-xl font-bold mb-6 text-gray-800">Resumen de compra</h3>
                                
                                <div className="space-y-4 mb-6 border-b pb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Artículos ({carrito.length})</span>
                                        <span className="font-semibold">
                                            {carrito.reduce((sum, item) => sum + item.cantidad, 0)} unidades
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold">${totales.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Ahorro Total:</span>
                                        <span className="font-semibold">${totales.ahorro.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                                    <span>Total a pagar:</span>
                                    <span className="text-emerald-600">${totales.total.toFixed(2)}</span>
                                </div>

                                <Button 
                                    className="w-full mb-3" 
                                    onClick={() => setShowModal(true)}
                                >
                                    Ir al checkout
                                </Button>
                                <Link
                                    to="/ofertas"
                                    className="block w-full text-center text-sky-600 font-semibold hover:text-sky-700 py-2"
                                >
                                    ← Seguir comprando
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Checkout Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
                        {pagoExitoso ? (
                            <div className="text-center">
                                <div className="text-6xl mb-4 text-emerald-500">✅</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
                                <p className="text-gray-600 mb-6">Tu orden ha sido procesada y guardada correctamente.</p>
                                <Button className="w-full" onClick={() => {
                                    setShowModal(false);
                                    navigate('/mis-cupones'); // Redirige a los cupones si existe
                                }}>
                                    Ver mis cupones
                                </Button>
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={() => !procesando && setShowModal(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                    disabled={procesando}
                                >
                                    ✕
                                </button>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Confirmar Pago</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Total a pagar</span>
                                        <span className="text-2xl font-bold text-emerald-600">${totales.total.toFixed(2)}</span>
                                    </div>
                                    
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                                        onClick={() => setShowModal(false)}
                                        disabled={procesando}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className={`flex-1 flex justify-center items-center text-white font-bold py-3 rounded-xl transition ${procesando ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
                                        onClick={handleProcesarPago}
                                        disabled={procesando}
                                    >
                                        {procesando ? (
                                            <span className="animate-spin text-xl">⏳</span>
                                        ) : (
                                            'Pagar Ahora'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};