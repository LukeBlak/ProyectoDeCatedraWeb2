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
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white rounded-lg p-2 shadow-md group-hover:shadow-xl transition-shadow">
            <img src="/icons/cupon.png" alt="La Cuponera" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              LA CUPONERA
            </h1>
            <p className="text-xs text-sky-100">Ahorra más, vive mejor</p>
          </div>
        </Link>

        {/* Buscador Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar ofertas, restaurantes, spas..."
              className="w-full px-6 py-3 rounded-full bg-white/90 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-5 py-2 rounded-full hover:shadow-lg transition-all flex items-center gap-2">
              <img src="/icons/lupa.png" alt="" className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Menú Desktop */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/" className="text-white hover:text-sky-200 font-medium">
            Ofertas
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/mis-cupones"
                className="text-white hover:text-sky-200 font-medium"
              >
                Mis Cupones
              </Link>

              {/* Usuario */}
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.nombres?.charAt(0)}
                    {user?.apellidos?.charAt(0)}
                  </div>
                  <span className="text-white font-medium">
                    {user?.nombres}
                  </span>
                  <img src="/icons/chevron-down.svg" alt="" className="w-3 h-3" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    to="/mi-perfil"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-t-xl"
                  >
                    <img src="/icons/user.svg" alt="" className="w-4 h-4" />
                    Mi Perfil
                  </Link>
                  <Link
                    to="/mis-cupones"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-sky-50"
                  >
                    <img src="/icons/ticket.svg" alt="" className="w-4 h-4" />
                    Mis Cupones
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl"
                  >
                    <img src="/icons/logout.svg" alt="" className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-sky-200 font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-white text-sky-600 px-6 py-2 rounded-full font-bold hover:bg-sky-50 hover:shadow-lg transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden"
        >
          <img
            src={menuAbierto ? '/icons/close.svg' : '/icons/menu.svg'}
            alt="Menú"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden mt-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl">
          <input
            type="text"
            placeholder="Buscar ofertas..."
            className="w-full px-4 py-3 mb-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <div className="flex flex-col gap-3">
            <Link to="/" className="nav-mobile" onClick={() => setMenuAbierto(false)}>
              Ofertas
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/mis-cupones" className="nav-mobile" onClick={() => setMenuAbierto(false)}>
                  Mis Cupones
                </Link>
                <Link to="/mi-perfil" className="nav-mobile" onClick={() => setMenuAbierto(false)}>
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuAbierto(false);
                  }}
                  className="text-left text-red-600 font-medium py-2 px-4 hover:bg-red-50 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-mobile" onClick={() => setMenuAbierto(false)}>
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg text-center"
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