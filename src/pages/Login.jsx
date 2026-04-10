import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../components/common/Button";
import { sanitizeByField, validateField } from "../utils/formSecurity";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Estado para manejar los datos del formulario
   * @property {string} email - Correo electrónico del usuario
   * @property {string} password - Contraseña del usuario
   */
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Este state es para saber si estamos "cargando" 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se encarga de ir actualizando el formulario en tiempo real mientras se va escribiendo 
  const handleChange = (e) => {
    const { name, value } = e.target; // name = el campo, value = lo que se escribe 
    const sanitizedValue = sanitizeByField(name, value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue })); // actualiza el cambio modificado
    setError("");
  };

  // Se ejecuta al momento de darle al botón de iniciar sesión.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que se recargue la página
    setError(""); // Se quita cualquier error antiguo

    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    setLoading(true);

    try {
      // Si el formulario se llena correctamente envia a la página principal
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      // deja de cargar 
      setLoading(false);
    }
  };

  return (
    // Lo que se muestra en el authLayout
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👋</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Bienvenido!
          </h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email" // valida que el email sea válido
              name="email" // Se llama igual que el form
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="tucorreo@email.com"
              autoComplete="email" //porder autocompletar
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password" // hace que se vean puntos y no las letras para que sea una contraseña
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tu contraseña" 
              autoComplete="current-password"
            />
          </div>

          {/* botónp ara mandar el formulario usando el tipo de botón ya preestablecido */}
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"} {/* si está cargando cambia el nombre del botón */}
          </Button>
        </form>

        {/* Es el link que permite reenviar al formulario de registro en el caso que no tenga cuenta */}
        <p className="text-center text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
