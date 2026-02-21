import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOfertas } from '../hooks/useOfertas';
import { OfertasList } from '../components/ofertas/OfertasList';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const OfertasPorRubro = () => {
  const { rubro } = useParams();
  const navigate = useNavigate();
  const { ofertas, loading, error, loadOfertasPorRubro } = useOfertas();
  const [rubroActual, setRubroActual] = useState(rubro);

  useEffect(() => {
    if (rubro) {
      setRubroActual(rubro);
      loadOfertasPorRubro(rubro);
    }
  }, [rubro]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800 font-semibold"
        >
          <span className="text-2xl mr-2">←</span> Volver a todas las ofertas
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-2 capitalize">
          Ofertas de {rubroActual}
        </h1>
        <p className="text-gray-600 mb-8">
          Descubre las mejores ofertas en {rubroActual}
        </p>

        <OfertasList ofertas={ofertas} loading={loading} error={error} />
      </div>

      <Footer />
    </div>
  );
};