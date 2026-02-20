// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const userGuardado = localStorage.getItem('user');
    if (userGuardado) {
      try {
        setUser(JSON.parse(userGuardado));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Registrar usuario
  const register = async (userData) => {
    try {
      const nuevoUsuario = await authService.register(userData);
      setUser(nuevoUsuario);
      localStorage.setItem('user', JSON.stringify(nuevoUsuario));
      return nuevoUsuario;
    } catch (error) {
      throw error;
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const usuario = await authService.login(email, password);
      setUser(usuario);
      localStorage.setItem('user', JSON.stringify(usuario));
      return usuario;
    } catch (error) {
      throw error;
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Actualizar datos del usuario en el contexto
  const actualizarUsuario = (datosActualizados) => {
    const usuarioActualizado = { ...user, ...datosActualizados };
    setUser(usuarioActualizado);
    localStorage.setItem('user', JSON.stringify(usuarioActualizado));
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};