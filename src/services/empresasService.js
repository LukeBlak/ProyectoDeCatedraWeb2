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
import { sanitizeByField, validateFormFields, hasUnsafeContent } from '../utils/formSecurity';

const COLLECTION_NAME = 'empresas';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (telefono) => /^\d{4}-?\d{4}$/.test(telefono);

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
      const cleanData = {
        nombreEmpresa: sanitizeByField('nombreEmpresa', empresaData.nombreEmpresa).trim(),
        rubroEmpresa: sanitizeByField('rubroEmpresa', empresaData.rubroEmpresa).trim(),
        emailEmpresa: sanitizeByField('emailEmpresa', empresaData.emailEmpresa).trim().toLowerCase(),
        telefonoContacto: sanitizeByField('telefonoContacto', empresaData.telefonoContacto).trim(),
        nombreContacto: sanitizeByField('nombreContacto', empresaData.nombreContacto).trim(),
      };

      const validationErrors = validateFormFields(cleanData, [
        'nombreEmpresa',
        'rubroEmpresa',
        'emailEmpresa',
        'telefonoContacto',
        'nombreContacto',
      ]);

      if (!cleanData.rubroEmpresa) {
        validationErrors.rubroEmpresa = 'Debes seleccionar un rubro.';
      }

      if (Object.keys(validationErrors).length > 0) {
        throw new Error(Object.values(validationErrors)[0]);
      }

      if (!isValidEmail(cleanData.emailEmpresa)) {
        throw new Error('Correo electrónico inválido.');
      }

      if (!isValidPhone(cleanData.telefonoContacto)) {
        throw new Error('Formato de teléfono inválido. Usa 7777-7777 o 77777777.');
      }

      if (
        hasUnsafeContent(cleanData.nombreEmpresa) ||
        hasUnsafeContent(cleanData.nombreContacto)
      ) {
        throw new Error('Se detectaron caracteres no permitidos.');
      }

      const nuevaEmpresa = {
        nombreEmpresa: cleanData.nombreEmpresa,
        rubroEmpresa: cleanData.rubroEmpresa,
        emailEmpresa: cleanData.emailEmpresa,
        telefonoContacto: cleanData.telefonoContacto,
        nombreContacto: cleanData.nombreContacto,
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
