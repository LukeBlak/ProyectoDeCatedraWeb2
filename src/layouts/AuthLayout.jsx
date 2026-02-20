// src/layouts/AuthLayout.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      
      {/* Header simple */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🎫</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              LA CUPONERA
            </span>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Footer simple */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © 2026 La Cuponera. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
