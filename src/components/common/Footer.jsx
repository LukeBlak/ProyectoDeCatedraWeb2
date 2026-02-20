import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-sky-500 via-sky-600 to-emerald-500 text-white">
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/icons/cupon.png"
                alt="La Cuponera"
                className="w-8 h-8"
              />
              <h3 className="text-xl font-bold">LA CUPONERA</h3>
            </div>

            <p className="text-sky-100 text-sm mb-4">
              Los mejores descuentos en restaurantes, spas, entretenimiento y más.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <img src="../icons/facebook.png" alt="Facebook" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <img src="/icons/social.png" alt="Instagram" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <img src="/icons/gorjeo.png" alt="Twitter" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sky-100">
              <li><Link to="/ofertas" className="hover:text-white">Ver Ofertas</Link></li>
              <li><Link to="/mis-cupones" className="hover:text-white">Mis Cupones</Link></li>
              <li><Link to="/como-funciona" className="hover:text-white">¿Cómo Funciona?</Link></li>
              <li><Link to="/empresas" className="hover:text-white">Para Empresas</Link></li>
            </ul>
          </div>

          {/* Columna 3: Categorías */}
          <div>
            <h4 className="font-bold text-lg mb-4">Categorías</h4>
            <ul className="space-y-2 text-sky-100">
              <li><Link to="/restaurantes" className="hover:text-white">Restaurantes</Link></li>
              <li><Link to="/belleza" className="hover:text-white">Belleza & Spa</Link></li>
              <li><Link to="/entretenimiento" className="hover:text-white">Entretenimiento</Link></li>
              <li><Link to="/fitness" className="hover:text-white">Fitness</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contáctanos</h4>
            <ul className="space-y-3 text-sky-100 text-sm">
              <li className="flex gap-2 items-center">
                <img src="/icons/centro-de-llamadas.png" alt="" className="w-4 h-4" />
                soporte@lacuponera.com
              </li>
              <li className="flex gap-2 items-center">
                <img src="/icons/telefono-movil.png" alt="" className="w-4 h-4" />
                +503 2222-3333
              </li>
              <li className="flex gap-2 items-center">
                <img src="/icons/el-salvador.png" alt="" className="w-4 h-4" />
                San Salvador, El Salvador
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-sky-100">
          <p>© 2026 La Cuponera. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/terminos" className="hover:text-white">Términos y Condiciones</Link>
            <Link to="/privacidad" className="hover:text-white">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};