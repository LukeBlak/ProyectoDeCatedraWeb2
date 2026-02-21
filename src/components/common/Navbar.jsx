// src/components/common/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    navigate('/');
  };

  return (
    <>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-white rounded-lg p-2 shadow-md group-hover:shadow-xl transition-shadow">
              <img src="/icons/cupon.png" alt="La Cuponera" className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                LA CUPONERA
              </h1>
              <p className="text-xs text-sky-100">Ahorra más, vive mejor</p>
            </div>
          </Link>

          {/* Buscador Desktop/Tablet */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar ofertas, restaurantes, spas..."
                className="w-full px-6 py-3 rounded-full bg-white/90 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-lg"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-5 py-2 rounded-full hover:shadow-lg transition-all flex items-center gap-2">
                <img src="/icons/lupa.png" alt="" className="w-4 h-4" />
                <span className="hidden xl:inline">Buscar</span>
              </button>
            </div>
          </div>

          {/* Menú Desktop */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link to="/ofertas" className="text-white hover:text-sky-200 font-medium whitespace-nowrap">
              Ofertas
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/mis-cupones"
                  className="text-white hover:text-sky-200 font-medium whitespace-nowrap"
                >
                  Mis Cupones
                </Link>

                {/* Usuario Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setDropdownAbierto(!dropdownAbierto)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.nombres?.charAt(0)}
                      {user?.apellidos?.charAt(0)}
                    </div>
                    <span className="text-white font-medium max-w-[100px] truncate">
                      {user?.nombres}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-white transition-transform ${dropdownAbierto ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownAbierto && (
                    <>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50">
                        <Link
                          to="/mi-perfil"
                          onClick={() => setDropdownAbierto(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-t-xl transition"
                        >
                          <img src="/icons/user_8370811.png" alt="" className="w-5 h-5" />
                          <span>Mi Perfil</span>
                        </Link>
                        <Link
                          to="/mis-cupones"
                          onClick={() => setDropdownAbierto(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 transition"
                        >
                          <img src="/icons/cupon.png" alt="" className="w-5 h-5" />
                          <span>Mis Cupones</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setDropdownAbierto(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl transition"
                        >
                          <img src="/icons/turn-off_2550435.png" alt="" className="w-5 h-5" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                      
                      {/* Overlay para cerrar dropdown */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownAbierto(false)}
                      ></div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-sky-200 font-medium whitespace-nowrap"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-sky-600 px-6 py-2 rounded-full font-bold hover:bg-sky-50 hover:shadow-lg transition whitespace-nowrap"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón Hamburguesa (móvil/tablet) */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Menú"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Buscador móvil (debajo del header) */}
        <div className="lg:hidden mt-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar ofertas..."
              className="w-full px-4 py-3 pr-12 rounded-full bg-white/90 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white p-2 rounded-full hover:shadow-lg transition-all">
              <img src="/icons/lupa.png" alt="Buscar" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Menú Móvil */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header del Sidebar */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons/cupon.png" alt="La Cuponera" className="w-8 h-8" />
            <div>
              <h2 className="text-white font-bold text-lg">LA CUPONERA</h2>
              <p className="text-sky-100 text-xs">Menú</p>
            </div>
          </div>
          <button
            onClick={() => setMenuAbierto(false)}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del Sidebar */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-100px)]">
          
          {/* Info del Usuario (si está logueado) */}
          {isAuthenticated && (
            <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.nombres?.charAt(0)}
                  {user?.apellidos?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user?.nombres} {user?.apellidos}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Links de Navegación */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/ofertas"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-lg transition font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Ofertas
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/mis-cupones"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-lg transition font-medium"
                >
                  <img src="/icons/cupon.png" alt="" className="w-5 h-5" />
                  Mis Cupones
                </Link>

                <Link
                  to="/mi-perfil"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-lg transition font-medium"
                >
                  <img src="/icons/user_8370811.png" alt="" className="w-5 h-5" />
                  Mi Perfil
                </Link>

                <div className="border-t border-gray-200 my-4"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium w-full"
                >
                  <img src="/icons/turn-off_2550435.png" alt="" className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-lg transition font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar Sesión
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuAbierto(false)}
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg text-center hover:shadow-lg transition mt-2"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay oscuro cuando el menú está abierto */}
      {menuAbierto && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}
    </>
  );
};