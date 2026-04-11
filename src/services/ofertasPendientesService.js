import { collection, getDocs, query, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getOfertasPendientes = async () => {
  const ofertasCol = collection(db, 'ofertas');
  const q = query(ofertasCol, where('estado', '==', 'pendiente'));
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map(docData => ({ id: docData.id, ...docData.data() }));
  // Ordenar client-side para evitar índice compuesto en Firestore
  return docs.sort((a, b) => {
    const fa = a.fechaExpiracion?.toDate?.() ?? new Date(0);
    const fb = b.fechaExpiracion?.toDate?.() ?? new Date(0);
    return fa - fb;
  });
};


export const aprobarOferta = async (id) => {
  await updateDoc(doc(db, 'ofertas', id), { estado: 'aprobada', disponible: true });
};

export const rechazarOferta = async (id) => {
  await updateDoc(doc(db, 'ofertas', id), { estado: 'rechazada', disponible: false });
};
