import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useOfertas } from "../hooks/useOfertas";

export const Home = () => {
    const [rubroSeleccionado, setRubroSeleccionado] = useState("todos");
    const navigate = useNavigate();
    
    // cargar rubros y ofertas de firebase
    const { ofertas, rubros, loading, error } = useOfertas();

    //  Función placeholder para añadir al carrito
    const handleComprar = (oferta) => {
        console.log('🛒 [HOME] Añadiendo al carrito:', {
            id: oferta.id,
            titulo: oferta.titulo,
            precio: oferta.precioOferta || oferta.precioDescuento,
            cantidad: 1
        });
        // Por ahora, redirigimos al checkout como fallback
        navigate(`/checkout/${oferta.id}`);
    };

    // Rubros con iconos (se mantienen estáticos para el diseño)
    const rubrosConIconos = [
        { id: "todos", nombre: "Todos", icono: "/icons/world-humanitarian-day_3299012.png" },
        { id: "restaurantes", nombre: "Restaurantes", icono: "/icons/restaurant_948036.png" },
        { id: "belleza", nombre: "Belleza & Spa", icono: "/icons/beauty_4514888.png" },
        { id: "fitness", nombre: "Fitness", icono: "/icons/fitness_2749777.png" },
        { id: "entretenimiento", nombre: "Entretenimiento", icono: "/icons/music_14126345.png" },
    ];

    // Filtrar ofertas por rubro (solo si hay datos cargados)
    const ofertasFiltradas = rubroSeleccionado === "todos"
        ? ofertas.slice(0, 6) // Mostrar máximo 6 en home
        : ofertas.filter(o => o.rubro === rubroSeleccionado).slice(0, 6);

    // Manejar cambio de rubro
    const handleRubroChange = (rubroId) => {
        setRubroSeleccionado(rubroId);
    };

    // Calcular descuento si no viene en los datos
    const calcularDescuento = (regular, oferta) => {
        if (!regular || !oferta) return 0;
        return Math.round(((regular - oferta) / regular) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-24">
                <div className="container mx-auto px-4 text-center flex justify-center items-center flex-col gap-6">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Ahorra más, vive mejor
                    </h1>
                    <p className="text-xl text-sky-100 mb-8">
                        Descubre descuentos exclusivos en restaurantes, spas y más
                    </p>
                    <Button size="lg" onClick={() => navigate('/ofertas')}>
                        Ver ofertas
                    </Button>
                </div>
            </section>

            {/* Filtros por Categoría */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Explora por categoría
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {rubrosConIconos.map(r => (
                        <button
                            key={r.id}
                            onClick={() => handleRubroChange(r.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition
                                ${rubroSeleccionado === r.id
                                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                                    : "bg-white text-gray-700 shadow hover:bg-sky-50"
                                }`}
                        >
                            {r.icono && <img src={r.icono} alt="" className="w-5 h-5" />}
                            {r.nombre}
                        </button>
                    ))}
                    {/* Agregar rubros dinámicos de Firebase si existen */}
                    {rubros.filter(r => !rubrosConIconos.some(rc => rc.id === r)).map(rubro => (
                        <button
                            key={rubro}
                            onClick={() => handleRubroChange(rubro)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition capitalize
                                ${rubroSeleccionado === rubro
                                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                                    : "bg-white text-gray-700 shadow hover:bg-sky-50"
                                }`}
                        >
                            {rubro.charAt(0).toUpperCase() + rubro.slice(1)}
                        </button>
                    ))}
                </div>
            </section>

            {/* Ofertas Destacadas */}
            <section className="container mx-auto px-4 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Ofertas destacadas</h2>
                    <Link to="/ofertas" className="text-sky-600 font-semibold">
                        Ver todas →
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando ofertas...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">⚠️ {error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Reintentar
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && ofertasFiltradas.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-500 text-lg">
                            No hay ofertas disponibles {rubroSeleccionado !== 'todos' ? `en "${rubroSeleccionado}"` : ''}
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => setRubroSeleccionado('todos')}>
                            Ver todas las categorías
                        </Button>
                    </div>
                )}

                {!loading && !error && ofertasFiltradas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ofertasFiltradas.map(o => {
                            const precioRegular = o.precioRegular || o.precioOriginal || 0;
                            const precioOferta = o.precioOferta || o.precioDescuento || 0;
                            const descuento = o.descuento || calcularDescuento(precioRegular, precioOferta);
                            const color = o.color || 'from-sky-400 to-emerald-400';
                            const imagen = o.imagen || o.img || o.icono;

                            return (
                                <div
                                    key={o.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden relative"
                                >
                                    {/* Badge de descuento */}
                                    <span className="absolute top-3 right-3 bg-white text-sky-600 px-3 py-1 rounded-full text-sm font-bold z-10">
                                        {descuento}% OFF
                                    </span>

                                    {/* Header con gradiente */}
                                    <div className={`bg-gradient-to-r ${color} p-8 text-center`}>
                                        {imagen ? (
                                            <img 
                                                src={imagen} 
                                                alt={o.titulo} 
                                                className="w-16 h-16 mx-auto mb-3 object-cover rounded-full border-4 border-white" 
                                            />
                                        ) : (
                                            <div className="text-6xl mb-3">🎫</div>
                                        )}
                                        <h3 className="text-white font-bold">{o.empresa || 'Empresa'}</h3>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-6">
                                        <h4 className="font-bold text-lg mb-3 line-clamp-2">{o.titulo}</h4>
                                        
                                        {/* Precios */}
                                        <div className="flex gap-3 items-center mb-4">
                                            <span className="line-through text-gray-400">
                                                ${precioRegular.toFixed(2)}
                                            </span>
                                            <span className="text-3xl font-bold text-emerald-600">
                                                ${precioOferta.toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Ahorro */}
                                        <p className="text-sm text-green-600 mb-4">
                                            ¡Ahorras ${(precioRegular - precioOferta).toFixed(2)}!
                                        </p>

                                        {/* Botón Comprar */}
                                        <Button 
                                            className="w-full"
                                            onClick={() => handleComprar(o)}
                                        >
                                            🛒 Comprar
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
};