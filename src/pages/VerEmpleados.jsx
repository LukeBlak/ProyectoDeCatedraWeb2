// src/pages/VerEmpleados.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const VerEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

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

  const handleEditClick = (emp) => {
    setEditId(emp.id);
    setEditForm({ ...emp });
    setEditError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({});
    setEditError('');
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError('');
    try {
      await updateDoc(doc(db, 'usuarios', editId), {
        nombres: editForm.nombres,
        apellidos: editForm.apellidos,
        email: editForm.email,
        telefono: editForm.telefono,
        direccion: editForm.direccion,
        dui: editForm.dui,
      });
      setEmpleados(empleados.map(emp => emp.id === editId ? { ...emp, ...editForm } : emp));
      setEditId(null);
      setEditForm({});
    } catch (err) {
      setEditError('Error al guardar cambios');
    }
    setEditLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este empleado?')) return;
    await deleteDoc(doc(db, 'usuarios', id));
    setEmpleados(empleados.filter(emp => emp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <a href="/admin" className="inline-flex items-center gap-2 bg-white text-purple-700 px-5 py-2 rounded-full shadow-md hover:shadow-xl transition">
            <span className="text-lg">←</span> Volver al Panel de Administración
          </a>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
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
                  <li key={emp.id} className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {emp.nombres?.charAt(0)}{emp.apellidos?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{emp.nombres} {emp.apellidos}</p>
                        <p className="text-sm text-gray-500">{emp.email}</p>
                        <p className="text-xs text-gray-400">{emp.telefono}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Empleado</span>
                      <button onClick={() => handleEditClick(emp)} className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200 transition">Modificar</button>
                      <button onClick={() => handleDelete(emp.id)} className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition">Eliminar</button>
                    </div>
                    {editId === emp.id && (
                      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Nombres</label>
                            <input name="nombres" value={editForm.nombres} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400" />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Apellidos</label>
                            <input name="apellidos" value={editForm.apellidos} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400" />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
                            <input name="email" value={editForm.email} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400" />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
                            <input name="telefono" value={editForm.telefono} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400" />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">Dirección</label>
                            <input name="direccion" value={editForm.direccion} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400" />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">DUI</label>
                            <input name="dui" value={editForm.dui} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400" />
                          </div>
                        </div>
                        {editError && <div className="text-red-600 text-sm font-medium mt-2">{editError}</div>}
                        <div className="flex gap-2 mt-4">
                          <button onClick={handleEditSave} disabled={editLoading} className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-700 transition">
                            {editLoading ? 'Guardando...' : 'Guardar Cambios'}
                          </button>
                          <button onClick={handleEditCancel} type="button" className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-bold hover:bg-gray-300 transition">Cancelar</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
