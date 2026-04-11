import { collection, getDocs, orderBy, query, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getOfertasPendientes = async () => {
  const ofertasCol = collection(db, 'ofertas');
  const q = query(ofertasCol, where('estado', '==', 'pendiente'), orderBy('fechaExpiracion', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docData => ({ id: docData.id, ...docData.data() }));
};

export const aprobarOferta = async (id) => {
  await updateDoc(doc(db, 'ofertas', id), { estado: 'aprobada', disponible: true });
};

export const rechazarOferta = async (id) => {
  await updateDoc(doc(db, 'ofertas', id), { estado: 'rechazada', disponible: false });
};
