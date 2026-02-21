import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import {Header} from '../components/common/Header';
import {Footer} from '../components/common/Footer';
import {Button} from '../components/common/Button';

export const MiPerfil = () => {
  //Obtener usuario autenticado y funcion para actualizarlo desde el contexto
  const { user, actualizarUsuario, logout } = useAuth();
  
  // controla si el formulario del perfil esta en modo edición
  const [editando, setEditando] = useState(false);

  //controla si se muestra el formulario para cambiar contraseña
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  

  //Datos del formulario de perfil
  const [formData, setFormData] = useState({
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || ''
  });


  //Datos del formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });


  //Loading de los botones
  const [loading, setLoading] = useState(false);

  //Mensajes de error
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });


  //Maneja cambios en el formulario de perfil
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  //cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleActualizarPerfil = async (e) => {
    e.preventDefault(); //evita que el formulario recargue la pagina
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      //Actualiza datos en firestore
      await authService.actualizarPerfil(user.id, formData);
      //Actualiza datos en el contexto global
      actualizarUsuario(formData);
      setMensaje({ tipo: 'success', texto: '✅ Perfil actualizado exitosamente' });
      setEditando(false);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });


    //Valida que las contraseñas coincidan
    if (passwordData.nuevaPassword !== passwordData.confirmarPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    try {
      //Llama el servicio de cambiar contraseña
      await authService.cambiarPassword(
        user.id,
        passwordData.passwordActual,
        passwordData.nuevaPassword
      );
      setMensaje({ tipo: 'success', texto: '✅ Contraseña cambiada exitosamente' });

      //limpiar el formulario
      setPasswordData({ passwordActual: '', nuevaPassword: '', confirmarPassword: '' });
      setCambiandoPassword(false);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
  await logout();  //elimina al usuario de context y localStorage
  navigate("/"); 
  };


  return (
    <>
      <Header />
      {/* Contenedor principal */}
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👤</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Administra tu información personal</p>
          </div>

          {/* Mensajes de exito o error*/}
          {mensaje.texto && (
            <div className={`mb-6 px-4 py-3 rounded-lg ${
              mensaje.tipo === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {mensaje.texto}
            </div>
          )}

          {/* Información Personal */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Información Personal
              </h2>
              {!editando && (
                <Button
                  variant="outline"
                  onClick={() => setEditando(true)}
                >
                  ✏️ Editar
                </Button>
              )}
            </div>

            {!editando ? (
              // Vista de solo lectura
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Nombres
                  </label>
                  <p className="text-lg text-gray-800">{user?.nombres}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Apellidos
                  </label>
                  <p className="text-lg text-gray-800">{user?.apellidos}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Correo Electrónico
                  </label>
                  <p className="text-lg text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    DUI
                  </label>
                  <p className="text-lg text-gray-800">{user?.dui}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Teléfono
                  </label>
                  <p className="text-lg text-gray-800">{user?.telefono}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Dirección
                  </label>
                  <p className="text-lg text-gray-800">{user?.direccion || 'No especificada'}</p>
                </div>
              </div>
            ) : (
              // Formulario de edición
              <form onSubmit={handleActualizarPerfil}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombres
                    </label>
                    <input
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
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
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditando(false);
                      setFormData({
                        nombres: user?.nombres || '',
                        apellidos: user?.apellidos || '',
                        telefono: user?.telefono || '',
                        direccion: user?.direccion || ''
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Cambiar Contraseña */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Seguridad
              </h2>
              {!cambiandoPassword && (
                <Button
                  variant="outline"
                  onClick={() => setCambiandoPassword(true)}
                >
                  🔒 Cambiar Contraseña
                </Button>
              )}
            </div>

            {cambiandoPassword && (
              <form onSubmit={handleCambiarPassword}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      name="passwordActual"
                      value={passwordData.passwordActual}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="nuevaPassword"
                      value={passwordData.nuevaPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmarPassword"
                      value={passwordData.confirmarPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCambiandoPassword(false);
                      setPasswordData({ passwordActual: '', nuevaPassword: '', confirmarPassword: '' });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Cerrar Sesión */}
          <div className="text-center">
            <Button
              variant="danger"
              onClick={handleLogout}
            >
              🚪 Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
