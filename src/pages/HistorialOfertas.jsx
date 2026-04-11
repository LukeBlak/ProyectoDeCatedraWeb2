import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistorialOfertas } from '../services/historialOfertasService';

const estadoColor = {
  aprobada: 'bg-emerald-100 text-emerald-700',
  pendiente: 'bg-yellow-100 text-yellow-700',
  rechazada: 'bg-red-100 text-red-700',
};

const HistorialOfertas = () => {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroDisponible, setFiltroDisponible] = useState('');

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getHistorialOfertas();
        setOfertas(data);
      } catch (e) {
        setError('No se pudo cargar el historial.');
      }
      setLoading(false);
    };
    fetchOfertas();
  }, []);

  // Filtrado y búsqueda
  const ofertasFiltradas = ofertas.filter((oferta) => {
    // Búsqueda por texto
    const texto = `${oferta.titulo} ${oferta.empresaNombre || oferta.empresa || ''} ${oferta.rubro}`.toLowerCase();
    const coincideBusqueda = texto.includes(search.toLowerCase());
    // Filtro por estado
    const coincideEstado = filtroEstado ? oferta.estado === filtroEstado : true;
    // Filtro por disponibilidad
    const coincideDisponible = filtroDisponible
      ? filtroDisponible === 'disponible'
        ? oferta.disponible === true
        : oferta.disponible === false
      : true;
    return coincideBusqueda && coincideEstado && coincideDisponible;
  });

  return (
    <div className="container-section flex-col min-h-screen justify-start">
      {/* Header visual */}
      <div className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-8 shadow-lg mb-8">
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Historial de Ofertas</h1>
          <p className="text-orange-100 text-lg">Todas las ofertas gestionadas</p>
        </div>
      </div>
      {/* Botón de retorno */}
      <div className="flex justify-center mb-8">
        <button className="btn-back flex items-center gap-2 text-lg" onClick={() => navigate('/admin')}>
          <span className="text-xl">←</span> Volver al Panel de Admin
        </button>
      </div>
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center max-w-4xl mx-auto mb-6 px-2">
        <input
          type="text"
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Buscar por título, empresa o rubro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="aprobada">Aprobada</option>
            <option value="pendiente">Pendiente</option>
            <option value="rechazada">Rechazada</option>
          </select>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={filtroDisponible}
            onChange={e => setFiltroDisponible(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="disponible">Disponibles</option>
            <option value="no-disponible">No disponibles</option>
          </select>
        </div>
      </div>
      {/* Listado centrado */}
      <div className="flex justify-center w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Historial de todas las ofertas</h2>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando historial...</div>
          ) : ofertasFiltradas.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No hay ofertas que coincidan.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Título</th>
                  <th className="text-left px-4 py-3">Empresa</th>
                  <th className="text-left px-4 py-3">Rubro</th>
                  <th className="text-right px-4 py-3">Precio</th>
                  <th className="text-right px-4 py-3">Oferta</th>
                  <th className="text-center px-4 py-3">Estado</th>
                  <th className="text-center px-4 py-3">Disponible</th>
                </tr>
              </thead>
              <tbody>
                {ofertasFiltradas.map((oferta) => (
                  <tr key={oferta.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-800">{oferta.titulo}</td>
                    <td className="px-4 py-3">{oferta.empresaNombre || oferta.empresa || '-'}</td>
                    <td className="px-4 py-3 capitalize">{oferta.rubro}</td>
                    <td className="px-4 py-3 text-right">${Number(oferta.precioOriginal || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold">${Number(oferta.precioDescuento || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${estadoColor[oferta.estado] || 'bg-gray-100 text-gray-700'}`}>
                        {oferta.estado || 'sin estado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${oferta.disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {oferta.disponible ? 'Sí' : 'No'}
                      </span>
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

export default HistorialOfertas;
