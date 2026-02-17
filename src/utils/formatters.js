/**
 * Formatea un precio a formato de moneda
 * @param {number} precio - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatearPrecio = (precio) => {
    return `$${parseFloat(precio).toFixed(2)}`;
};

/**
 * Formatea una fecha a formato corto
 * @param {string} fecha - Fecha en formato ISO o string
 * @returns {string} Fecha formateada (DD/MM/YYYY)
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  
  const date = new Date(fecha);
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  
  return date.toLocaleDateString('es-ES', opciones);
};

export const formatearFechaCorta = (fecha) => {
    if (!fecha) return 'N/A';

    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();

    return `${dia}/${mes}/${año}`;
};

/**
 * Formatea un número de teléfono
 * @param {string} telefono - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export const formatearTelefono = (telefono) => {
    if (!telefono) return 'N/A';

    // Eliminar caracteres no numéricos
    const numeros = telefono.replace(/\D/g, '');

    // Formato: XXXX-XXXX
    if (numeros.length === 8) {
        return `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
    }

    return telefono;
};

/**
 * Formatea un DUI
 * @param {string} dui - Número de DUI
 * @returns {string} DUI formateado
 */
export const formatearDUI = (dui) => {
    if (!dui) return 'N/A';

    // Eliminar caracteres no numéricos
    const numeros = dui.replace(/\D/g, '');

    // Formato: XXXXXXXX-X
    if (numeros.length === 9) {
        return `${numeros.slice(0, 8)}-${numeros.slice(8)}`;
    }

    return dui;
};