// src/pages/VerEmpleados.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const VerEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoading(true);
      const q = query(collection(db, 'usuarios'), where('rol', '==', 'empleado'));
      const snapshot = await getDocs(q);
      const empleadosList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmpleados(empleadosList);
      setLoading(false);
    };
    fetchEmpleados();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👥</span>
            <h2 className="text-2xl font-bold">Empleados Registrados</h2>
          </div>
          <p className="text-white/80">Lista de empleados registrados en la plataforma</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500">Cargando empleados...</div>
          ) : empleados.length === 0 ? (
            <div className="text-center text-gray-500">No hay empleados registrados.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {empleados.map(emp => (
                <li key={emp.id} className="flex items-center gap-4 py-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {emp.nombres?.charAt(0)}{emp.apellidos?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{emp.nombres} {emp.apellidos}</p>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                    <p className="text-xs text-gray-400">{emp.telefono}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Empleado</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
