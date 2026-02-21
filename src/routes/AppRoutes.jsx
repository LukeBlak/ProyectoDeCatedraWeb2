// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Home} from '../pages/Home';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';
import { MisCupones } from '../pages/MisCupones';
import {MiPerfil} from '../pages/MiPerfil';
import {ProtectedRoute} from './ProtectedRoute';
import { Ofertas } from "../pages/Ofertas";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ofertas" element={<Ofertas />} />

      {/* Rutas Protegidas */}
      <Route 
        path="/mis-cupones" 
        element={
          <ProtectedRoute>
            <MisCupones />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mi-perfil" 
        element={
          <ProtectedRoute>
            <MiPerfil />
          </ProtectedRoute>
        } 
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
        <a 
          href="/" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};
