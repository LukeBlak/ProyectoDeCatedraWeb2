import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOfertas } from '../hooks/useOfertas';
import { OfertaDetalle } from '../components/ofertas/OfertaDetalle';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const DetalleOferta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadOfertaById, loading, error } = useOfertas();
  const [oferta, setOferta] = useState(null);

  useEffect(() => {
    const cargaOferta = async () => {
      if (id) {
        const data = await loadOfertaById(id);
        setOferta(data);
      }
    };
    cargaOferta();
  }, [id]);

  // Si está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎫</div>
            <p className="text-sky-600 text-xl">Cargando oferta...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center bg-red-50 p-8 rounded-2xl">
            <div className="text-6xl mb-4">😅</div>
            <p className="text-red-600 text-xl mb-4">Error: {error}</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si no encuentra la oferta
  if (!oferta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl mb-4">Oferta no encontrada</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mostrar el detalle de la oferta
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <OfertaDetalle oferta={oferta} loading={loading} error={error} />
      </div>

      <Footer />
    </div>
  );
};