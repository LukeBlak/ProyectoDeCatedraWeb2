
import {
  collection,
  query, 
  where, 
  getDocs,
  doc,
  addDoc,
  updateDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase'
export const cuponesService = {

  // Obtener todos los cupones de un usuario
  getCuponesByUser: async (usuarioId) => {
    try {
      console.log('🔍 Buscando cupones para usuario:', usuarioId);
      
      const q = query(
        collection(db, 'cupones'),
        where('usuarioId', '==', usuarioId)
      );

      const querySnapshot = await getDocs(q);
      
      // ✅ NO lanzar error si está vacío, devolver array vacío
      if (querySnapshot.empty) {
        console.log('📭 No se encontraron cupones para este usuario');
        return []; // ← Devolver array vacío, no error
      }
      
      // ✅ Iterar TODOS los documentos, no solo el primero
      const cupones = [];
      querySnapshot.forEach((doc) => {
        cupones.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('✅ Cupones encontrados:', cupones.length);
      return cupones; // ← Devolver ARRAY de cupones
      
    } catch (error) {
      console.error('❌ Error al buscar cupones:', error);
      throw error;
    }
  },

  // Obtener un cupón por su código
  getCuponByCodigo: async (codigo) => {
    try{
      const queryByCode = query(
        collection(db, 'cupones'),
        where('codigo', '==', codigo)
      );

      const querySnapshot = await getDocs(queryByCode

      );
      const cupones = [];
      
      querySnapshot.forEach((doc) => {
        cupones.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return cupones;
    } catch (error) {
      console.error('Error al obtener cupones:', error);
      throw error;
    }
  },

  // ==================== ESCRITURA ====================

  // Crear cupones después de una compra
  crearCupones: async (datosCupones) => {
    try {
      // crea una variable vacía
      const cuponesCreados = [];
      
      // Se encarga de procesar cada dato del cupón
      for (const cuponData of datosCupones) {
        const docRef = await addDoc(collection(db, 'cupones'), {
          ...cuponData,
          fechaCreacion: serverTimestamp(),
          estado: 'disponible'
        });
        
        // se encarga de subir el cupon al sistmea
        cuponesCreados.push({
          id: docRef.id,
          ...cuponData
        });
      }
      
      return cuponesCreados;
    } catch (error) {
      console.error('Error al crear cupones:', error);
      throw error;
    }
  },

  // Canjear un cupón
  canjearCupon: async (codigo, dui) => {
    try {
      // Busca el cupón por código
      const cupon = await cuponesService.getCuponByCodigo(codigo);
      
      // Validaciones 

      //si el cupón ya es canjeado no se puede canjear de nuevo
      if (cupon.estado === 'canjeado') {
        throw new Error('Este cupón ya fue canjeado');
      }
      
      // si el cupón ya venció no se puede usar de nuevo
      if (new Date(cupon.fechaLimiteUso) <= new Date()) {
        throw new Error('Este cupón está vencido');
      }
      
      // Verifica si el dui coincide con el comprador para poder usarlo
      if (cupon.dui !== dui) {
        throw new Error('El DUI no coincide con el comprador');
      }
      
      // Actualizar estado a canjeado
      const cuponRef = doc(db, 'cupones', cupon.id);
      await updateDoc(cuponRef, {
        estado: 'canjeado',
        fechaCanje: serverTimestamp()
      });
      
      return { success: true, message: 'Cupón canjeado exitosamente' };
    } catch (error) {
      console.error('Error al canjear cupón:', error);
      throw error;
    }
  },

  // ==================== UTILIDADES ====================

  // Generar código único de cupón (codigoEmpresa + 7 dígitos)
  generarCodigo: (codigoUnico) => {
    const numerosAleatorios = Math.floor(1000000 + Math.random() * 99999999);
    return `${codigoUnico}${numerosAleatorios}`;
  }
};