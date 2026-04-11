import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';
import Button from '../components/common/Button';
import { sanitizeByField, validateFormFields } from '../utils/formSecurity';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    direccion: '',
    dui: ''
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeByField(name, value);

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const validarFormulario = () => {
    const nuevosErrores = validateFormFields(formData, [
      'nombres',
      'apellidos',
      'email',
      'password',
      'telefono',
      'dui'
    ]);

    if (!formData.confirmarPassword.trim()) {
      nuevosErrores.confirmarPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete y comienza a ahorrar hoy</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errores.nombres ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Juan"
              />
              {errores.nombres && <p className="text-red-500 text-sm mt-1">{errores.nombres}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errores.apellidos ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Pérez"
              />
              {errores.apellidos && <p className="text-red-500 text-sm mt-1">{errores.apellidos}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errores.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="juan@example.com"
            />
            {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errores.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Mínimo 6 caracteres"
              />
              {errores.password && <p className="text-red-500 text-sm mt-1">{errores.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña *</label>
              <input
                type="password"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errores.confirmarPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Repite tu contraseña"
              />
              {errores.confirmarPassword && <p className="text-red-500 text-sm mt-1">{errores.confirmarPassword}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errores.telefono ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="7777-7777"
              />
              {errores.telefono && <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">DUI *</label>
              <input
                type="text"
                name="dui"
                value={formData.dui}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errores.dui ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="12345678-9"
              />
              {errores.dui && <p className="text-red-500 text-sm mt-1">{errores.dui}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="San Salvador"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">Inicia Sesión</Link>
        </p>
      </div>
    </AuthLayout>
  );
};
