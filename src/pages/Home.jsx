import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";

export const Home = () => {
    const [rubroSeleccionado, setRubroSeleccionado] = useState("todos");

    // Datos mock de ofertas destacadas
    const ofertasDestacadas = [
        {
            id: 1,
            titulo: "50% OFF en Buffet Completo",
            empresa: "Restaurante El Buen Sabor",
            precioRegular: 50.0,
            precioOferta: 25.0,
            descuento: 50,
            imagen: "🍽️",
            rubro: "restaurantes",
            color: "from-orange-400 to-red-500",
        },
        {
            id: 2,
            titulo: "Masaje Relajante 40% OFF",
            empresa: "Spa Paradise",
            precioRegular: 80.0,
            precioOferta: 48.0,
            descuento: 40,
            imagen: "💆",
            rubro: "belleza",
            color: "from-pink-400 to-purple-500",
        },
        {
            id: 3,
            titulo: "Membresía Gym 30% Descuento",
            empresa: "Gym Fitness Pro",
            precioRegular: 40.0,
            precioOferta: 28.0,
            descuento: 30,
            imagen: "💪",
            rubro: "fitness",
            color: "from-green-400 to-emerald-600",
        },
        {
            id: 4,
            titulo: "2x1 Entradas de Cine",
            empresa: "Cine Multiplex",
            precioRegular: 12.0,
            precioOferta: 12.0,
            descuento: 50,
            imagen: "🎬",
            rubro: "entretenimiento",
            color: "from-blue-400 to-indigo-600",
        },
        {
            id: 5,
            titulo: "Corte + Barba 35% OFF",
            empresa: "Barbería Elegance",
            precioRegular: 25.0,
            precioOferta: 16.25,
            descuento: 35,
            imagen: "💈",
            rubro: "belleza",
            color: "from-cyan-400 to-blue-600",
        },
        {
            id: 6,
            titulo: "Pizza Familiar + Bebida",
            empresa: "Pizzería Don Giovanni",
            precioRegular: 35.0,
            precioOferta: 24.5,
            descuento: 30,
            imagen: "🍕",
            rubro: "restaurantes",
            color: "from-yellow-400 to-orange-500",
        },
    ];

    // Rubros/Categorías
    const rubros = [
        { id: "todos", nombre: "Todos", icono: "🎯" },
        { id: "restaurantes", nombre: "Restaurantes", icono: "🍽️" },
        { id: "belleza", nombre: "Belleza & Spa", icono: "💅" },
        { id: "fitness", nombre: "Fitness", icono: "💪" },
        { id: "entretenimiento", nombre: "Entretenimiento", icono: "🎭" },
    ];

    // Filtrar ofertas por rubro
    const ofertasFiltradas =
        rubroSeleccionado === "todos"
            ? ofertasDestacadas
            : ofertasDestacadas.filter((o) => o.rubro === rubroSeleccionado);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Ahorra Más, Vive Mejor
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-purple-100">
                            Descubre los mejores descuentos en restaurantes, spas,
                            entretenimiento y más
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="shadow-xl">
                                🎫 Ver Ofertas
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Decoración de ondas */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="rgb(250 245 255)"
                        />
                    </svg>
                </div>
            </section>

            {/* Estadísticas rápidas */}
            <section className="container mx-auto px-4 -mt-16 relative z-20 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="text-5xl mb-3">🎫</div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                        <div className="text-gray-600">Ofertas Activas</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="text-5xl mb-3">😊</div>
                        <div className="text-3xl font-bold text-pink-600 mb-2">10K+</div>
                        <div className="text-gray-600">Clientes Felices</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="text-5xl mb-3">💰</div>
                        <div className="text-3xl font-bold text-green-600 mb-2">$250K</div>
                        <div className="text-gray-600">Ahorro Total</div>
                    </div>
                </div>
            </section>

            {/* Categorías/Rubros */}
            <section className="container mx-auto px-4 mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Explora por Categoría
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {rubros.map((rubro) => (
                        <button
                            key={rubro.id}
                            onClick={() => setRubroSeleccionado(rubro.id)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${rubroSeleccionado === rubro.id
                                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg scale-105"
                                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                                }`}
                        >
                            <span className="mr-2">{rubro.icono}</span>
                            {rubro.nombre}
                        </button>
                    ))}
                </div>
            </section>

            {/* Ofertas Destacadas */}
            <section className="container mx-auto px-4 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        🔥 Ofertas Destacadas
                    </h2>
                    <Link
                        to="/ofertas"
                        className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                        Ver todas →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ofertasFiltradas.map((oferta) => (
                        <div
                            key={oferta.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            {/* Header de la card con gradiente */}
                            <div
                                className={`bg-gradient-to-r ${oferta.color} p-8 text-center relative`}
                            >
                                <div className="absolute top-3 right-3 bg-white text-purple-600 font-bold px-3 py-1 rounded-full text-sm shadow">
                                    {oferta.descuento}% OFF
                                </div>
                                <div className="text-7xl mb-2">{oferta.imagen}</div>
                                <h3 className="text-white font-bold text-xl">
                                    {oferta.empresa}
                                </h3>
                            </div>

                            {/* Contenido de la card */}
                            <div className="p-6">
                                <h4 className="text-xl font-bold text-gray-800 mb-4">
                                    {oferta.titulo}
                                </h4>

                                {/* Precios */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-gray-400 line-through text-lg">
                                        ${oferta.precioRegular.toFixed(2)}
                                    </span>
                                    <span className="text-3xl font-bold text-green-600">
                                        ${oferta.precioOferta.toFixed(2)}
                                    </span>
                                </div>

                                <div className="text-sm text-green-600 font-semibold mb-4">
                                    ¡Ahorras $
                                    {(oferta.precioRegular - oferta.precioOferta).toFixed(2)}!
                                </div>

                                {/* Botón de acción */}
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => alert("Redirigiendo a detalle de oferta...")}
                                >
                                    Ver Oferta
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {ofertasFiltradas.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-500 text-lg">
                            No hay ofertas disponibles en esta categoría
                        </p>
                    </div>
                )}
            </section>

            {/* Cómo funciona */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
                        ¿Cómo Funciona?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                🔍
                            </div>
                            <h3 className="font-bold text-lg mb-2">1. Explora</h3>
                            <p className="text-gray-600">
                                Encuentra las mejores ofertas cerca de ti
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                🛒
                            </div>
                            <h3 className="font-bold text-lg mb-2">2. Compra</h3>
                            <p className="text-gray-600">Adquiere tu cupón de forma segura</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                📱
                            </div>
                            <h3 className="font-bold text-lg mb-2">3. Recibe</h3>
                            <p className="text-gray-600">
                                Tu cupón llega al instante por email
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                🎉
                            </div>
                            <h3 className="font-bold text-lg mb-2">4. Disfruta</h3>
                            <p className="text-gray-600">
                                Canjea y ahorra en tu lugar favorito
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-16">
                <div className="container mx-auto px-4 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        ¿Listo para Empezar a Ahorrar?
                    </h2>
                    <p className="text-xl mb-8 text-purple-100">
                        Únete a miles de personas que ya están ahorrando
                    </p>
                    <Button variant="secondary" size="lg" className="shadow-2xl">
                        Crear Cuenta Gratis
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
};
