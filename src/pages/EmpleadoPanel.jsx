import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

const EmpleadoPanel = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧑‍💼</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Empleado</h1>
            <p className="text-gray-600">Acceso a gestión de rubros y empresas/clientes</p>
          </div>

          <div className="space-y-8">
            {/* Acceso rápido a páginas del panel de usuario para empleados */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-blue-400">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Empresas y Clientes</h2>
              <p className="text-gray-600 mb-4">Consulta y administra empresas y clientes</p>
              <div className="flex flex-col gap-3">
                <Link to="/mis-cupones" className="panel-link">Mis Cupones</Link>
                <Link to="/mi-perfil" className="panel-link">Mi Perfil</Link>
                <Link to="/empresa/ofertas" className="panel-link">Gestión de Ofertas de Empresa</Link>
              </div>
            </div>

            {/* Gestión de Rubros */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-emerald-400">
              <h2 className="text-2xl font-bold text-emerald-700 mb-2">Gestionar Rubros</h2>
              <p className="text-gray-600 mb-4">Crea y administra categorías de negocios</p>
              <div className="flex flex-col gap-3">
                <Link to="/admin/rubros" className="panel-link">Ver Rubros</Link>
                <Link to="/admin/rubros/nuevo" className="panel-link">Crear Rubro</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmpleadoPanel;
