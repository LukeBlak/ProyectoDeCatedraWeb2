import { 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Función para hashear contraseñas (simple, en producción se sugiere usar bcrypt)
const hashPassword = (password) => {
  return btoa(password); // Base64 encoding (NO seguro para producción real)
};

// Validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar DUI salvadoreño
const isValidDUI = (dui) => {
  const duiRegex = /^\d{8}-\d$/;
  return duiRegex.test(dui);
};

export const authService = {

  // ==================== REGISTRO ====================
  register: async (userData) => {
    try {
      // Validaciones
      if (!userData.nombres || userData.nombres.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }

      if (!userData.apellidos || userData.apellidos.trim().length < 2) {
        throw new Error('El apellido debe tener al menos 2 caracteres');
      }

      if (!isValidEmail(userData.email)) {
        throw new Error('Correo electrónico inválido');
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (!isValidDUI(userData.dui)) {
        throw new Error('DUI inválido. Formato: 12345678-9');
      }

      if (!userData.telefono || userData.telefono.length < 8) {
        throw new Error('Teléfono inválido');
      }

      // Verificar si el email ya existe
      const emailQuery = query(
        collection(db, 'usuarios'),
        where('email', '==', userData.email.toLowerCase())
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        throw new Error('Este correo ya está registrado');
      }

      // Verificar si el DUI ya existe
      const duiQuery = query(
        collection(db, 'usuarios'),
        where('dui', '==', userData.dui)
      );
      const duiSnapshot = await getDocs(duiQuery);

      if (!duiSnapshot.empty) {
        throw new Error('Este DUI ya está registrado');
      }

      // Crear usuario
      const nuevoUsuario = {
        nombres: userData.nombres.trim(),
        apellidos: userData.apellidos.trim(),
        email: userData.email.toLowerCase().trim(),
        password: hashPassword(userData.password), // Hasheada
        telefono: userData.telefono.trim(),
        direccion: userData.direccion?.trim() || '',
        dui: userData.dui.trim(),
        fechaRegistro: serverTimestamp(),
        ultimoAcceso: serverTimestamp(),
        rol: 'cliente',
        activo: true
      };

      const docRef = await addDoc(collection(db, 'usuarios'), nuevoUsuario);

      // Retornar usuario (sin contraseña)
      const {...usuarioSinPassword } = nuevoUsuario;
      return {
        id: docRef.id,
        ...usuarioSinPassword
      };

    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // ==================== LOGIN ====================
  login: async (email, password) => {
    try {
      // Validaciones básicas
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (!isValidEmail(email)) {
        throw new Error('Correo electrónico o contraseña inválidos. Por favor, cuelva a intentarlo');
      }

      // Buscar usuario por email
      const q = query(
        collection(db, 'usuarios'),
        where('email', '==', email.toLowerCase())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Usuario no encontrado');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verificar si el usuario está activo
      if (!userData.activo) {
        throw new Error('Esta cuenta ha sido deshabilitada');
      }

      // Verificar contraseña
      if (hashPassword(password) !== userData.password) {
        throw new Error('Correo electronico o contraseña invalidos. Por favor vuelva a intentarlo');
      }

      // Actualizar último acceso
      await updateDoc(doc(db, 'usuarios', userDoc.id), {
        ultimoAcceso: serverTimestamp()
      });

      // Retornar usuario (sin contraseña)
      const { password: _, ...usuarioSinPassword } = userData;
      const usuarioFinal = {
        id: userDoc.id, ...usuarioSinPassword
      };

      localStorage.setItem("user", JSON.stringify(usuarioFinal));

      return usuarioFinal;

    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },


  // ==================== VERIFICAR TOKEN Y CAMBIAR CONTRASEÑA ====================
  recuperarPassword: async (email, token, nuevaPassword) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Correo electrónico inválido');
      }

      if (nuevaPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Buscar usuario
      const q = query(
        collection(db, 'usuarios'),
        where('email', '==', email.toLowerCase())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Usuario no encontrado');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verificar token
      if (!userData.tokenRecuperacion) {
        throw new Error('No se ha solicitado recuperación de contraseña');
      }

      if (hashPassword(token) !== userData.tokenRecuperacion) {
        throw new Error('Código de recuperación inválido');
      }

      // Verificar expiración
      if (new Date() > new Date(userData.expiracionToken)) {
        throw new Error('El código de recuperación ha expirado');
      }

      // Cambiar contraseña
      await updateDoc(doc(db, 'usuarios', userDoc.id), {
        password: hashPassword(nuevaPassword),
        tokenRecuperacion: null,
        expiracionToken: null
      });

      return { success: true, message: 'Contraseña actualizada exitosamente' };

    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      throw error;
    }
  },

  // ==================== CAMBIAR CONTRASEÑA (usuario logueado) ====================
  cambiarPassword: async (userId, passwordActual, nuevaPassword) => {
    try {
      if (nuevaPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      // Obtener usuario
      const userDoc = await getDocs(query(
        collection(db, 'usuarios'),
        where('__name__', '==', userId)
      ));

      if (userDoc.empty) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.docs[0].data();

      // Verificar contraseña actual
      if (hashPassword(passwordActual) !== userData.password) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Actualizar contraseña
      await updateDoc(doc(db, 'usuarios', userId), {
        password: hashPassword(nuevaPassword)
      });

      return { success: true, message: 'Contraseña cambiada exitosamente' };

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  },

  // ==================== ACTUALIZAR PERFIL ====================
  actualizarPerfil: async (userId, datosActualizados) => {
    try {
      const datosPermitidos = {};

      if (datosActualizados.nombres) {
        datosPermitidos.nombres = datosActualizados.nombres.trim();
      }
      if (datosActualizados.apellidos) {
        datosPermitidos.apellidos = datosActualizados.apellidos.trim();
      }
      if (datosActualizados.telefono) {
        datosPermitidos.telefono = datosActualizados.telefono.trim();
      }
      if (datosActualizados.direccion) {
        datosPermitidos.direccion = datosActualizados.direccion.trim();
      }

      await updateDoc(doc(db, 'usuarios', userId), datosPermitidos);

      return { success: true, message: 'Perfil actualizado exitosamente' };

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // ================================= LOGOUT ============================

  logout: ()=>{
    localStorage.removeItem("user");
    return{success: true}
  },
};