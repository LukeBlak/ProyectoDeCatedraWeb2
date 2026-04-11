// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { MisCupones } from '../pages/MisCupones';
import { MiPerfil } from '../pages/MiPerfil';
import { ProtectedRoute } from './ProtectedRoute';
import { Ofertas } from "../pages/Ofertas";
import { AdminPanel } from "../pages/AdminPanel";
import VerRubros from "../pages/VerRubros";
import CrearRubro from "../pages/CrearRubro";
import OfertasPendientes from "../pages/OfertasPendientes";
import HistorialOfertas from "../pages/HistorialOfertas";
import { AdminEmpresasClientes } from '../pages/AdminEmpresasClientes';
import { EmpresaOfertasAdmin } from '../pages/EmpresaOfertasAdmin';
import { DetalleOferta } from '../pages/DetalleOferta';
import { VerEmpleados } from '../pages/VerEmpleados';
import { AgregarEmpleado } from '../pages/AgregarEmpleado';
import { MiCarrito } from '../pages/MiCarrito';
import { AgregarEmpresa } from '../pages/AgregarEmpresa';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ofertas" element={<Ofertas />} />
      <Route path="/detalle-oferta/:id" element={<DetalleOferta />} />
      <Route path="/carrito" element={<MiCarrito />} />

      {/* Rutas Protegidas - Usuario Autenticado */}
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

      {/* Rutas Protegidas - Solo Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/empresas-clientes"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminEmpresasClientes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/empresas/nueva"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AgregarEmpresa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/empresa/ofertas"
        element={
          <ProtectedRoute allowedRoles={['admin', 'empleado', 'admin_empresa']}>
            <EmpresaOfertasAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/empleados"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <VerEmpleados />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/empleados/nuevo"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AgregarEmpleado />
          </ProtectedRoute>
        }
      />

        {/* Rutas Rubros */}
        <Route
          path="/admin/rubros"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VerRubros />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rubros/nuevo"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CrearRubro />
            </ProtectedRoute>
          }
        />

        {/* Rutas Ofertas */}
        <Route
          path="/admin/ofertas"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <OfertasPendientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ofertas/historial"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HistorialOfertas />
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
