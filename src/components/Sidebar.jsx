import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import LogoTitle from "./LogoTitle";
import { X } from "lucide-react";

/**
 * Componente Sidebar que muestra un menú lateral con opciones de navegación en dispositivos móviles.
 *
 * @param {{ open: boolean; onClose: () => void; isLoggedIn: boolean; onLogout: () => void; }} param0
 * @param {boolean} param0.open
 * @param {() => void} param0.onClose
 * @param {boolean} param0.isLoggedIn
 * @param {() => void} param0.onLogout
 * @returns {JSX.Element}
 * @author Ángel Aragón
 */
const Sidebar = ({ open, onClose, isLoggedIn, onLogout }) => {
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
              <Link to="/profile" data-testid="profile-link" onClick={onClose}>
                <Button
                  className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
                  data-testid="profile-button"
                >
                  Mi Perfil
                </Button>
              </Link>
              <Link to="/" data-testid="logout-link" onClick={onClose}>
                <Button
                  className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
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
                  className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
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
                  className="bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-accent-dark transition-colors duration-200"
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
