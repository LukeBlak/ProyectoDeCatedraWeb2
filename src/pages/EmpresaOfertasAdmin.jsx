import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';
import {
  actualizarOfertaEmpresa,
  crearOfertaEmpresa,
  eliminarOfertaEmpresa,
  getOfertasEmpresaAdmin,
} from '../services/ofertasService';

const INITIAL_FORM = {
  titulo: '',
  descripcion: '',
  rubro: '',
  precioOriginal: '',
  precioDescuento: '',
  fechaExpiracion: '',
  imagen: '',
  disponible: true,
};

export const EmpresaOfertasAdmin = () => {
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const loadOfertas = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOfertasEmpresaAdmin(user);
      setOfertas(data);
    } catch (err) {
      setError(err.message || 'No fue posible cargar las ofertas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfertas();
  }, []);

  const clearForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
  };

  const toInputDate = (timestampValue) => {
    if (!timestampValue?.toDate) return '';
    const date = timestampValue.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startEdit = (oferta) => {
    setEditingId(oferta.id);
    setForm({
      titulo: oferta.titulo || '',
      descripcion: oferta.descripcion || '',
      rubro: oferta.rubro || '',
      precioOriginal: String(oferta.precioOriginal || ''),
      precioDescuento: String(oferta.precioDescuento || ''),
      fechaExpiracion: toInputDate(oferta.fechaExpiracion),
      imagen: oferta.imagen || '',
      disponible: typeof oferta.disponible === 'boolean' ? oferta.disponible : true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await actualizarOfertaEmpresa(editingId, form);
      } else {
        await crearOfertaEmpresa(form, user);
      }

      clearForm();
      await loadOfertas();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la oferta.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar esta oferta? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    try {
      await eliminarOfertaEmpresa(id);
      await loadOfertas();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la oferta.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-sky-100">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Ofertas de Empresa</h1>
          <p className="text-gray-600 mt-2">
            Administra ofertas de{' '}
            {user?.empresa || user?.empresaNombre || user?.nombreEmpresa || 'tu empresa'}.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {isEditing ? 'Editar Oferta' : 'Nueva Oferta'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Título"
              value={form.titulo}
              onChange={(value) => setForm({ ...form, titulo: value })}
              required
            />
            <InputField
              label="Rubro"
              value={form.rubro}
              onChange={(value) => setForm({ ...form, rubro: value })}
              required
            />
            <InputField
              label="Precio original"
              type="number"
              min="0"
              step="0.01"
              value={form.precioOriginal}
              onChange={(value) => setForm({ ...form, precioOriginal: value })}
              required
            />
            <InputField
              label="Precio descuento"
              type="number"
              min="0"
              step="0.01"
              value={form.precioDescuento}
              onChange={(value) => setForm({ ...form, precioDescuento: value })}
              required
            />
            <InputField
              label="Fecha de expiración"
              type="date"
              value={form.fechaExpiracion}
              onChange={(value) => setForm({ ...form, fechaExpiracion: value })}
              required
            />
            <InputField
              label="URL imagen"
              value={form.imagen}
              onChange={(value) => setForm({ ...form, imagen: value })}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                id="disponible"
                type="checkbox"
                checked={form.disponible}
                onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
              />
              <label htmlFor="disponible" className="text-sm text-gray-700">
                Oferta disponible para compra
              </label>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-sky-600 to-emerald-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : isEditing ? 'Actualizar oferta' : 'Crear oferta'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-5 border-b bg-gradient-to-r from-sky-50 to-emerald-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Ofertas publicadas</h2>
            <span className="text-sm text-gray-600">Total: {ofertas.length}</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-600">Cargando ofertas...</div>
          ) : ofertas.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Aún no hay ofertas registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3">Título</th>
                    <th className="text-left px-4 py-3">Rubro</th>
                    <th className="text-right px-4 py-3">Precio</th>
                    <th className="text-right px-4 py-3">Oferta</th>
                    <th className="text-left px-4 py-3">Estado</th>
                    <th className="text-right px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ofertas.map((oferta) => (
                    <tr key={oferta.id} className="border-t">
                      <td className="px-4 py-3 font-medium text-gray-800">{oferta.titulo}</td>
                      <td className="px-4 py-3 capitalize">{oferta.rubro}</td>
                      <td className="px-4 py-3 text-right">
                        ${Number(oferta.precioOriginal || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-semibold">
                        ${Number(oferta.precioDescuento || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            oferta.disponible
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {oferta.disponible ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => startEdit(oferta)}
                          className="bg-sky-100 text-sky-700 px-3 py-1.5 rounded-lg hover:bg-sky-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(oferta.id)}
                          className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

const InputField = ({ label, value, onChange, type = 'text', ...rest }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      {...rest}
    />
  </div>
);
