import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import LogoTitle from "./LogoTitle";
import { isTokenValid, logout } from "../services/authService";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

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
 *
 * @modifiedby Ángel Aragón
 * @modified Añadido Sidebar para navegación móvil y logout.
 */

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(isTokenValid());
    checkLogin();
    window.addEventListener("storage", checkLogin);
    window.addEventListener("authchange", checkLogin);
    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("authchange", checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-background px-4 py-3 flex justify-between items-center mx-auto max-w-6xl md:max-w-full">
        <LogoTitle />
        <div className="md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-accent focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu size={32} />
          </button>
        </div>
        <nav className="hidden md:flex gap-4 items-center">
          {isLoggedIn ? (
            <>
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
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </header>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
