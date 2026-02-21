import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {AuthLayout} from '../layouts/AuthLayout';
import Button from '../components/common/Button';

export const Register = () => {
  const navigate = useNavigate(); //hook de navegacion
  const { register } = useAuth(); //obtener funcion register del contexto global
  

  //estado que almacena datos del formulario
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

  //almacena errores de validacion en los campos
  const [errores, setErrores] = useState({});

  // muestra loading en el boton
  const [loading, setLoading] = useState(false);

  // mostrar error general 
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    //actualiza el valor del formulario
    setFormData(prev => ({ ...prev, [name]: value }));

    //si hay errores en el campo lo limpia al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    //validaciones basicas
    if (!formData.nombres.trim()) nuevosErrores.nombres = 'El nombre es requerido';
    if (!formData.apellidos.trim()) nuevosErrores.apellidos = 'El apellido es requerido';
    if (!formData.email.trim()) nuevosErrores.email = 'El correo es requerido';
    if (!formData.password) nuevosErrores.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) nuevosErrores.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.telefono.trim()) nuevosErrores.telefono = 'El teléfono es requerido';
    if (!formData.dui.trim()) nuevosErrores.dui = 'El DUI es requerido';

    //guarda los errores
    setErrores(nuevosErrores);

    //retorna true si no hay errores
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //evita recargar el navegador
    setError('');

    //valida antes de enviar
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      //llama al metodo register del contexto
      await register(formData);
      alert('¡Registro exitoso!');
      //redirige al home despues del registro
      navigate('/');
    } catch (error) {
      //muestra error general si falla el registro
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Contenedor principal */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Únete y comienza a ahorrar hoy
          </p>
        </div>

        {/* Error global */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errores.nombres ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Juan"
              />
              {errores.nombres && (
                <p className="text-red-500 text-sm mt-1">{errores.nombres}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errores.apellidos ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Pérez"
              />
              {errores.apellidos && (
                <p className="text-red-500 text-sm mt-1">{errores.apellidos}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errores.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="juan@example.com"
            />
            {errores.email && (
              <p className="text-red-500 text-sm mt-1">{errores.email}</p>
            )}
          </div>

          {/* Contraseñas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errores.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Mínimo 6 caracteres"
              />
              {errores.password && (
                <p className="text-red-500 text-sm mt-1">{errores.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errores.confirmarPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Repite tu contraseña"
              />
              {errores.confirmarPassword && (
                <p className="text-red-500 text-sm mt-1">{errores.confirmarPassword}</p>
              )}
            </div>
          </div>

          {/* Teléfono y DUI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errores.telefono ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="7777-7777"
              />
              {errores.telefono && (
                <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                DUI *
              </label>
              <input
                type="text"
                name="dui"
                value={formData.dui}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errores.dui ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="12345678-9"
              />
              {errores.dui && (
                <p className="text-red-500 text-sm mt-1">{errores.dui}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="San Salvador"
            />
          </div>

          {/* Botón Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Link a Login */}
        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
