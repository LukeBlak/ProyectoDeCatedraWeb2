
export const useAuth = () => {
  // Usuario de prueba hardcodeado
  const user = {
    id: 1,
    nombres: 'Juan',
    apellidos: 'Pérez',
    email: 'juan@example.com',
    dui: '12345678-9'
  };

  return { user };
};