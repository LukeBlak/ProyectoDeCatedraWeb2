import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';
import {
  actualizarOfertaEmpresa,
  crearOfertaEmpresa,
  eliminarOfertaEmpresa,
  getOfertasEmpresaAdmin,
} from '../services/ofertasService';
import { empresasService } from '../services/empresasService';
import { getRubros } from '../services/rubrosService';
import { sanitizeByField, validateFormFields } from '../utils/formSecurity';



// ...existing code...
const INITIAL_FORM = {
  titulo: '',
  descripcion: '',
  rubro: '',
  precioOriginal: '',
  precioDescuento: '',
  fechaExpiracion: '',
  imagen: '',
  disponible: true,
  empresaId: '',
};

export const EmpresaOfertasAdmin = () => {
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [rubros, setRubros] = useState([]);
  const [loadingRubros, setLoadingRubros] = useState(true);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);
  const isAdmin = user?.rol === 'admin';

  const loadEmpresas = useCallback(async () => {
    try {
      const data = await empresasService.getEmpresasActivas();
      setEmpresas(data);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
    }
  }, []);

  const loadOfertas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOfertasEmpresaAdmin(user);
      setOfertas(data);
    } catch (err) {
      setError(err.message || 'No fue posible cargar las ofertas.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadEmpresas();
      loadOfertas();
    }
  }, [user, loadEmpresas, loadOfertas]);

  useEffect(() => {
    const fetchRubros = async () => {
      setLoadingRubros(true);
      try {
        const data = await getRubros();
        setRubros(data);
      } catch (e) {
        setRubros([]);
      }
      setLoadingRubros(false);
    };
    fetchRubros();
  }, []);

  const validateForm = () => {
    const titulo = String(form.titulo || '').trim();
    const descripcion = String(form.descripcion || '').trim();
    const rubro = String(form.rubro || '').trim();
    const original = Number(form.precioOriginal);
    const descuento = Number(form.precioDescuento);

    if (titulo.length < 3) {
      throw new Error('El titulo debe tener al menos 3 caracteres.');
    }

    if (descripcion.length < 10) {
      throw new Error('La descripcion debe tener al menos 10 caracteres.');
    }

    if (!rubro) {
      throw new Error('El rubro es obligatorio.');
    }

    if (Number.isNaN(original) || original <= 0) {
      throw new Error('El precio original debe ser mayor a 0.');
    }

    if (Number.isNaN(descuento) || descuento <= 0) {
      throw new Error('El precio con descuento debe ser mayor a 0.');
    }

    if (descuento >= original) {
      throw new Error('El precio con descuento debe ser menor al precio original.');
    }

    const validationErrors = validateFormFields(form, ['titulo', 'descripcion', 'imagen']);
    if (Object.keys(validationErrors).length > 0) {
      throw new Error(Object.values(validationErrors)[0]);
    }
  };

  const clearForm = () => {
    setForm({ 
      ...INITIAL_FORM, 
      empresaId: isAdmin && empresas.length > 0 ? empresas[0].id : '' 
    });
    setEditingId(null);
  };

  const toInputDate = (timestampValue) => {
    if (!timestampValue?.toDate) return '';
    const date = timestampValue.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startEdit = (oferta) => {
    setEditingId(oferta.id);
    setForm({
      titulo: oferta.titulo || '',
      descripcion: oferta.descripcion || '',
      rubro: oferta.rubro || '',
      precioOriginal: String(oferta.precioOriginal || ''),
      precioDescuento: String(oferta.precioDescuento || ''),
      fechaExpiracion: toInputDate(oferta.fechaExpiracion),
      imagen: oferta.imagen || '',
      disponible: typeof oferta.disponible === 'boolean' ? oferta.disponible : true,
      empresaId: oferta.empresaId || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      validateForm();

      if (!isAdmin && !user?.empresaId) {
        throw new Error('No tienes una empresa asociada.');
      }

      if (isAdmin && !form.empresaId) {
        throw new Error('Debes seleccionar una empresa.');
      }

      const formData = { ...form };
      if (isAdmin) {
        const selectedEmpresa = empresas.find((e) => e.id === form.empresaId);
        if (!selectedEmpresa) throw new Error('Empresa no válida.');
        formData.empresaId = selectedEmpresa.id;
        formData.empresaNombre = selectedEmpresa.nombreEmpresa;
      }

      if (isEditing) {
        await actualizarOfertaEmpresa(editingId, formData, user);
      } else {
        // Eliminar 'disponible' del formData para que el backend lo ponga en false
        const { disponible, ...formDataSinDisponible } = formData;
        await crearOfertaEmpresa(formDataSinDisponible, user);
      }

      clearForm();
      await loadOfertas();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la oferta.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar esta oferta? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    try {
      await eliminarOfertaEmpresa(id, user);
      await loadOfertas();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la oferta.');
    }
  };

  return (
    <>
      {/* ...todo el JSX del componente, ya presente... */}
    </>
  );
}
