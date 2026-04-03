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

const ofertaBasePayload = (ofertaData) => {
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
  const q = query(ofertasCol, orderBy('fechaExpiracion', 'asc'));
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
  const ofertas = await getOfertas();

  if (user?.rol === 'admin') {
    return ofertas;
  }

  return ofertas.filter((oferta) => matchesEmpresa(oferta, user));
};

export const crearOfertaEmpresa = async (ofertaData, user) => {
  const payload = ofertaBasePayload(ofertaData);

  const empresaNombre =
    user?.empresa || user?.empresaNombre || user?.nombreEmpresa || 'Mi empresa';

  const nuevaOferta = {
    ...payload,
    empresa: empresaNombre,
    empresaNombre: empresaNombre,
    empresaId: user?.empresaId || null,
    creadoPor: user?.id || user?.uid || null,
    fechaInicio: serverTimestamp(),
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), nuevaOferta);
  return { id: docRef.id, ...nuevaOferta };
};

export const actualizarOfertaEmpresa = async (id, ofertaData) => {
  const payload = ofertaBasePayload(ofertaData);

  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...payload,
    fechaActualizacion: serverTimestamp(),
  });

  return { success: true };
};

export const eliminarOfertaEmpresa = async (id) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
  return { success: true };
};