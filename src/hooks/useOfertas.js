import { useState, useEffect } from 'react';
import { getOfertas, getOfertasPorRubro, getOfertaById, getRubros } from '../services/ofertasService';

export const useOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOfertas = async () => {
    setLoading(true);
    try {
      const data = await getOfertas();
      setOfertas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRubros = async () => {
    try {
      const data = await getRubros();
      setRubros(data);
    } catch (err) {
      console.error("Error cargando rubros:", err);
    }
  };

  const loadOfertasPorRubro = async (rubro) => {
    setLoading(true);
    try {
      const data = await getOfertasPorRubro(rubro);
      setOfertas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOfertaById = async (id) => {
    setLoading(true);
    try {
      const data = await getOfertaById(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfertas();
    loadRubros();
  }, []);

  return {
    ofertas,
    rubros,
    loading,
    error,
    loadOfertas,
    loadOfertasPorRubro,
    loadOfertaById
  };
};