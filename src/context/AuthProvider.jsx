// src/context/AuthProvider.jsx

import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  setLoading(false);
  }, []);

  const register = async (userData) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
    return newUser;
  };

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const actualizarUsuario = async (datosActualizados) => {
    if (!user) return;
    
    await authService.actualizarPerfil(user.id, datosActualizados);
    const usuarioActualizado = { ...user, ...datosActualizados };
    setUser(usuarioActualizado);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    actualizarUsuario,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};