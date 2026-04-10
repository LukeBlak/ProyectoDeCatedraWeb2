import React from 'react';
import { useNavigate } from 'react-router-dom';

const OfertasPendientes = () => {
  const navigate = useNavigate();

  return (
    <div className="container-section">
      <button className="btn-back" onClick={() => navigate('/admin')}>
        ← Volver al Panel de Admin
      </button>
      <h2>Ofertas Pendientes</h2>
      <p>Aquí se mostrarán las ofertas pendientes de aprobación.</p>
      {/* Aquí irá la lógica para listar y aprobar ofertas */}
    </div>
  );
};

export default OfertasPendientes;
