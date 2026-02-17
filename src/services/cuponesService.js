// src/services/cuponesService.js

const BASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const cuponesService = {

  // ==================== LECTURA ====================

  // Obtener todos los cupones de un usuario
  getCuponesByUser: async (usuarioId) => {
    const response = await fetch(`${BASE_URL}/rest/v1/cupones?usuario_id=eq.${usuarioId}`, {
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener cupones');
    return response.json();
  },

  // Obtener un cupón por su código
  getCuponByCodigo: async (codigo) => {
    const response = await fetch(`${BASE_URL}/rest/v1/cupones?codigo=eq.${codigo}`, {
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    if (!response.ok) throw new Error('Cupón no encontrado');
    const data = await response.json();
    return data[0];
  },

  // Obtener un cupón por su ID
  getCuponById: async (cuponId) => {
    const response = await fetch(`${BASE_URL}/rest/v1/cupones?id=eq.${cuponId}`, {
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    if (!response.ok) throw new Error('Cupón no encontrado');
    const data = await response.json();
    return data[0];
  },

  // ==================== ESCRITURA ====================

  // Crear cupones después de una compra
  crearCupones: async (datosCupones) => {
    const response = await fetch(`${BASE_URL}/rest/v1/cupones`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(datosCupones)
    });
    if (!response.ok) throw new Error('Error al crear cupones');
    return response.json();
  },

  // ==================== ACTUALIZACIÓN ====================

  // Canjear un cupón
  canjearCupon: async (codigo, dui) => {
    // Paso 1: Verificar que el cupón existe
    const cupon = await cuponesService.getCuponByCodigo(codigo);

    // Paso 2: Validar el cupón
    if (!cupon) throw new Error('Cupón no encontrado');
    if (cupon.estado === 'canjeado') throw new Error('Este cupón ya fue canjeado');
    if (new Date(cupon.fecha_limite_uso) <= new Date()) throw new Error('Este cupón está vencido');
    if (cupon.dui !== dui) throw new Error('El DUI no coincide con el comprador');

    // Paso 3: Actualizar estado a canjeado
    const response = await fetch(`${BASE_URL}/rest/v1/cupones?id=eq.${cupon.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        estado: 'canjeado',
        fecha_canje: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Error al canjear el cupón');
    return response.json();
  },

  // ==================== UTILIDADES ====================

  // Generar código único de cupón (codigoEmpresa + 7 dígitos)
  generarCodigo: (codigoEmpresa) => {
    const numerosAleatorios = Math.floor(1000000 + Math.random() * 9000000);
    return `${codigoEmpresa}${numerosAleatorios}`;
  }
};