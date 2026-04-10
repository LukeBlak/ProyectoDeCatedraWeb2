import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRubro } from '../services/rubrosService';

const CrearRubro = () => {
  const navigate = useNavigate();
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!label.trim() || !value.trim()) {
      setError('Completa ambos campos.');
      return;
    }
    setLoading(true);
    try {
      await addRubro({ label: label.trim(), value: value.trim().toLowerCase() });
      setSuccess(true);
      setLabel('');
      setValue('');
    } catch (e) {
      setError('Error al crear el rubro.');
    }
    setLoading(false);
  };

  return (
    <div className="container-section flex-col min-h-screen justify-start">
      {/* Header visual */}
      <div className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 py-8 shadow-lg mb-8">
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Crear Rubro</h1>
          <p className="text-emerald-100 text-lg">Agrega una nueva categoría de negocio</p>
        </div>
      </div>
      {/* Botón de retorno */}
      <div className="flex justify-center mb-8">
        <button className="inline-flex items-center gap-2 bg-gray-100 text-blue-400 px-5 py-2 rounded-full shadow-md hover:shadow-xl transition" onClick={() => navigate('/admin')}>
          <span className="text-xl">←</span> Volver al Panel de Admin
        </button>
      </div>
      {/* Formulario centrado */}
      <div className="flex justify-center w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-2 text-emerald-700">Nuevo Rubro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Nombre del rubro</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="Ej: Videojuegos"
                disabled={loading}
                maxLength={32}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Identificador único</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={value}
                onChange={e => setValue(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                placeholder="Ej: videojuegos"
                disabled={loading}
                maxLength={32}
                required
              />
              <span className="text-xs text-gray-400">Solo minúsculas, sin espacios (usa guiones si es necesario).</span>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">¡Rubro creado correctamente!</div>}
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Rubro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearRubro;
