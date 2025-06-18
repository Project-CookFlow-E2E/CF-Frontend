import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import LogoTitle from "./LogoTitle";
import { isTokenValid, logout, getToken } from "../services/authService";
import { Menu, Shield } from "lucide-react";
import Sidebar from "./Sidebar";

/**
 * Header es el encabezado principal de la aplicación.
 *
 * Muestra contenido diferente según el estado de autenticación:
 * - Si el usuario está logueado (`isLoggedIn`), se muestra el logo con un enlace al perfil.
 * - Si no lo está, se muestran botones para iniciar sesión o registrarse.
 * - Si el usuario es administrador (según el JWT), se muestra un botón con icono de escudo y texto "Admin" que enlaza al panel de administración (`/admin-dashboard`).
 *
 * El botón de administrador solo es visible si el token JWT contiene alguno de los siguientes campos:
 *   - `is_staff: true`
 *   - `is_admin: true`
 *   - `role: "admin"`
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {boolean} [props.isLoggedIn=true] - Indica si el usuario ha iniciado sesión.
 * @returns {JSX.Element} Encabezado dinámico de la aplicación.
 *
 * @modifiedby Ángel Aragón
 * @modified Añadido Sidebar para navegación móvil y logout.
 * @modified Añadido botón de acceso al panel de administración visible solo para administradores.
 * @modifiedby Noemi Casaprima
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

  const isAdmin = () => {
    try {
      const token = getToken();
      if (!token) return false;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.is_staff || payload.is_admin;
    } catch {
      return false;
    }
  };

  return (
    <>
      <header className="bg-background px-10 pt-6 py-3 flex justify-between items-center mx-auto max-w-6xl md:max-w-full">
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
              {isAdmin() && (
                <Link
                  to="/admin-dashboard"
                  data-testid="admin-dashboard-link"
                  title="Panel de administración"
                >
                  <Button
                    className="bg-accent text-white px-3 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200 flex items-center"
                    ariaLabel="Panel de administración"
                  >
                    <Shield size={20} className="mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
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
