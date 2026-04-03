// src/pages/AdminPanel.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminPanel = () => {
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'empresas',
      title: 'Empresas y Clientes',
      description: 'Consulta detalle operativo de empresas y clientes',
      icon: '🏢',
      color: 'from-blue-500 to-blue-600',
      links: [
        { label: 'Detalle de Empresas y Clientes', href: '/admin/empresas-clientes' },
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
        { label: 'Ofertas Pendientes', href: '/admin/ofertas' },
        { label: 'Historial de Ofertas', href: '/admin/ofertas/historial' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 via-emerald-500 to-sky-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">⚙️</span>
            <h1 className="text-4xl font-bold">Panel de Administración</h1>
          </div>
          <p className="text-sky-100 ml-14">Gestiona empresas, empleados, rubros y ofertas</p>
          <p className="text-sky-100 ml-14 text-sm mt-2">Bienvenido, <strong>{user?.nombres}</strong></p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
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
                      <span className="font-medium text-gray-700 group-hover:text-sky-700">
                        {link.label}
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Empresas</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">-</p>
              </div>
              <span className="text-4xl">🏢</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Empleados</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">-</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Rubros</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">-</p>
              </div>
              <span className="text-4xl">📂</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Ofertas Pendientes</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">-</p>
              </div>
              <span className="text-4xl">✨</span>
            </div>
          </div>
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
