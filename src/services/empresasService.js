import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'empresas';

export const empresasService = {
  // Obtener todas las empresas
  getEmpresas: async () => {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docData) => ({
        id: docData.id,
        ...docData.data(),
      }));
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      throw error;
    }
  },

  // Obtener solo empresas activas
  getEmpresasActivas: async () => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('estadoEmpresa', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docData) => ({
        id: docData.id,
        ...docData.data(),
      }));
    } catch (error) {
      console.error('Error al obtener empresas activas:', error);
      throw error;
    }
  },

  // Crear nueva empresa
  crearEmpresa: async (empresaData) => {
    try {
      // Validaciones
      if (!empresaData.nombreEmpresa || empresaData.nombreEmpresa.trim().length < 3) {
        throw new Error('El nombre de la empresa debe tener al menos 3 caracteres');
      }

      if (!empresaData.rubroEmpresa || empresaData.rubroEmpresa.trim().length < 2) {
        throw new Error('El rubro debe tener al menos 2 caracteres');
      }

      if (!empresaData.emailEmpresa || !empresaData.emailEmpresa.includes('@')) {
        throw new Error('El email debe ser válido');
      }

      if (!empresaData.telefonoContacto || empresaData.telefonoContacto.length < 8) {
        throw new Error('El teléfono debe tener al menos 8 caracteres');
      }

      if (!empresaData.nombreContacto || empresaData.nombreContacto.trim().length < 3) {
        throw new Error('El nombre del contacto debe tener al menos 3 caracteres');
      }

      const nuevaEmpresa = {
        nombreEmpresa: empresaData.nombreEmpresa.trim(),
        rubroEmpresa: empresaData.rubroEmpresa.trim(),
        emailEmpresa: empresaData.emailEmpresa.trim().toLowerCase(),
        telefonoContacto: empresaData.telefonoContacto.trim(),
        nombreContacto: empresaData.nombreContacto.trim(),
        estadoEmpresa: true,
        fechaCreacion: serverTimestamp(),
        fechaModificacion: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), nuevaEmpresa);
      return { id: docRef.id, ...nuevaEmpresa };
    } catch (error) {
      console.error('Error al crear empresa:', error);
      throw error;
    }
  },

  // Actualizar empresa
  actualizarEmpresa: async (empresaId, empresaData) => {
    try {
      const updateData = {
        nombreEmpresa: empresaData.nombreEmpresa?.trim() || undefined,
        rubroEmpresa: empresaData.rubroEmpresa?.trim() || undefined,
        emailEmpresa: empresaData.emailEmpresa?.trim().toLowerCase() || undefined,
        telefonoContacto: empresaData.telefonoContacto?.trim() || undefined,
        nombreContacto: empresaData.nombreContacto?.trim() || undefined,
        estadoEmpresa:
          typeof empresaData.estadoEmpresa === 'boolean' ? empresaData.estadoEmpresa : undefined,
        fechaModificacion: serverTimestamp(),
      };

      // Eliminar valores undefined
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      await updateDoc(doc(db, COLLECTION_NAME, empresaId), updateData);
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      throw error;
    }
  },

  // Eliminar empresa
  eliminarEmpresa: async (empresaId) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, empresaId));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
      throw error;
    }
  },
};
