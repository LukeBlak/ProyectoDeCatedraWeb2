import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'ofertas';

const normalize = (value) => String(value || '').trim().toLowerCase();

const normalizeText = (value) => String(value || '').trim();

const matchesEmpresa = (oferta, user) => {
  const userEmpresaId = normalize(user?.empresaId);
  const ofertaEmpresaId = normalize(oferta?.empresaId);

  if (userEmpresaId && ofertaEmpresaId) {
    return userEmpresaId === ofertaEmpresaId;
  }

  const userEmpresaNombre = normalize(
    user?.empresa || user?.empresaNombre || user?.nombreEmpresa
  );
  const ofertaEmpresaNombre = normalize(
    oferta?.empresa || oferta?.empresaNombre || oferta?.nombreEmpresa
  );

  return userEmpresaNombre && ofertaEmpresaNombre
    ? userEmpresaNombre === ofertaEmpresaNombre
    : false;
};

const parseDate = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
};

const validateOfertaPayload = (ofertaData) => {
  const titulo = normalizeText(ofertaData.titulo);
  const descripcion = normalizeText(ofertaData.descripcion);
  const rubro = normalizeText(ofertaData.rubro);
  const precioOriginal = Number(ofertaData.precioOriginal);
  const precioDescuento = Number(ofertaData.precioDescuento);
  const fechaExpiracion = parseDate(ofertaData.fechaExpiracion);

  if (titulo.length < 3) {
    throw new Error('El titulo debe tener al menos 3 caracteres.');
  }

  if (descripcion.length < 10) {
    throw new Error('La descripcion debe tener al menos 10 caracteres.');
  }

  if (!rubro) {
    throw new Error('Debes especificar un rubro para la oferta.');
  }

  if (Number.isNaN(precioOriginal) || precioOriginal <= 0) {
    throw new Error('El precio original debe ser mayor a 0.');
  }

  if (Number.isNaN(precioDescuento) || precioDescuento <= 0) {
    throw new Error('El precio con descuento debe ser mayor a 0.');
  }

  if (precioDescuento >= precioOriginal) {
    throw new Error('El precio con descuento debe ser menor que el precio original.');
  }

  if (!fechaExpiracion) {
    throw new Error('La fecha de expiracion no es valida.');
  }

  return { precioOriginal, precioDescuento, fechaExpiracion };
};

const assertCanManageOferta = async (id, user) => {
  if (!user) {
    throw new Error('Usuario no autenticado.');
  }

  if (user.rol === 'admin') {
    return;
  }

  const oferta = await getOfertaById(id);
  if (!oferta) {
    throw new Error('La oferta no existe.');
  }

  if (!matchesEmpresa(oferta, user)) {
    throw new Error('No tienes permisos para gestionar esta oferta.');
  }
};

const ofertaBasePayload = (ofertaData) => {
  validateOfertaPayload(ofertaData);

  const precioOriginal = Number(ofertaData.precioOriginal);
  const precioDescuento = Number(ofertaData.precioDescuento);

  return {
    titulo: ofertaData.titulo?.trim() || '',
    descripcion: ofertaData.descripcion?.trim() || '',
    rubro: ofertaData.rubro?.trim() || 'general',
    precioOriginal: Number.isNaN(precioOriginal) ? 0 : precioOriginal,
    precioDescuento: Number.isNaN(precioDescuento) ? 0 : precioDescuento,
    descuento:
      !Number.isNaN(precioOriginal) &&
      !Number.isNaN(precioDescuento) &&
      precioOriginal > 0
        ? Math.round(((precioOriginal - precioDescuento) / precioOriginal) * 100)
        : 0,
    imagen: ofertaData.imagen?.trim() || '',
    disponible:
      typeof ofertaData.disponible === 'boolean' ? ofertaData.disponible : true,
    fechaExpiracion: parseDate(ofertaData.fechaExpiracion),
  };
};

export const getOfertas = async () => {
  const ofertasCol = collection(db, COLLECTION_NAME);
  const q = query(
    ofertasCol,
    where('estado', '==', 'aprobada'),
    where('disponible', '==', true),
    orderBy('fechaExpiracion', 'asc')
  );
  const ofertaSnapshot = await getDocs(q);
  return ofertaSnapshot.docs.map((docData) => ({
    id: docData.id,
    ...docData.data(),
  }));
};

