import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import Button from "./Button";

const LogoTitle = () => (
  <Link to="/" className="flex items-center gap-3" data-testid="logo-title-link">
    <img src={logo} alt="CookFlow Logo" width={35} height={35} data-testid="logo-image" />
    <h1 className="text-xl font-mate" data-testid="logo-title">
      <span className="text-3xl">C</span>OOK
      <span className="text-3xl">F</span>LOW
    </h1>
  </Link>
);

const Header = ({ isLoggedIn = true }) => {
  return (
    <header className="bg-background px-4 py-3" data-testid="header">
      {isLoggedIn ? (
        <div
          className="flex justify-between items-center mx-auto max-w-6xl"
          data-testid="logged-in-header"
        >
          <LogoTitle />
          <Link to="/profile" data-testid="profile-link">
            <Button data-testid="profile-button">Mi Perfil</Button>
          </Link>
        </div>
      ) : (
        <div
          className="flex justify-between items-center max-w-screen-2xl mx-auto"
          data-testid="logged-out-header"
        >
          <div className="flex items-center gap-3" data-testid="logo-container">
            <img src={logo} alt="CookFlow Logo" width={35} height={35} data-testid="logo-image" />
            <h1 className="hidden md:block text-xl font-mate" data-testid="logo-title">
              <span className="text-3xl">C</span>OOK
              <span className="text-3xl">F</span>LOW
            </h1>
          </div>
          <ul className="flex gap-5 items-center" data-testid="auth-buttons">
            <li>
              <Link to="/login" data-testid="login-link">
                <Button
                  className="bg-white text-accent px-3 py-1.5 rounded-full hover:bg-gray-100"
                  data-testid="login-button"
                >
                  Iniciar Sesion
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/register" data-testid="register-link">
                <Button
                  className="bg-accent text-white px-3 py-1.5 rounded-full hover:bg-gray-500 transition-colors duration-300"
                  data-testid="register-button"
                >
                  Registrarse
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
