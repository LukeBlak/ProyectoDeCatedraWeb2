// src/utils/pdfGenerator.js

import jsPDF from 'jspdf';
import { formatearFecha, formatearPrecio } from './formatters';

/**
 * Genera un PDF para un cupón específico
 * @param {Object} cupon - Objeto con los datos del cupón
 * @returns {Promise<jsPDF>}
 */
export const generarPDFCupon = async (cupon) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configuración de colores
    const COLORES = {
      primario: [41, 128, 185],
      secundario: [52, 152, 219],
      exito: [39, 174, 96],
      alerta: [230, 126, 34],
      peligro: [231, 76, 60],
      gris: [149, 165, 166],
      blanco: [255, 255, 255],
      negro: [0, 0, 0]
    };

    // Calcular descuento
    const descuento = calcularDescuento(cupon);

    // Construir PDF - cada función retorna la nueva posición Y
    dibujarHeader(doc, COLORES, descuento.porcentaje);
    let currentY = dibujarInfoOferta(doc, cupon, COLORES, 60);
    currentY = dibujarPrecios(doc, cupon, descuento, COLORES, currentY);
    currentY = dibujarCodigoCupon(doc, cupon, COLORES, currentY);
    currentY = dibujarFechas(doc, cupon, COLORES, currentY);
    currentY = dibujarDescripcion(doc, cupon, currentY);
    currentY = dibujarTerminos(doc, cupon, currentY);
    currentY = dibujarInfoComprador(doc, cupon, currentY);
    dibujarInstrucciones(doc, cupon, currentY);
    dibujarFooter(doc);

    // Descargar PDF
    doc.save(`cupon-${cupon.codigo}.pdf`);
    
    return doc;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw new Error('No se pudo generar el PDF del cupón');
  }
};

/**
 * Genera un Blob del PDF (útil para enviar por correo o almacenar)
 * @param {Object} cupon - Objeto con los datos del cupón
 * @returns {Promise<Blob>}
 */
export const obtenerBlob = async (cupon) => {
  const doc = await generarPDFCupon(cupon);
  return doc.output('blob');
};

/**
 * Abre el PDF en una nueva pestaña
 * @param {Object} cupon - Objeto con los datos del cupón
 */
export const abrirEnNuevaPestaña = async (cupon) => {
  const doc = await generarPDFCupon(cupon);
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
};

/**
 * Genera una vista previa del PDF
 * @param {Object} cupon - Objeto con los datos del cupón
 * @returns {Promise<string>} Data URI del PDF
 */
