// src/context/AuthProvider.jsx

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar usuario desde localStorage (tu sistema actual)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // ✅ Asegurar que tenga uid
        setUser({
          ...parsedUser,
          uid: parsedUser.id || parsedUser.uid
        });
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const register = async (userData) => {
    const newUser = await authService.register(userData);
    
    // ✅ Agregar uid
    const userConUid = {
      ...newUser,
      uid: newUser.id
    };
    
    setUser(userConUid);
    return userConUid;
  };

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    
    // ✅ Agregar uid
    const userConUid = {
      ...userData,
      uid: userData.id
    };
    
    setUser(userConUid);
    return userConUid;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const actualizarUsuario = async (datosActualizados) => {
    if (!user) return;
    
    await authService.actualizarPerfil(user.id, datosActualizados);
    
    const userActualizado = { ...user, ...datosActualizados };
    setUser(userActualizado);
    
    // ✅ Actualizar localStorage también
    localStorage.setItem('user', JSON.stringify(userActualizado));
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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