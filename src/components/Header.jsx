import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import LogoTitle from "./LogoTitle";
import { isTokenValid, logout } from "../services/authService";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(isTokenValid());
    checkLogin();

    window.addEventListener("storage", checkLogin);
    window.addEventListener("authchange", checkLogin); // Escucha cambios locales

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("authchange", checkLogin);
    };
  }, []);
  return (
    <header className="bg-background px-4 py-3" data-testid="header">
      <div className="flex justify-between items-center mx-auto max-w-6xl">
        <LogoTitle />
        {isLoggedIn ? (
          <div className="flex gap-4">
            <Link to="/profile" data-testid="profile-link">
              <Button
                className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
                data-testid="profile-button"
              >
                Mi Perfil
              </Button>
            </Link>
            <Link to="/" data-testid="logout-link">
              <Button
                className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
                data-testid="logout-button"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            </Link>
          </div>
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