export const previsualizarPDF = async (cupon) => {
  const doc = await generarPDFCupon(cupon);
  return doc.output('dataurlstring');
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Calcula el descuento del cupón
 */
const calcularDescuento = (cupon) => {
  const monto = cupon.precioRegular - cupon.precioOferta;
  const porcentaje = Math.round((monto / cupon.precioRegular) * 100);
  return { monto, porcentaje };
};

/**
 * Dibuja el header del PDF
 */
const dibujarHeader = (doc, COLORES, porcentaje) => {
  // Fondo del header
  doc.setFillColor(...COLORES.primario);
  doc.rect(0, 0, 210, 40, 'F');

  // Título principal
  doc.setTextColor(...COLORES.blanco);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CUPÓN DE DESCUENTO', 105, 15, { align: 'center' });

  // Subtítulo
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('La Cuponera - Ahorra más, vive mejor', 105, 25, { align: 'center' });

  // Badge de descuento
  doc.setFillColor(...COLORES.alerta);
  doc.roundedRect(75, 30, 60, 15, 3, 3, 'F');
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${porcentaje}% OFF`, 105, 40, { align: 'center' });
};

/**
 * Dibuja la información de la oferta
 */
const dibujarInfoOferta = (doc, cupon, COLORES, y) => {
  // Título de la oferta
  doc.setTextColor(...COLORES.negro);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const tituloLineas = doc.splitTextToSize(cupon.tituloOferta || 'Oferta Especial', 180);
  doc.text(tituloLineas, 105, y, { align: 'center' });
  y += tituloLineas.length * 7 + 5;

  // Empresa ofertante
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORES.gris);
  doc.text(cupon.empresaOfertante || cupon.empresa || 'Establecimiento', 105, y, { align: 'center' });
  
  return y + 15;
};

/**
 * Dibuja la sección de precios
 */
const dibujarPrecios = (doc, cupon, descuento, COLORES, y) => {
  // Caja de precios
  doc.setFillColor(240, 248, 255);
  doc.setDrawColor(...COLORES.secundario);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, y, 170, 35, 3, 3, 'FD');

  // Precio regular (tachado)
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Precio Regular:', 30, y + 10);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const precioRegularTexto = formatearPrecio(cupon.precioRegular);
  doc.text(precioRegularTexto, 30, y + 20);
  
  // Línea tachada
  const anchoTexto = doc.getTextWidth(precioRegularTexto);
  doc.setDrawColor(150, 150, 150);
  doc.line(30, y + 18, 30 + anchoTexto, y + 18);

  // Precio con descuento
  doc.setTextColor(...COLORES.exito);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Precio con Cupón:', 120, y + 10);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(formatearPrecio(cupon.precioOferta), 120, y + 22);

  // Ahorro
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`¡Ahorras ${formatearPrecio(descuento.monto)}!`, 105, y + 32, { align: 'center' });

  return y + 45;
};

/**
 * Dibuja el código del cupón
 */
const dibujarCodigoCupon = (doc, cupon, COLORES, y) => {
  // Caja con borde punteado
  doc.setFillColor(...COLORES.blanco);
  doc.setDrawColor(...COLORES.negro);
  doc.setLineWidth(2);
  doc.setLineDash([5, 3]);
  doc.roundedRect(30, y, 150, 25, 3, 3, 'FD');
  doc.setLineDash([]);

  // Etiqueta
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('CÓDIGO DEL CUPÓN', 105, y + 8, { align: 'center' });

  // Código
  doc.setTextColor(...COLORES.negro);
  doc.setFontSize(18);
  doc.setFont('courier', 'bold');
  doc.text(cupon.codigo, 105, y + 18, { align: 'center' });

  return y + 35;
};

/**
 * Dibuja la sección de fechas
 */
const dibujarFechas = (doc, cupon, COLORES, y) => {
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(20, y, 170, 25, 'FD');

  doc.setTextColor(...COLORES.negro);
  doc.setFontSize(10);

  // Fecha de compra
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de Compra:', 30, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(formatearFecha(cupon.fechaCompra), 30, y + 15);

  // Válido hasta
  doc.setFont('helvetica', 'bold');
  doc.text('Válido Hasta:', 120, y + 8);
  doc.setFont('helvetica', 'normal');
  
  const estaVencido = new Date(cupon.fechaLimiteUso) <= new Date();
  if (estaVencido) {
    doc.setTextColor(...COLORES.peligro);
  }
  doc.text(formatearFecha(cupon.fechaLimiteUso), 120, y + 15);
  doc.setTextColor(...COLORES.negro);

  return y + 35;
};

/**
 * Dibuja la descripción de la oferta
 */
const dibujarDescripcion = (doc, cupon, y) => {
  if (!cupon.descripcion) return y;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción:', 20, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const descripcionLineas = doc.splitTextToSize(cupon.descripcion, 170);
  doc.text(descripcionLineas, 20, y);
  
  return y + descripcionLineas.length * 5 + 8;
};

/**
 * Dibuja términos y condiciones
 */
const dibujarTerminos = (doc, cupon, y) => {
  if (!cupon.otrosDetalles) return y;

  const terminosLineas = doc.splitTextToSize(cupon.otrosDetalles, 160);
  const alturaTerminos = terminosLineas.length * 4.5 + 12;

  doc.setFillColor(255, 250, 230);
  doc.setDrawColor(255, 193, 7);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, y, 170, alturaTerminos, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('⚠️ Términos y Condiciones:', 25, y + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(terminosLineas, 25, y + 12);

  return y + alturaTerminos + 8;
};

/**
 * Dibuja información del comprador
 */
const dibujarInfoComprador = (doc, cupon, y) => {
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, 170, 20, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Comprador:', 30, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(cupon.nombreCliente || 'Cliente', 30, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('DUI:', 120, y + 7);
  doc.setFont('courier', 'normal');
  doc.text(cupon.dui || 'N/A', 120, y + 12);

  return y + 28;
};

/**
 * Dibuja instrucciones de uso
 */
const dibujarInstrucciones = (doc, cupon, y) => {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 Cómo usar tu cupón:', 20, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const instrucciones = [
    '1. Presenta este cupón impreso o en formato digital',
    `2. Dirígete a ${cupon.empresaOfertante || 'el establecimiento'}`,
    '3. Muestra tu DUI para verificación',
    '4. El establecimiento validará el código del cupón',
    '5. ¡Disfruta tu descuento!'
  ];

  instrucciones.forEach((instruccion, index) => {
    doc.text(instruccion, 25, y + (index * 5));
  });

  return y + 30;
};

/**
 * Dibuja el footer del PDF
 */
const dibujarFooter = (doc) => {
  // Línea separadora
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 280, 190, 280);

  // Texto del footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Este cupón es válido únicamente para el titular identificado con el DUI especificado.',
    105,
    285,
    { align: 'center' }
  );
  doc.text(
    'La Cuponera - www.lacuponera.com - Soporte: soporte@lacuponera.com',
    105,
    290,
    { align: 'center' }
  );
};

/**
 * Genera múltiples PDFs (útil para compras de varios cupones)
 * @param {Array} cupones - Array de cupones
 */
export const generarPDFsMultiples = async (cupones) => {
  const docs = [];
  
  for (const cupon of cupones) {
    try {
      const doc = await generarPDFCupon(cupon);
      docs.push(doc);
    } catch (error) {
      console.error(`Error al generar PDF para cupón ${cupon.codigo}:`, error);
    }
  }
  
  return docs;
};