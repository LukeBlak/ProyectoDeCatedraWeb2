// src/pages/AdminPanel.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/common/StatCard';
import { getEmpresasYClientesDetalle } from '../services/clientesService';
import { getOfertasPendientes } from '../services/ofertasPendientesService';

export const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [stats, setStats] = useState({
    totalEmpresas: '-',
    totalClientes: '-',
    totalEmpleados: '-',
    ofertasActivas: '-',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sections = [
    {
      id: 'empresas',
      title: 'Empresas y Clientes',
      description: 'Consulta detalle operativo de empresas y clientes',
      icon: '🏢',
      color: 'from-blue-500 to-blue-600',
      links: [
        { label: 'Detalle de Empresas y Clientes', href: '/admin/empresas-clientes' },
        { label: 'Agregar Empresa', href: '/admin/empresas/nueva' },
        { label: 'Gestión de Ofertas de Empresa', href: '/empresa/ofertas' }
      ]
    },
    {
      id: 'empleados',
      title: 'Gestionar Empleados',
      description: 'Administra empleados de las empresas',
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
      links: [
        { label: 'Ver Empleados', href: '/admin/empleados' },
        { label: 'Agregar Empleado', href: '/admin/empleados/nuevo' }
      ]
    },
    {
      id: 'rubros',
      title: 'Gestionar Rubros',
      description: 'Crea y administra categorías de negocios',
      icon: '📂',
      color: 'from-emerald-500 to-emerald-600',
      links: [
        { label: 'Ver Rubros', href: '/admin/rubros' },
        { label: 'Crear Rubro', href: '/admin/rubros/nuevo' }
      ]
    },
    {
      id: 'ofertas',
      title: 'Aprobar Ofertas',
      description: 'Revisa y aprueba ofertas pendientes',
      icon: '✨',
      color: 'from-orange-500 to-orange-600',
      links: [
        { label: 'Ofertas Pendientes', href: '/admin/ofertas', badge: true },
        { label: 'Historial de Ofertas', href: '/admin/ofertas/historial' }
      ]
    }
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getEmpresasYClientesDetalle();
        setStats({
          totalEmpresas: response.resumen.totalEmpresas,
          totalClientes: response.resumen.totalClientes,
          totalEmpleados: response.resumen.totalEmpleados,
          ofertasActivas: response.resumen.ofertasActivas,
        });
      } catch (_error) {
        setStats({
          totalEmpresas: '-',
          totalClientes: '-',
          totalEmpleados: '-',
          ofertasActivas: '-',
        });
      }
    };

    loadStats();

    // Cargar count de ofertas pendientes
    getOfertasPendientes()
      .then(data => setPendingCount(data.length))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 via-emerald-500 to-sky-600 text-white py-8 shadow-lg">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">⚙️</span>
              <div>
                <h1 className="text-4xl font-bold">Panel de Administración</h1>
                <p className="text-sky-100 mt-1">Gestiona empresas, empleados, rubros y ofertas</p>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.nombres?.charAt(0)}{user?.apellidos?.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-semibold">{user?.nombres} {user?.apellidos}</p>
                  <p className="text-xs text-sky-100/80">{user?.rol?.toUpperCase()}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-white transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 overflow-hidden">
                    <Link
                      to="/mi-perfil"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 transition"
                    >
                      <span>Mi Perfil</span>
                    </Link>
                    <Link
                      to="/mis-cupones"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 transition"
                    >
                      <span>Mis Cupones</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                </>
              )}
            </div>
          </div>

          <p className="text-sky-100 text-sm">Bienvenido, <strong>{user?.nombres}</strong></p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white text-sky-700 px-5 py-3 rounded-full shadow-md hover:shadow-xl transition"
        >
          <span className="text-lg">←</span>
          Volver al Home
        </Link>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-purple-100"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${section.color} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-5xl mb-3">{section.icon}</div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <p className="text-white/80 mt-1">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-3">
                  {section.links.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-sky-50 hover:to-emerald-50 transition group cursor-pointer border border-gray-200"
                    >
                      <span className="font-medium text-gray-700 group-hover:text-sky-700 flex items-center gap-2">
                        {link.label}
                        {link.badge && pendingCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                            {pendingCount}
                          </span>
                        )}
                      </span>

                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-sky-600 transition transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatCard label="Empresas" value={stats.totalEmpresas} color="text-blue-600" />
          <StatCard label="Clientes" value={stats.totalClientes} color="text-emerald-600" />
          <StatCard label="Empleados" value={stats.totalEmpleados} color="text-purple-600" />
          <StatCard label="Ofertas Activas" value={stats.ofertasActivas} color="text-orange-600" />
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Sobre el Panel de Administración</h3>
              <p className="text-gray-700 text-sm">
                Este panel te permite gestionar todas las aspectos de la plataforma. Puedes registrar empresas, 
                agregar empleados, crear categorías de rubros y revisar ofertas pendientes de aprobación. 
                Todos los cambios se guardan automáticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
