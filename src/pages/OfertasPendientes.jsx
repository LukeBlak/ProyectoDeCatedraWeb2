import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOfertasPendientes, aprobarOferta, rechazarOferta } from '../services/ofertasPendientesService';

const OfertasPendientes = () => {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accionId, setAccionId] = useState(null);

  const fetchOfertas = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOfertasPendientes();
      setOfertas(data);
    } catch (e) {
      setError('No se pudieron cargar las ofertas.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const handleAprobar = async (id) => {
    setAccionId(id);
    try {
      await aprobarOferta(id);
      await fetchOfertas();
    } catch (e) {
      setError('No se pudo aprobar la oferta.');
    }
    setAccionId(null);
  };

  const handleRechazar = async (id) => {
    setAccionId(id);
    try {
      await rechazarOferta(id);
      await fetchOfertas();
    } catch (e) {
      setError('No se pudo rechazar la oferta.');
    }
    setAccionId(null);
  };

  return (
    <div className="container-section flex-col min-h-screen justify-start">
      {/* Header visual */}
      <div className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-8 shadow-lg mb-8">
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Ofertas Pendientes</h1>
          <p className="text-orange-100 text-lg">Revisa y aprueba o rechaza las ofertas creadas</p>
        </div>
      </div>
      {/* Botón de retorno */}
      <div className="flex justify-center mb-8">
        <button className="btn-back flex items-center gap-2 text-lg" onClick={() => navigate('/admin')}>
          <span className="text-xl">←</span> Volver al Panel de Admin
        </button>
      </div>
      {/* Listado centrado */}
      <div className="flex justify-center w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Ofertas en estado pendiente</h2>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando ofertas...</div>
          ) : ofertas.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No hay ofertas pendientes.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Título</th>
                  <th className="text-left px-4 py-3">Empresa</th>
                  <th className="text-left px-4 py-3">Rubro</th>
                  <th className="text-right px-4 py-3">Precio</th>
                  <th className="text-right px-4 py-3">Oferta</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map((oferta) => (
                  <tr key={oferta.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-800">{oferta.titulo}</td>
                    <td className="px-4 py-3">{oferta.empresaNombre || oferta.empresa || '-'}</td>
                    <td className="px-4 py-3 capitalize">{oferta.rubro}</td>
                    <td className="px-4 py-3 text-right">${Number(oferta.precioOriginal || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold">${Number(oferta.precioDescuento || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-60"
                        onClick={() => handleAprobar(oferta.id)}
                        disabled={accionId === oferta.id}
                      >Aprobar</button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-60"
                        onClick={() => handleRechazar(oferta.id)}
                        disabled={accionId === oferta.id}
                      >Rechazar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfertasPendientes;
