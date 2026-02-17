import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      
      {/* Contenido principal del footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎫</span>
              <h3 className="text-xl font-bold">LA CUPONERA</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Los mejores descuentos en restaurantes, spas, entretenimiento y más.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-purple-600 hover:bg-purple-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                📘
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                📷
              </a>
              <a href="#" className="bg-blue-500 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                🐦
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/ofertas" className="text-gray-400 hover:text-white transition-colors">
                  Ver Ofertas
                </Link>
              </li>
              <li>
                <Link to="/mis-cupones" className="text-gray-400 hover:text-white transition-colors">
                  Mis Cupones
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-gray-400 hover:text-white transition-colors">
                  ¿Cómo Funciona?
                </Link>
              </li>
              <li>
                <Link to="/empresas" className="text-gray-400 hover:text-white transition-colors">
                  Para Empresas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Categorías */}
          <div>
            <h4 className="font-bold text-lg mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurantes" className="text-gray-400 hover:text-white transition-colors">
                  🍽️ Restaurantes
                </Link>
              </li>
              <li>
                <Link to="/belleza" className="text-gray-400 hover:text-white transition-colors">
                  💅 Belleza & Spa
                </Link>
              </li>
              <li>
                <Link to="/entretenimiento" className="text-gray-400 hover:text-white transition-colors">
                  🎭 Entretenimiento
                </Link>
              </li>
              <li>
                <Link to="/fitness" className="text-gray-400 hover:text-white transition-colors">
                  💪 Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contáctanos</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>soporte@lacuponera.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>+503 2222-3333</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>San Salvador, El Salvador</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 La Cuponera. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/terminos" className="text-gray-400 hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};