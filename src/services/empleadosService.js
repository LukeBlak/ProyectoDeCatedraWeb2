import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { sanitizeByField, validateFormFields, hasUnsafeContent } from '../utils/formSecurity';

const hashPassword = (password) => btoa(password);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDUI = (dui) => /^\d{8}-\d$/.test(dui);
const isValidPhone = (telefono) => /^\d{4}-?\d{4}$/.test(telefono);

export const empleadosService = {
  crearEmpleado: async (empleadoData) => {
    const cleanData = {
      ...empleadoData,
      nombres: sanitizeByField('nombres', empleadoData.nombres).trim(),
      apellidos: sanitizeByField('apellidos', empleadoData.apellidos).trim(),
      email: sanitizeByField('email', empleadoData.email).toLowerCase().trim(),
      telefono: sanitizeByField('telefono', empleadoData.telefono).trim(),
      direccion: sanitizeByField('direccion', empleadoData.direccion).trim(),
      dui: sanitizeByField('dui', empleadoData.dui).trim(),
      password: String(empleadoData.password || '').trim(),
    };

    const validationErrors = validateFormFields(cleanData, [
      'nombres',
      'apellidos',
      'email',
      'password',
      'telefono',
      'dui',
    ]);

    if (!cleanData.direccion) {
      validationErrors.direccion = 'La dirección es obligatoria.';
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new Error(Object.values(validationErrors)[0]);
    }

    if (!isValidEmail(cleanData.email)) {
      throw new Error('Correo electrónico inválido.');
    }

    if (!isValidDUI(cleanData.dui)) {
      throw new Error('DUI inválido. Formato: 12345678-9.');
    }

    if (!isValidPhone(cleanData.telefono)) {
      throw new Error('Formato de teléfono inválido. Usa 7777-7777 o 77777777.');
    }

    if (
      hasUnsafeContent(cleanData.nombres) ||
      hasUnsafeContent(cleanData.apellidos) ||
      hasUnsafeContent(cleanData.direccion)
    ) {
      throw new Error('Se detectaron caracteres no permitidos.');
    }

    const emailQuery = query(
      collection(db, 'usuarios'),
      where('email', '==', cleanData.email)
    );
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      throw new Error('Este correo ya está registrado.');
    }

    const duiQuery = query(
      collection(db, 'usuarios'),
      where('dui', '==', cleanData.dui)
    );
    const duiSnapshot = await getDocs(duiQuery);
    if (!duiSnapshot.empty) {
      throw new Error('Este DUI ya está registrado.');
    }

    const nuevoEmpleado = {
      nombres: cleanData.nombres,
      apellidos: cleanData.apellidos,
      email: cleanData.email,
      password: hashPassword(cleanData.password),
      telefono: cleanData.telefono,
      direccion: cleanData.direccion,
      dui: cleanData.dui,
      rol: 'empleado',
      activo: true,
      fechaRegistro: serverTimestamp(),
      ultimoAcceso: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'usuarios'), nuevoEmpleado);
    const { password, ...empleadoSinPassword } = nuevoEmpleado;
    return {
      id: docRef.id,
      ...empleadoSinPassword,
    };
  },
};
