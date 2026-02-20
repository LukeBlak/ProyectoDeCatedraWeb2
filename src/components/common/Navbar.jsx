// src/components/common/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  

  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-white rounded-lg p-2 shadow-md group-hover:shadow-xl transition-shadow">
            <img src="/icons/cupon.png" alt="La Cuponera" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              LA CUPONERA
            </h1>
            <p className="text-xs text-purple-100">Ahorra más, vive mejor</p>
          </div>
        </Link>

        {/* Barra de búsqueda - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar ofertas, restaurantes, spas..."
              className="w-full px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
              🔍 Buscar
            </button>
          </div>
        </div>

        {/* Menú Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="text-white hover:text-purple-200 font-medium transition-colors"
          >
            Ofertas
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/mis-cupones"
                className="text-white hover:text-purple-200 font-medium transition-colors"
              >
                Mis Cupones
              </Link>
              
              {/* Dropdown de usuario */}
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all">
                  <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.nombres?.charAt(0)}{user?.apellidos?.charAt(0)}
                  </div>
                  <span className="text-white font-medium">
                    {user?.nombres}
                  </span>
                  <span className="text-white">▼</span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/mi-perfil"
                    className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-t-lg transition-colors"
                  >
                    👤 Mi Perfil
                  </Link>
                  <Link
                    to="/mis-cupones"
                    className="block px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    🎫 Mis Cupones
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-purple-200 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:bg-purple-50 hover:shadow-lg transition-all"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden text-white text-2xl"
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden mt-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar ofertas..."
              className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="text-gray-800 hover:text-purple-600 font-medium py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              Ofertas
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/mis-cupones"
                  className="text-gray-800 hover:text-purple-600 font-medium py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Mis Cupones
                </Link>
                <Link
                  to="/mi-perfil"
                  className="text-gray-800 hover:text-purple-600 font-medium py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  👤 Mi Perfil ({user?.nombres})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuAbierto(false);
                  }}
                  className="text-left text-red-600 hover:text-red-700 font-medium py-2 px-4 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🚪 Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:text-purple-600 font-medium py-2 px-4 hover:bg-purple-50 rounded-lg transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-linear-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-4 rounded-lg text-center hover:shadow-lg transition-all"
                  onClick={() => setMenuAbierto(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
