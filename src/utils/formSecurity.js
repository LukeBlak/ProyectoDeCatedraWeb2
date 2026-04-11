const UNSAFE_PATTERNS = [
  /<\s*script/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<\/?[a-z][\s\S]*>/gi,
];

const ONLY_LETTERS_SPACES = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g;
const EMAIL_ALLOWED = /[^a-zA-Z0-9@._+-]/g;
const PHONE_ALLOWED = /[^0-9-]/g;
const DUI_ALLOWED = /[^0-9-]/g;
const ADDRESS_ALLOWED = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,#-]/g;
const TEXT_ALLOWED = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,:;!?()"'/-]/g;
const URL_ALLOWED = /[^a-zA-Z0-9:/?#[\]@!$&'()*+,;=._~-]/g;

const normalizeSpaces = (value) => String(value || '').replace(/\s{2,}/g, ' ');

export const hasUnsafeContent = (value) => {
  const content = String(value || '');
  return UNSAFE_PATTERNS.some((pattern) => pattern.test(content));
};

export const sanitizeByField = (name, value) => {
  const raw = String(value ?? '');

  switch (name) {
    case 'nombres':
    case 'apellidos':
    case 'nombreEmpresa':
    case 'nombreContacto':
      return normalizeSpaces(raw.replace(ONLY_LETTERS_SPACES, ''));

    case 'email':
    case 'emailEmpresa':
      return raw.replace(EMAIL_ALLOWED, '').replace(/\s/g, '');

    case 'telefono':
    case 'telefonoContacto':
      return raw.replace(PHONE_ALLOWED, '').slice(0, 9);

    case 'dui':
      return raw.replace(DUI_ALLOWED, '').slice(0, 10);

    case 'direccion':
      return normalizeSpaces(raw.replace(ADDRESS_ALLOWED, ''));

    case 'rubro':
    case 'rubroEmpresa':
      return raw.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

    case 'titulo':
    case 'descripcion':
      return normalizeSpaces(raw.replace(TEXT_ALLOWED, ''));

    case 'imagen':
      return raw.replace(URL_ALLOWED, '');

    default:
      return raw;
  }
};

export const validateField = (name, value) => {
  const text = String(value ?? '').trim();

  if (name !== 'password' && name !== 'nuevaPassword' && name !== 'confirmarPassword' && hasUnsafeContent(text)) {
    return 'Se detectaron caracteres o patrones no permitidos.';
  }

  switch (name) {
    case 'nombres':
    case 'apellidos':
    case 'nombreEmpresa':
    case 'nombreContacto':
      if (!text) return 'Este campo es obligatorio.';
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,}$/.test(text)) {
        return 'Solo se permiten letras y espacios.';
      }
      return '';

    case 'email':
    case 'emailEmpresa':
      if (!text) return 'El correo es obligatorio.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        return 'Correo electrónico no válido.';
      }
      return '';

    case 'telefono':
    case 'telefonoContacto':
      if (!text) return 'El teléfono es obligatorio.';
      if (!/^\d{4}-?\d{4}$/.test(text)) {
        return 'Formato de teléfono inválido. Usa 7777-7777 o 77777777.';
      }
      return '';

    case 'dui':
      if (!text) return 'El DUI es obligatorio.';
      if (!/^\d{8}-\d$/.test(text)) {
        return 'Formato de DUI inválido. Usa 12345678-9.';
      }
      return '';

    case 'direccion':
      if (!text) return '';
      if (text.length < 4) return 'La dirección es demasiado corta.';
      return '';

    case 'rubro':
    case 'rubroEmpresa':
      if (!text) return 'Debes seleccionar un rubro.';
      if (!/^[a-z0-9-]{3,}$/.test(text)) return 'Rubro no válido.';
      return '';

    case 'imagen':
      if (!text) return '';
      if (!/^https?:\/\//i.test(text)) return 'La URL debe iniciar con http:// o https://.';
      return '';

    case 'titulo':
      if (!text || text.length < 3) return 'El título debe tener al menos 3 caracteres.';
      return '';

    case 'descripcion':
      if (!text || text.length < 10) return 'La descripción debe tener al menos 10 caracteres.';
      return '';

    case 'password':
    case 'nuevaPassword':
      if (!text || text.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
      return '';

    case 'confirmarPassword':
      if (!text) return 'Debes confirmar la contraseña.';
      if (text.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
      return '';

    default:
      return '';
  }
};

export const validateFormFields = (formData, fields) => {
  const errors = {};

  fields.forEach((field) => {
    const message = validateField(field, formData[field]);
    if (message) {
      errors[field] = message;
    }
  });

  return errors;
};
