
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
      const queryByCode = query(
        collection(db, 'cupones'),
        where('usuarioId', '==', usuarioId)
      );

      const querySnapshot = await getDocs(queryByCode);

      if (querySnapshot.empty) {
        return []; // Es mejor retornar array vacío que lanzar error si no tiene cupones
      }
      
      // Mapeamos todos los documentos para convertir las fechas
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convertimos los Timestamps a objetos Date de JS
          fechaCompra: data.fechaCompra?.toDate(),
          fechaCreacion: data.fechaCreacion?.toDate(), 
          fechaLimiteUso: data.fechaLimiteUso?.toDate() 
        };
      });

    } catch (error) {
      console.error('Error al buscar cupon:', error);
      throw error;
    }
  },

  // Obtener un cupón por su código
  getCuponByCodigo: async (codigo) => {
    try {
      const queryByCode = query(
        collection(db, 'cupones'),
        where('codigo', '==', codigo)
      );

      const querySnapshot = await getDocs(queryByCode);
      const cupones = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cupones.push({
          id: doc.id,
          ...data,
          fechaCompra: data.fechaCompra?.toDate(),
          fechaCreacion: data.fechaCreacion?.toDate(), // <--- CAMBIO AQUÍ
          fechaLimiteUso: data.fechaLimiteUso?.toDate() // <--- CAMBIO AQUÍ
        });
      });
      
      return cupones;
    } catch (error) {
      console.error('Error al obtener cupones:', error);
      throw error;
    }
  },

  // ==================== ESCRITURA ====================

  // Generar cupones basados en los elementos del carrito
  crearCuponesCompraCarrito: async (usuarioId, dui, carrito, pedidoId) => {
    try {
      const cuponesCreados = [];
      const fechaActual = new Date();
      // Fecha límite general por defecto: 30 días posteriores a la compra
      const fechaLimite = new Date(fechaActual);
      fechaLimite.setDate(fechaLimite.getDate() + 30);

      for (const item of carrito) {
        // Por cada unidad comprada del mismo producto, se genera un código diferente
        for (let i = 0; i < item.cantidad; i++) {
          const prefijo = item.empresa ? item.empresa.substring(0, 3).toUpperCase() : 'CUP';
          const codigoUnico = cuponesService.generarCodigo(prefijo);

          const cuponData = {
            usuarioId,
            dui: dui || '',
            ofertaId: item.id,
            pedidoId: pedidoId || '',
            tituloOferta: item.titulo || item.tituloOferta || '',
            empresaOfertante: item.empresa || item.empresaOfertante || '',
            precioRegular: item.precioRegular || 0,
            precioOferta: item.precioOferta || 0,
            icono: item.icono || '',
            codigo: codigoUnico,
            estado: 'disponible',
            fechaCompra: serverTimestamp(),
            fechaCreacion: serverTimestamp(),
            fechaLimiteUso: Timestamp.fromDate(fechaLimite)
          };

          const docRef = await addDoc(collection(db, 'cupones'), cuponData);
          cuponesCreados.push({
            id: docRef.id,
            ...cuponData,
            fechaCompra: fechaActual,
            fechaCreacion: fechaActual,
            fechaLimiteUso: fechaLimite
          });
        }
      }
      return cuponesCreados;
    } catch (error) {
      console.error('Error al crear los cupones desde el carrito:', error);
      throw error;
    }
  },

  // Crear cupones después de una compra (Metodo legado)
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