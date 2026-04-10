import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { empresasService } from '../services/empresasService';
import { RUBROS } from '../utils/rubros';
import { sanitizeByField, validateFormFields } from '../utils/formSecurity';

const initialState = {
  nombreEmpresa: '',
  rubroEmpresa: '',
  emailEmpresa: '',
  telefonoContacto: '',
  nombreContacto: '',
};

export const AgregarEmpresa = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: sanitizeByField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const validationErrors = validateFormFields(form, [
        'nombreEmpresa',
        'rubroEmpresa',
        'emailEmpresa',
        'telefonoContacto',
        'nombreContacto',
      ]);
      if (Object.keys(validationErrors).length > 0) {
        setError(Object.values(validationErrors)[0]);
        setLoading(false);
        return;
      }

      await empresasService.crearEmpresa(form);
      setSuccess('Empresa registrada exitosamente');
      setForm(initialState);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al registrar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Header />

      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 bg-white text-sky-700 px-5 py-3 rounded-full shadow-md hover:shadow-xl transition"
          >
            <span className="text-lg">←</span>
            Volver al panel de admin
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-sky-100">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏢</span>
              <h2 className="text-2xl font-bold">Agregar Empresa</h2>
            </div>
            <p className="text-white/80">Completa el formulario para registrar una nueva empresa</p>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre de la Empresa</label>
                <input
                  type="text"
                  name="nombreEmpresa"
                  value={form.nombreEmpresa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Ej: Radio Shackla"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Rubro</label>
                <select
                  name="rubroEmpresa"
                  value={form.rubroEmpresa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                >
                  <option value="">Selecciona un rubro</option>
                  {RUBROS.map((rubro) => (
                    <option key={rubro.value} value={rubro.value}>
                      {rubro.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email de la Empresa</label>
                <input
                  type="email"
                  name="emailEmpresa"
                  value={form.emailEmpresa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="empresa@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Teléfono de Contacto</label>
                <input
                  type="tel"
                  name="telefonoContacto"
                  value={form.telefonoContacto}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Ej: 2019283700"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Nombre del Contacto</label>
                <input
                  type="text"
                  name="nombreContacto"
                  value={form.nombreContacto}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Ej: John Pérez"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-4 text-sm">
                {success}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-60"
              >
                {loading ? 'Registrando...' : 'Registrar Empresa'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};
