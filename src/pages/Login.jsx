/**
 * @file Login.jsx
 * @description Página de inicio de sesión (Login) para usuarios registrados.
 * Permite al usuario introducir su correo electrónico y contraseña, y simula
 * la autenticación redirigiendo al home.
 *
 * Componentes utilizados:
 * - Input: Campo reutilizable con icono (correo y contraseña)
 * - Button: Botón reutilizable para enviar el formulario
 * - Icons: Mail y Lock (de Lucide React)
 *
 * Navegación:
 * - Al hacer clic en "Iniciar sesión" se redirige al home (`/`)
 * - Enlace para redirigir a la página de registro (`/signup`)
 *
 * @module pages/Login
 */

import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Mail, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getToken } from "../services/authService";
import SuccessMsg from "../components/SuccessMsg";

/**
 * Página de inicio de sesión para acceder a la app.
 * Contiene imagen decorativa, formulario con campos de email y contraseña,
 * y un botón para simular login.
 *
 * @returns {JSX.Element} Vista de login
 * @modifiedby Ángel Aragón
 * @modified Arreglado componente Button
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg] = useState(location.state?.successMsg || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/token/", {
        username: username,
        password: password,
      });

      const { access, refresh } = response.data;

      // Guarda en localStorage
      localStorage.setItem("cookflow_accessToken", access);
      localStorage.setItem("cookflow_refreshToken", refresh);

      console.log("✅ Token guardado:", getToken());

      navigate("/main");
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      alert("Credenciales inválidas");
    }
  };

  return (
    <div
      className="min-h-screen flex bg-[#FDF3E8]"
      data-testid="login-page"
      id="login-page"
    >
      <div
        className="hidden md:block w-1/2"
        data-testid="login-image-container"
        id="login-image-container"
      >
        <img
          src="/login.png"
          alt="Login Illustration"
          className="h-full w-full object-cover"
          data-testid="login-image"
          id="login-image"
        />
      </div>

      <div
        className="w-full md:w-1/2 flex justify-center items-start pt-20"
        data-testid="login-form-container"
        id="login-form-container"
      >
        <div
          className="w-[320px] flex flex-col items-center px-4"
          data-testid="login-form"
          id="login-form"
        >
          <h2
            className="text-3xl font-bold mb-2 text-black whitespace-nowrap"
            data-testid="login-title"
            id="login-title"
          >
            ¡Bienvenido de nuevo!
          </h2>
          {successMsg && <SuccessMsg>{successMsg}</SuccessMsg>}
          <h4
            className="text-sm mb-12 text-black"
            data-testid="login-subtitle"
            id="login-subtitle"
          >
            Introduce tu información
          </h4>

          <div
            className="flex flex-col mb-4 w-full"
            data-testid="email-input-group"
            id="email-input-group"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="email-input"
            >
              Correo electrónico o nombre de usuario
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Correo electrónico"
                type="email"
                icon={Mail}
                id="email-input"
                data-testid="email-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div
            className="flex flex-col mb-12 w-full"
            data-testid="password-input-group"
            id="password-input-group"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="password-input"
            >
              Contraseña
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Contraseña"
                type="password"
                icon={Lock}
                id="password-input"
                data-testid="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div data-testid="login-button-container" id="login-button-container">
            <Button
              onClick={handleLogin}
              className="mb-3 w-40 py-2 rounded-xl"
              data-testid="login-button"
              id="login-button"
            >
              Iniciar sesión
            </Button>
          </div>

          <h4
            className="text-xs mb-12 text-black"
            data-testid="signup-redirect-text"
            id="signup-redirect-text"
          >
            ¿No tienes cuenta? Regístrate aquí:{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline"
              data-testid="signup-link"
              id="signup-link"
            >
              Sign Up
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Login;
