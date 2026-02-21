import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";

export const Home = () => {

    // Permite seleccioanr el rubro de filtrado, empezando en todos por defecto
    const [rubroSeleccionado, setRubroSeleccionado] = useState("todos");

    // Datos de prueba
    const ofertasDestacadas = [
        {
            id: 1,
            titulo: "50% OFF en Buffet Completo",
            empresa: "Restaurante El Buen Sabor",
            precioRegular: 50,
            precioOferta: 25,
            descuento: 50,
            icono: "/icons/restaurant_7845744.png",
            rubro: "restaurantes",
            color: "from-sky-400 to-emerald-400",
        },
        {
            id: 2,
            titulo: "Masaje Relajante 40% OFF",
            empresa: "Spa Paradise",
            precioRegular: 80,
            precioOferta: 48,
            descuento: 40,
            icono: "/icons/spa_5099674.png",
            rubro: "belleza",
            color: "from-teal-400 to-emerald-500",
        },
        {
            id: 3,
            titulo: "Membresía Gym 30% OFF",
            empresa: "Gym Fitness Pro",
            precioRegular: 40,
            precioOferta: 28,
            descuento: 30,
            icono: "/icons/maquina-de-gimnasio.png",
            rubro: "fitness",
            color: "from-emerald-400 to-green-500",
        },
        {
            id: 4,
            titulo: "Entrada al Cine 25% OFF",
            empresa: "CineMax",
            precioRegular: 50,
            precioOferta: 37.5,
            descuento: 25,
            icono: "/icons/clapperboard_791294.png",
            rubro: "entretenimiento",
            color: "from-green-400 to-emerald-500",
        }
    ];

    // la lista de categorias con su icono 
    const rubros = [
        { id: "todos", nombre: "Todos", icono: "/icons/world-humanitarian-day_3299012.png" },
        { id: "restaurantes", nombre: "Restaurantes", icono: "/icons/restaurant_948036.png" },
        { id: "belleza", nombre: "Belleza & Spa", icono: "/icons/beauty_4514888.png" },
        { id: "fitness", nombre: "Fitness", icono: "/icons/fitness_2749777.png" },
        { id: "entretenimiento", nombre: "Entretenimiento", icono: "/icons/music_14126345.png" },
    ];

    const navigate = useNavigate();

    // esel que se encanta de mostrar el rubro, es el filtro de las categorias que existen
    const ofertasFiltradas =
        rubroSeleccionado === "todos"
            ? ofertasDestacadas
            : ofertasDestacadas.filter(o => o.rubro === rubroSeleccionado);
            // o.algo hace referencia a las ofertas filtradas

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
            <Header />

            {/* El HEro que muestra un pequeño mensaje  */}
            <section className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-24">
                <div className="container mx-auto px-4 text-center flex justify-center items-center flex-col gap-6">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Ahorra más, vive mejor
                    </h1>
                    <p className="text-xl text-sky-100 mb-8">
                        Descubre descuentos exclusivos en restaurantes, spas y más
                    </p>
                    <Button size="lg" onClick={()=>navigate('/ofertas')}>Ver ofertas</Button>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Explora por categoría
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {/* Es el que muestra todos los rubros de los seleccionados */}
                    {rubros.map(r => (
                        <button
                            key={r.id} // Le da una llave única 
                            onClick={() => setRubroSeleccionado(r.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition
                ${rubroSeleccionado === r.id
                                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                                    : "bg-white text-gray-700 shadow hover:bg-sky-50"
                                }`}
                        >
                            <img src={r.icono} alt="" className="w-5 h-5" />
                            {r.nombre}
                        </button>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-4 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Ofertas destacadas</h2>
                    <Link to="/ofertas" className="text-sky-600 font-semibold">
                        Ver todas →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Crea las tarjetas que existen y que se han filtrado  */}
                    {ofertasFiltradas.map(o => (
                        <div
                            key={o.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
                        >
                            <div className={`bg-gradient-to-r ${o.color} p-8 text-center`}>
                                <span className="absolute bg-white text-sky-600 px-3 py-1 rounded-full text-sm font-bold">
                                    {o.descuento}% OFF
                                </span>
                                <img src={o.icono} alt="" className="w-16 h-16 mx-auto mb-3" />
                                <h3 className="text-white font-bold">{o.empresa}</h3>
                            </div>

                            <div className="p-6">
                                <h4 className="font-bold text-lg mb-3">{o.titulo}</h4>
                                <div className="flex gap-3 items-center mb-4">
                                    <span className="line-through text-gray-400">
                                        ${o.precioRegular}
                                    </span>
                                    <span className="text-3xl font-bold text-emerald-600">
                                        ${o.precioOferta}
                                    </span>
                                </div>

                                <Button className="w-full">Ver oferta</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};