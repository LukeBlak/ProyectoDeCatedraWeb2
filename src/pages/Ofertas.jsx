import React from 'react';
import { useOfertas } from '../hooks/useOfertas';
import { OfertasList } from '../components/ofertas/OfertasList';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Link, useSearchParams } from 'react-router-dom';

const normalizarTexto = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

export const Ofertas = () => {
  const { ofertas, loading, error } = useOfertas();
  const [searchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get('q') || '';

  const ofertasFiltradas = ofertas.filter((oferta) => {
    const textoBusqueda = normalizarTexto(terminoBusqueda);

    if (!textoBusqueda) {
      return true;
    }

    const campos = [
      oferta.titulo,
      oferta.descripcion,
      oferta.empresa,
      oferta.empresaNombre,
      oferta.nombreEmpresa,
      oferta.rubro,
    ]
      .map(normalizarTexto)
      .join(' ');

    return campos.includes(textoBusqueda);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {terminoBusqueda ? `Resultados para “${terminoBusqueda}”` : 'Todas las ofertas'}
            </h1>
            {terminoBusqueda && (
              <p className="mt-2 text-gray-600">
                Mostrando coincidencias por título, empresa, rubro o descripción.
              </p>
            )}
          </div>
          <Link 
            to="/" 
            className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-2"
          >
            ← Volver al inicio
          </Link>
        </div>

        {loading || error || ofertasFiltradas.length > 0 ? (
          <OfertasList ofertas={ofertasFiltradas} loading={loading} error={error} />
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-sky-100">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              No encontramos coincidencias
            </p>
            <p className="text-gray-600 mb-6">
              Probá con otro término o volvé a ver todas las ofertas.
            </p>
            <Link
              to="/ofertas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Ver todas las ofertas
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};