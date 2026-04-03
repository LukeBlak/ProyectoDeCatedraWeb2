import React, { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { getEmpresasYClientesDetalle } from '../services/clientesService';

export const AdminEmpresasClientes = () => {
  const [data, setData] = useState({
    empresasDetalle: [],
    clientesDetalle: [],
    resumen: {
      totalEmpresas: 0,
      totalClientes: 0,
      totalEmpleados: 0,
      totalOfertas: 0,
      ofertasActivas: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getEmpresasYClientesDetalle();
      setData(response);
    } catch (err) {
      setError(err.message || 'No fue posible cargar el detalle de empresas y clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-sky-100">
          <h1 className="text-3xl font-bold text-gray-800">Detalle de Empresas y Clientes</h1>
          <p className="text-gray-600 mt-2">
            Vista consolidada para administración global de la plataforma.
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos administrativos...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              onClick={loadData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <CardMetric label="Empresas" value={data.resumen.totalEmpresas} color="text-blue-600" />
              <CardMetric label="Clientes" value={data.resumen.totalClientes} color="text-emerald-600" />
              <CardMetric label="Empleados" value={data.resumen.totalEmpleados} color="text-violet-600" />
              <CardMetric label="Ofertas" value={data.resumen.totalOfertas} color="text-orange-600" />
              <CardMetric label="Ofertas Activas" value={data.resumen.ofertasActivas} color="text-sky-600" />
            </div>

            <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-sky-50">
                <h2 className="text-xl font-bold text-gray-800">Empresas</h2>
                <p className="text-gray-600 text-sm mt-1">Detalle operativo por empresa</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3">Empresa</th>
                      <th className="text-left px-4 py-3">Rubro</th>
                      <th className="text-left px-4 py-3">Contacto</th>
                      <th className="text-left px-4 py-3">Teléfono</th>
                      <th className="text-center px-4 py-3">Empleados</th>
                      <th className="text-center px-4 py-3">Ofertas</th>
                      <th className="text-center px-4 py-3">Activas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.empresasDetalle.map((empresa) => (
                      <tr key={empresa.id} className="border-t hover:bg-sky-50/40">
                        <td className="px-4 py-3 font-semibold text-gray-800">{empresa.nombre}</td>
                        <td className="px-4 py-3 capitalize">{empresa.rubro}</td>
                        <td className="px-4 py-3">{empresa.contacto}</td>
                        <td className="px-4 py-3">{empresa.telefono}</td>
                        <td className="px-4 py-3 text-center">{empresa.empleados}</td>
                        <td className="px-4 py-3 text-center">{empresa.ofertasTotales}</td>
                        <td className="px-4 py-3 text-center font-semibold text-emerald-600">{empresa.ofertasActivas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-5 border-b bg-gradient-to-r from-emerald-50 to-sky-50">
                <h2 className="text-xl font-bold text-gray-800">Clientes</h2>
                <p className="text-gray-600 text-sm mt-1">Últimos clientes registrados en la plataforma</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3">Nombre</th>
                      <th className="text-left px-4 py-3">Correo</th>
                      <th className="text-left px-4 py-3">Teléfono</th>
                      <th className="text-left px-4 py-3">DUI</th>
                      <th className="text-left px-4 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.clientesDetalle.map((cliente) => (
                      <tr key={cliente.id} className="border-t hover:bg-emerald-50/40">
                        <td className="px-4 py-3 font-medium text-gray-800">{cliente.nombre}</td>
                        <td className="px-4 py-3">{cliente.email}</td>
                        <td className="px-4 py-3">{cliente.telefono}</td>
                        <td className="px-4 py-3">{cliente.dui}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              cliente.estado === 'activo'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {cliente.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

const CardMetric = ({ label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);
