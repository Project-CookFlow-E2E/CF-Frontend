import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import Button from "./Button";
import { isTokenValid } from "../services/authService";
import {useAuthStore } from "../store/useAuthStore";

const LogoTitle = () =>{
    const isLoggedIn = isTokenValid();
    return (   
  <Link to={isLoggedIn ? "/main" : "/"} className="flex items-center gap-3" data-testid="logo-title-link">
    <img src={logo} alt="CookFlow Logo" width={35} height={35} data-testid="logo-image" />
    <h1 className="text-xl font-mate" data-testid="logo-title">
      <span className="text-3xl">C</span>OOK
      <span className="text-3xl">F</span>LOW
    </h1>
  </Link>
)};


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

const Header = () => {
   const isLoggedIn = useAuthStore.isAuthenticated;
  return (
     <header className="bg-background px-4 py-3" data-testid="header">
      <div className="flex justify-between items-center mx-auto max-w-6xl">
        <LogoTitle />
        {isLoggedIn ? (
          <Link to="/profile" data-testid="profile-link">
            <Button
              className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
              data-testid="profile-button"
            >
              Mi Perfil
            </Button>
          </Link>
        ) : (
        <div className="flex gap-4">
            <Link to="/login" data-testid="login-link">
              <Button
                className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
                data-testid="login-button"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register" data-testid="register-link">
              <Button
                className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
                data-testid="register-button"
              >
                Registrarse
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;