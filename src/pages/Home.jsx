import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";
import { useOfertas } from "../hooks/useOfertas";
import { OfertaCard } from "../components/ofertas/OfertaCard";

export const Home = () => {
  const { ofertas, rubros, loading } = useOfertas();
  const [rubroSeleccionado, setRubroSeleccionado] = useState("todos");

  const rubrosUnicos = [
    ...new Set(rubros.map(r => r?.toLowerCase().trim()))
  ];

  const rubrosUI = [
    { id: "todos", nombre: "Todos" },
    ...rubrosUnicos.map(r => ({
      id: r,
      nombre: r.charAt(0).toUpperCase() + r.slice(1)
    }))
  ];

  const ofertasFiltradas = ofertas.filter(o => {
    if (o.disponible !== undefined && o.disponible === false) {
      return false;
    }

    if (rubroSeleccionado === "todos") return true;

    return (
      o.rubro?.toLowerCase().trim() ===
      rubroSeleccionado.toLowerCase().trim()
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />

      <section className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-24">
        <div className="container mx-auto px-4 text-center flex justify-center items-center flex-col gap-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            Ahorra más, vive mejor
          </h1>
          <p className="text-xl text-sky-100">
            Descubre descuentos exclusivos en restaurantes, spas y más
          </p>
          <Link to="/ofertas">
            <Button size="lg">Ver ofertas</Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explora por categoría
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {rubrosUI.map(r => (
            <button
              key={r.id}
              onClick={() => setRubroSeleccionado(r.id)}
              className={`px-6 py-3 rounded-full font-semibold transition flex items-center gap-2
                ${
                  rubroSeleccionado === r.id
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                    : "bg-white text-gray-700 shadow hover:bg-sky-50"
                }`}
            >
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

        {loading ? (
          <p className="text-center text-gray-500">
            Cargando ofertas...
          </p>
        ) : ofertasFiltradas.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay ofertas disponibles
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ofertasFiltradas.slice(0, 6).map(o => (
              <OfertaCard key={o.id} oferta={o} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
