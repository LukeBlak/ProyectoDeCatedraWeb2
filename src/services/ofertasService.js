// src/services/ofertasService.js
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';

const COLLECTION_NAME = "ofertas";

export const getOfertas = async () => {
  try {
    const ofertasCol = collection(db, COLLECTION_NAME);
    const q = query(ofertasCol, orderBy("fechaExpiracion", "asc"));
    const ofertaSnapshot = await getDocs(q);
    
    const ofertaList = ofertaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return ofertaList;
  } catch (error) {
    console.error("Error al obtener ofertas:", error);
    throw error;
  }
};

export const getOfertasPorRubro = async (rubro) => {
  try {
    const ofertasCol = collection(db, COLLECTION_NAME);
    const q = query(
      ofertasCol, 
      where("rubro", "==", rubro),
      where("disponible", "==", true),
      orderBy("fechaExpiracion", "asc")
    );
    const ofertaSnapshot = await getDocs(q);
    
    const ofertaList = ofertaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return ofertaList;
  } catch (error) {
    console.error("Error al obtener ofertas por rubro:", error);
    throw error;
  }
};

export const getOfertaById = async (id) => {
  try {
    const ofertaDoc = doc(db, COLLECTION_NAME, id);
    const ofertaSnapshot = await getDoc(ofertaDoc);
    
    if (ofertaSnapshot.exists()) {
      return {
        id: ofertaSnapshot.id,
        ...ofertaSnapshot.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener oferta:", error);
    throw error;
  }
};


export const getRubros = async () => {
  try {
    const ofertas = await getOfertas();
    const rubros = [...new Set(ofertas.map(oferta => oferta.rubro))];
    return rubros.filter(rubro => rubro);
  } catch (error) {
    console.error("Error al obtener rubros:", error);
    throw error;
  }
};