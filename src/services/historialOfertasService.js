import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getHistorialOfertas = async () => {
  const ofertasCol = collection(db, 'ofertas');
  const q = query(ofertasCol, orderBy('fechaCreacion', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docData => ({ id: docData.id, ...docData.data() }));
};
