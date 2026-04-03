import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

export const MiCarrito = () => {
    const { carrito, eliminarDelCarrito, actualizarCantidad, calcularTotales } = useCart();
    const totales = calcularTotales();

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

                                <Button className="w-full mb-3">Ir al checkout</Button>
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
            <Footer />
        </>
    );
};