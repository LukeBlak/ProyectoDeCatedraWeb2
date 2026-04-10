import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

const COLLECTION_NAME = 'rubros';

export const getRubros = async () => {
  const rubrosRef = collection(db, COLLECTION_NAME);
  const q = query(rubrosRef, orderBy('label'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addRubro = async (data) => {
  const rubrosRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(rubrosRef, data);
  return { id: docRef.id, ...data };
};
