import { generarPDFCupon, obtenerBlob, abrirEnNuevaPestaña, previsualizarPDF } from '../../utils/pdfGenerator';

export const CuponPDF = () => {
  return {
    generarPDF: generarPDFCupon,
    descargarPDF: generarPDFCupon,
    obtenerBlob: obtenerBlob,
    abrirEnNuevaPestaña: abrirEnNuevaPestaña,
    previsualizarPDF: previsualizarPDF
  };
};
