import React from 'react';
import { useNavigate } from 'react-router-dom';

const HistorialOfertas = () => {
  const navigate = useNavigate();

  return (
    <div className="container-section">
      <button className="btn-back" onClick={() => navigate('/admin')}>
        ← Volver al Panel de Admin
      </button>
      <h2>Historial de Ofertas</h2>
      <p>Aquí se mostrará el historial de ofertas gestionadas.</p>
      {/* Aquí irá la lógica para mostrar el historial de ofertas */}
    </div>
  );
};

export default HistorialOfertas;