export const getOfertasPorRubro = async (rubro) => {
  const ofertasCol = collection(db, COLLECTION_NAME);
  const q = query(
    ofertasCol,
    where('rubro', '==', rubro),
    where('estado', '==', 'aprobada'),
    where('disponible', '==', true),
    orderBy('fechaExpiracion', 'asc')
  );
  const ofertaSnapshot = await getDocs(q);
  return ofertaSnapshot.docs.map((docData) => ({
    id: docData.id,
    ...docData.data(),
  }));
};

export const getOfertaById = async (id) => {
  const ofertaDoc = doc(db, COLLECTION_NAME, id);
  const ofertaSnapshot = await getDoc(ofertaDoc);

  if (!ofertaSnapshot.exists()) {
    return null;
  }

  return {
    id: ofertaSnapshot.id,
    ...ofertaSnapshot.data(),
  };
};

export const getRubros = async () => {
  const ofertas = await getOfertas();
  const rubros = [...new Set(ofertas.map((oferta) => oferta.rubro))];
  return rubros.filter((rubro) => rubro);
};

export const getOfertasEmpresaAdmin = async (user) => {
  if (!user) return [];

  if (user?.rol === 'admin') {
    // Admin: ver todas las ofertas sin filtrar
    const ofertasCol = collection(db, COLLECTION_NAME);
    const q = query(ofertasCol, orderBy('fechaExpiracion', 'asc'));
    const ofertaSnapshot = await getDocs(q);
    return ofertaSnapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data(),
    }));
  }

  const userEmpresaId = normalize(user?.empresaId);
  if (userEmpresaId) {
    const ofertasCol = collection(db, COLLECTION_NAME);
    const q = query(ofertasCol, where('empresaId', '==', userEmpresaId), orderBy('fechaExpiracion', 'asc'));
    const ofertaSnapshot = await getDocs(q);

    return ofertaSnapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data(),
    }));
  }

  // Para empleados/admin_empresa: ver todas las ofertas de su empresa
  const ofertasCol = collection(db, COLLECTION_NAME);
  const q = query(ofertasCol, where('empresaId', '==', user?.empresaId || ''), orderBy('fechaExpiracion', 'asc'));
  const ofertaSnapshot = await getDocs(q);
  return ofertaSnapshot.docs.map((docData) => ({
    id: docData.id,
    ...docData.data(),
  }));
};

export const crearOfertaEmpresa = async (ofertaData, user) => {
  if (!user) {
    throw new Error('Debes iniciar sesion para crear una oferta.');
  }

  if (!['admin', 'admin_empresa', 'empleado'].includes(user?.rol)) {
    throw new Error('No tienes permisos para crear ofertas.');
  }

  const payload = ofertaBasePayload(ofertaData);

  // Si viene empresaId en ofertaData (admin seleccionó empresa), usar ese
  const empresaId = ofertaData.empresaId || user?.empresaId || null;
  const empresaNombre = ofertaData.empresaNombre || user?.empresa || user?.empresaNombre || user?.nombreEmpresa || 'Mi empresa';

  const nuevaOferta = {
    ...payload,
    empresa: empresaNombre,
    empresaNombre: empresaNombre,
    empresaId: empresaId,
    creadoPor: user?.id || user?.uid || null,
    fechaInicio: serverTimestamp(),
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
    estado: 'pendiente',
    disponible: false,
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), nuevaOferta);
  return { id: docRef.id, ...nuevaOferta };
};

export const actualizarOfertaEmpresa = async (id, ofertaData, user) => {
  await assertCanManageOferta(id, user);
  const payload = ofertaBasePayload(ofertaData);

  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...payload,
    fechaActualizacion: serverTimestamp(),
  });

  return { success: true };
};

export const eliminarOfertaEmpresa = async (id, user) => {
  await assertCanManageOferta(id, user);
  await deleteDoc(doc(db, COLLECTION_NAME, id));
  return { success: true };
};
