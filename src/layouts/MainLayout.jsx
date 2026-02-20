import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Menú de navegación según rol y autenticación
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/login"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/login'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/registro"
            className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
          >
            Registrarse
          </Link>
        </>
      );
    }

    // Usuario autenticado (Cliente - Fase 1)
    return (
      <>
        <Link
          to="/"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === '/'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
          }`}
        >
          Inicio
        </Link>
        <Link
          to="/mis-cupones"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === '/mis-cupones'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
          }`}
        >
          Mis Cupones
        </Link>
        <Link
          to="/mi-perfil"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === '/mi-perfil'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
          }`}
        >
          Mi Perfil
        </Link>
        
        {/* Dropdown de Usuario */}
        <div className="relative ml-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:block">
              Hola, {user?.nombres?.split(' ')[0] || 'Usuario'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-3xl">🎫</span>
                <span className="text-2xl font-bold text-indigo-600">
                  La Cuponera
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {getNavLinks()}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {getNavLinks()}
            </div>
          </div>
        )}
      </nav>

      {/* ==================== CONTENIDO PRINCIPAL ==================== */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Información de la Empresa */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🎫</span> La Cuponera
              </h3>
              <p className="text-gray-400 text-sm">
                Descuentos exclusivos en tus restaurantes, talleres y entretenimiento favoritos.
              </p>
            </div>

            {/* Enlaces Rápidos */}
            <div>
              <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition">
                    Inicio
                  </Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <Link to="/mis-cupones" className="text-gray-400 hover:text-white transition">
                        Mis Cupones
                      </Link>
                    </li>
                    <li>
                      <Link to="/mi-perfil" className="text-gray-400 hover:text-white transition">
                        Mi Perfil
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 contacto@lacuponera.com</li>
                <li>📞 2222-2222</li>
                <li>📍 San Salvador, El Salvador</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} La Cuponera. Todos los derechos reservados.</p>
            <p className="mt-2">
              Escuela Superior de Economía y Negocios - Desarrollo Web II
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
