
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRubros, addRubro } from '../services/rubrosService';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const VerRubros = () => {
  const navigate = useNavigate();
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRubros = async () => {
    setLoading(true);
    try {
      const data = await getRubros();
      setRubros(data);
    } catch (e) {
      setRubros([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRubros();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este rubro?')) return;
    setEditLoading(true);
    try {
      await deleteDoc(doc(db, 'rubros', id));
      await fetchRubros();
    } catch (e) {
      setError('Error al eliminar el rubro.');
    }
    setEditLoading(false);
  };

  const handleEdit = (rubro) => {
    setEditId(rubro.id);
    setEditLabel(rubro.label);
    setEditValue(rubro.value);
    setError('');
  };

  const handleEditSave = async (id) => {
    if (!editLabel.trim() || !editValue.trim()) {
      setError('Completa ambos campos.');
      return;
    }
    setEditLoading(true);
    try {
      await updateDoc(doc(db, 'rubros', id), {
        label: editLabel.trim(),
        value: editValue.trim().toLowerCase(),
      });
      setEditId(null);
      setEditLabel('');
      setEditValue('');
      await fetchRubros();
    } catch (e) {
      setError('Error al editar el rubro.');
    }
    setEditLoading(false);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditLabel('');
    setEditValue('');
    setError('');
  };

  return (
    <div className="container-section flex-col min-h-screen justify-start">
      {/* Header visual */}
      <div className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 py-8 shadow-lg mb-8">
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Rubros</h1>
          <p className="text-emerald-100 text-lg">Visualiza, edita o elimina las categorías de negocio</p>
        </div>
      </div>
      {/* Botón de retorno */}
      <div className="flex justify-center mb-8">
        <button className="btn-back flex items-center gap-2 text-lg" onClick={() => navigate('/admin')}>
          <span className="inline-flex items-center gap-2 bg-gray-100 text-blue-400 px-5 py-2 rounded-full shadow-md hover:shadow-xl transition">← Volver al Panel de Admin</span>
        </button>
      </div>
      {/* Lista centrada */}
      <div className="flex justify-center w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-2 text-emerald-700">Rubros existentes</h2>
          <p className="mb-4 text-gray-500">Lista de categorías de negocio creadas:</p>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando rubros...</div>
          ) : rubros.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No hay rubros registrados.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rubros.map(rubro => (
                <li key={rubro.id} className="py-3 px-2 flex items-center justify-between gap-2">
                  {editId === rubro.id ? (
                    <>
                      <input
                        className="border border-gray-200 rounded-lg px-2 py-1 mr-2 w-32"
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        disabled={editLoading}
                        maxLength={32}
                      />
                      <input
                        className="border border-gray-200 rounded-lg px-2 py-1 mr-2 w-32"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                        disabled={editLoading}
                        maxLength={32}
                      />
                      <button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded mr-1 text-sm"
                        onClick={() => handleEditSave(rubro.id)}
                        disabled={editLoading}
                      >Guardar</button>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                        onClick={handleEditCancel}
                        disabled={editLoading}
                      >Cancelar</button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg text-gray-700 font-medium">{rubro.label}</span>
                      <span className="ml-2 text-xs text-gray-400">({rubro.value})</span>
                      <div className="flex gap-1 ml-auto">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleEdit(rubro)}
                          disabled={editLoading}
                        >Editar</button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleDelete(rubro.id)}
                          disabled={editLoading}
                        >Eliminar</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerRubros;
