import React from 'react';
import { useOfertas } from '../hooks/useOfertas';
import { OfertasList } from '../components/ofertas/OfertasList';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Link } from 'react-router-dom';

export const Ofertas = () => {
  const { ofertas, loading, error } = useOfertas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Todas las ofertas
          </h1>
          <Link 
            to="/" 
            className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-2"
          >
            ← Volver al inicio
          </Link>
        </div>

        <OfertasList ofertas={ofertas} loading={loading} error={error} />
      </div>

      <Footer />
    </div>
  );
};