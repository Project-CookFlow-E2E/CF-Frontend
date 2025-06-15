/**
 * @file LogoTitle.jsx
 * @description Componente visual del logo y nombre de la app CookFlow. Redirige a la página principal correspondiente
 * dependiendo de si el usuario está autenticado.
 *
 * Utiliza el hook `useLocation` para detectar cambios en la ruta y comprobar la validez del token con `isTokenValid`.
 * Si el usuario está logueado, el logo redirige a `/main`; si no, a `/`.
 *
 * @component
 * @returns {JSX.Element} Enlace con logo e identificador visual de la app CookFlow.
 *
 * @author Ana Castro
 */



import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { isTokenValid } from "../services/authService";

const LogoTitle = () => {
  const location = useLocation(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isTokenValid());
  }, [location]); 
  return (
    <Link
      to={isLoggedIn ? "/main" : "/"}
      className="flex items-center gap-3"
      data-testid="logo-title-link"
    >
      <img
        src={logo}
        alt="CookFlow Logo"
        width={35}
        height={35}
        data-testid="logo-image"
      />
      <h1 className="text-xl font-mate" data-testid="logo-title">
        <span className="text-3xl">C</span>OOK
        <span className="text-3xl">F</span>LOW
      </h1>
    </Link>
  );
};

export default LogoTitle;
