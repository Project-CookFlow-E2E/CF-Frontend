import React from "react";
import logo from "../assets/logo.svg";
import { Link } from 'react-router-dom'; 
import Button from "./Button";

/**
 * Header es el encabezado principal de la aplicación.
 *
 * Muestra contenido diferente según el estado de autenticación:
 * - Si el usuario está logueado (`isLoggedIn`), se muestra el logo con un enlace al perfil.
 * - Si no lo está, se muestran botones para iniciar sesión o registrarse.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {boolean} [props.isLoggedIn=true] - Indica si el usuario ha iniciado sesión.
 * @returns {JSX.Element} Encabezado dinámico de la aplicación.
 */
const Header = ({ isLoggedIn = true }) => {
  return (
    <header className="bg-background px-4 py-3">
      {isLoggedIn ? (
        <div className="flex justify-between items-center mx-auto max-w-6xl">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" width={35} height={35} />
            <h1 className="text-xl font-mate">
              <span className="text-3xl">C</span>OOK
              <span className="text-3xl">F</span>LOW
            </h1>
          </Link>

          <Link to="/profile">
            <Button>Mi Perfil</Button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" width={35} height={35} />
            <h1 className="hidden md:block text-xl font-mate">
              <span className="text-3xl">C</span>OOK<span className="text-3xl">F</span>LOW
            </h1>
          </div>
          <ul className="flex gap-5 items-center">
            <li>
              <button className="text-accent bg-white px-3 py-1.5 rounded-full">
                Iniciar Sesión
              </button>
            </li>
            <li>
              <button className="px-3 py-1.5 bg-accent text-white rounded-full cursor-pointer hover:bg-gray-500 transition-colors duration-300">
                Registrarse
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
