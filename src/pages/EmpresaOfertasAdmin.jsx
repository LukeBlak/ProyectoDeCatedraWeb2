// Componente InputField local para campos de formulario
const InputField = ({ label, value, onChange, type = 'text', ...rest }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      {...rest}
    />
  </div>
);
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';
import {
  actualizarOfertaEmpresa,
  crearOfertaEmpresa,
  eliminarOfertaEmpresa,
  getOfertasEmpresaAdmin,
} from '../services/ofertasService';
import { empresasService } from '../services/empresasService';
import { getRubros } from '../services/rubrosService';
import { sanitizeByField, validateFormFields } from '../utils/formSecurity';



// ...existing code...
const INITIAL_FORM = {
  titulo: '',
  descripcion: '',
  rubro: '',
  precioOriginal: '',
  precioDescuento: '',
  fechaExpiracion: '',
  imagen: '',
  disponible: true,
  empresaId: '',
};

export const EmpresaOfertasAdmin = () => {
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [rubros, setRubros] = useState([]);
  const [loadingRubros, setLoadingRubros] = useState(true);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);
  const isAdmin = user?.rol === 'admin';

  const loadEmpresas = useCallback(async () => {
    try {
      const data = await empresasService.getEmpresasActivas();
      setEmpresas(data);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
    }
  }, []);

  const loadOfertas = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (user) {
      loadEmpresas();
      loadOfertas();
    }
  }, [user, loadEmpresas, loadOfertas]);

  useEffect(() => {
    const fetchRubros = async () => {
      setLoadingRubros(true);
      try {
        const data = await getRubros();
        setRubros(data);
      } catch (e) {
        setRubros([]);
      }
      setLoadingRubros(false);
    };
    fetchRubros();
  }, []);

  const validateForm = () => {
    const titulo = String(form.titulo || '').trim();
    const descripcion = String(form.descripcion || '').trim();
    const rubro = String(form.rubro || '').trim();
    const original = Number(form.precioOriginal);
    const descuento = Number(form.precioDescuento);

    if (titulo.length < 3) {
      throw new Error('El titulo debe tener al menos 3 caracteres.');
    }

    if (descripcion.length < 10) {
      throw new Error('La descripcion debe tener al menos 10 caracteres.');
    }

    if (!rubro) {
      throw new Error('El rubro es obligatorio.');
    }

    if (Number.isNaN(original) || original <= 0) {
      throw new Error('El precio original debe ser mayor a 0.');
    }

    if (Number.isNaN(descuento) || descuento <= 0) {
      throw new Error('El precio con descuento debe ser mayor a 0.');
    }

    if (descuento >= original) {
      throw new Error('El precio con descuento debe ser menor al precio original.');
    }

    const validationErrors = validateFormFields(form, ['titulo', 'descripcion', 'imagen']);
    if (Object.keys(validationErrors).length > 0) {
      throw new Error(Object.values(validationErrors)[0]);
    }
  };

  const clearForm = () => {
    setForm({ 
      ...INITIAL_FORM, 
      empresaId: isAdmin && empresas.length > 0 ? empresas[0].id : '' 
    });
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
      empresaId: oferta.empresaId || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      validateForm();

      if (!isAdmin && !user?.empresaId) {
        throw new Error('No tienes una empresa asociada.');
      }

      if (isAdmin && !form.empresaId) {
        throw new Error('Debes seleccionar una empresa.');
      }

      const formData = { ...form };
      if (isAdmin) {
        const selectedEmpresa = empresas.find((e) => e.id === form.empresaId);
        if (!selectedEmpresa) throw new Error('Empresa no válida.');
        formData.empresaId = selectedEmpresa.id;
        formData.empresaNombre = selectedEmpresa.nombreEmpresa;
      }

      if (isEditing) {
        await actualizarOfertaEmpresa(editingId, formData, user);
      } else {
        // Eliminar 'disponible' del formData para que el backend lo ponga en false
        const { disponible, ...formDataSinDisponible } = formData;
        await crearOfertaEmpresa(formDataSinDisponible, user);
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
      await eliminarOfertaEmpresa(id, user);
      await loadOfertas();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la oferta.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-sky-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Ofertas de Empresa</h1>
            <p className="text-gray-600 mt-2">
              Administra ofertas de{' '}
              {user?.empresa || user?.empresaNombre || user?.nombreEmpresa || 'tu empresa'}.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Volver al panel de admin
          </Link>
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
            {isAdmin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seleccionar Empresa *
                </label>
                <select
                  value={form.empresaId}
                  onChange={(e) => setForm({ ...form, empresaId: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="">-- Selecciona una empresa --</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nombreEmpresa} ({empresa.rubroEmpresa})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <InputField
              label="Título"
              value={form.titulo}
              onChange={(value) => setForm({ ...form, titulo: sanitizeByField('titulo', value) })}
              required
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rubro</label>
              <select
                value={form.rubro}
                onChange={(e) => setForm({ ...form, rubro: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
                disabled={loadingRubros}
              >
                <option value="">{loadingRubros ? 'Cargando rubros...' : '-- Selecciona un rubro --'}</option>
                {rubros.map((rubro) => (
                  <option key={rubro.value || rubro.id} value={rubro.value || rubro.id}>
                    {rubro.label}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              label="Precio original"
              type="number"
              min="0"
              step="0.01"
              value={form.precioOriginal}
              onChange={(value) => setForm({ ...form, precioOriginal: sanitizeByField('precioOriginal', value) })}
              required
            />
            <InputField
              label="Precio descuento"
              type="number"
              min="0"
              step="0.01"
              value={form.precioDescuento}
              onChange={(value) => setForm({ ...form, precioDescuento: sanitizeByField('precioDescuento', value) })}
              required
            />
            <InputField
              label="Fecha de expiración"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={form.fechaExpiracion}
              onChange={(value) => setForm({ ...form, fechaExpiracion: value })}
              required
            />
            <InputField
              label="URL imagen"
              value={form.imagen}
              onChange={(value) => setForm({ ...form, imagen: sanitizeByField('imagen', value) })}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: sanitizeByField('descripcion', e.target.value) })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            {/* El campo 'disponible' solo se muestra en edición, nunca al crear */}
            {isEditing && (
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
            )}

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
}
