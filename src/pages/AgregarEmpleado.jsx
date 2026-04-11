// src/pages/AgregarEmpleado.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { empleadosService } from '../services/empleadosService';
import { sanitizeByField, validateFormFields } from '../utils/formSecurity';

const initialState = {
  nombres: '',
  apellidos: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  dui: '',
};

export const AgregarEmpleado = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    const cleanedValue = sanitizeByField(name, value);
    setForm(prev => ({ ...prev, [name]: cleanedValue }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setErrors({});

    const validationErrors = validateFormFields(form, [
      'nombres',
      'apellidos',
      'email',
      'password',
      'telefono',
      'dui',
    ]);

    if (!form.direccion.trim()) {
      validationErrors.direccion = 'La dirección es obligatoria';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await empleadosService.crearEmpleado(form);
      setSuccess('Empleado registrado exitosamente');
      setForm(initialState);
    } catch (err) {
      setError(err.message || 'Error al registrar empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-4">
          <a href="/admin" className="inline-flex items-center gap-2 bg-white text-purple-700 px-5 py-2 rounded-full shadow-md hover:shadow-xl transition">
            <span className="text-lg">←</span> Volver al Panel de Administración
          </a>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👥</span>
              <h2 className="text-2xl font-bold">Agregar Empleado</h2>
            </div>
            <p className="text-white/80">Completa el formulario para registrar un nuevo empleado</p>
          </div>
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nombres</label>
                <input name="nombres" value={form.nombres} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.nombres ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-400`} />
                {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Apellidos</label>
                <input name="apellidos" value={form.apellidos} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.apellidos ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-400`} />
                {errors.apellidos && <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-400`} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Contraseña</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-400`} />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-400`} />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Dirección</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.direccion ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-400`} />
                {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">DUI</label>
                <input name="dui" value={form.dui} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.dui ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-400`} />
                {errors.dui && <p className="text-red-500 text-sm mt-1">{errors.dui}</p>}
              </div>
            </div>
            {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            {success && <div className="text-green-600 text-sm font-medium">{success}</div>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-xl transition">
              {loading ? 'Registrando...' : 'Registrar Empleado'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}