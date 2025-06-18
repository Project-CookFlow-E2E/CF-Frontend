import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import LogoTitle from "./LogoTitle";
import { X, Shield } from "lucide-react";
import { getToken } from "../services/authService";

/**
 * Componente Sidebar que muestra un menú lateral con opciones de navegación en dispositivos móviles.
 *
 * Características:
 * - Muestra enlaces de navegación según el estado de autenticación del usuario.
 * - Si el usuario está logueado (`isLoggedIn`), muestra enlaces a perfil y cerrar sesión.
 * - Si el usuario es administrador (según el JWT), muestra un botón con icono de escudo y texto "Administrador" que enlaza al panel de administración (`/admin-dashboard`).
 *   El botón de administrador solo es visible si el token JWT contiene alguno de los siguientes campos:
 *     - `is_staff: true`
 *     - `is_admin: true`
 *     - `role: "admin"`
 * - Si el usuario no está logueado, muestra enlaces para iniciar sesión y registrarse.
 *
 * @param {{ open: boolean; onClose: () => void; isLoggedIn: boolean; onLogout: () => void; }} param0
 * @param {boolean} param0.open
 * @param {() => void} param0.onClose
 * @param {boolean} param0.isLoggedIn
 * @param {() => void} param0.onLogout
 * @returns {JSX.Element}
 * @author Ángel Aragón
 * @modifiedby Noemi Casaprima
 * @modified Añadido botón de acceso al panel de administración visible solo para administradores.
 */
const Sidebar = ({ open, onClose, isLoggedIn, onLogout }) => {
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
    <div
      className={`fixed inset-0 z-50 flex transition-colors duration-300 ${
        open
          ? "bg-black/80 pointer-events-auto"
          : "bg-black/0 pointer-events-none"
      }`}
      style={{ transitionProperty: "background-color" }}
      aria-hidden={!open}
    >
      <aside
        className={`
          bg-background w-64 h-full shadow-lg flex flex-col p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ willChange: "transform" }}
      >
        <div className="flex justify-between items-center mb-8">
          <LogoTitle />
          <button
            onClick={onClose}
            className="text-accent focus:outline-none"
            aria-label="Cerrar menú"
          >
            <X size={32} />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {isLoggedIn ? (
            <>
              {isAdmin() && (
                <Link
                  to="/admin-dashboard"
                  data-testid="admin-dashboard-link"
                  title="Panel de administración"
                  onClick={onClose}
                >
                  <Button
                    className="w-full bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200 flex items-center justify-center"
                    ariaLabel="Panel de administración"
                  >
                    <Shield size={20} className="mr-2" />
                    Administrador
                  </Button>
                </Link>
              )}
              <Link to="/profile" data-testid="profile-link" onClick={onClose}>
                <Button
                  className="w-full bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200 flex items-center justify-center"
                  data-testid="profile-button"
                >
                  Mi Perfil
                </Button>
              </Link>
              <Link to="/" data-testid="logout-link" onClick={onClose}>
                <Button
                  className="w-full bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200 flex items-center justify-center"
                  data-testid="logout-button"
                  onClick={onLogout}
                >
                  Cerrar Sesión
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" data-testid="login-link" onClick={onClose}>
                <Button
                  className="w-full bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200 flex items-center justify-center"
                  data-testid="login-button"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link
                to="/register"
                data-testid="register-link"
                onClick={onClose}
              >
                <Button
                  className="w-full bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200 flex items-center justify-center"
                  data-testid="register-button"
                >
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </nav>
      </aside>
      <div
        className="flex-1"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
};

export default Sidebar;
