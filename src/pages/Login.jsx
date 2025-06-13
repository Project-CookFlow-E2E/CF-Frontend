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
import { useForm } from "react-hook-form";
import { login, getToken } from "../services/authService";
import SuccessMsg from "../components/SuccessMsg";

/**
 * Página de inicio de sesión para acceder a la app.
 * Contiene imagen decorativa, formulario con campos de email y contraseña,
 * y un botón para simular login.
 *
 * @returns {JSX.Element} Vista de login
 * @modifiedby Ángel Aragón
 * @modified Arreglado componente Button, añadido SuccessMsg, usamos login de authService para manejar el inicio de sesión.
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = React.useState("");
  const [successMsg] = React.useState(location.state?.successMsg || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await login(data.username, data.password);
      console.log("✅ Token guardado:", getToken());
      //navigate("/main");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setApiError("Credenciales inválidas");
      setError("username", { type: "manual", message: " " });
      setError("password", { type: "manual", message: " " });
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
        <form
          className="w-[320px] flex flex-col items-center px-4"
          data-testid="login-form"
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
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

          {apiError && (
            <div
              className="text-red-500 text-sm mb-4"
              data-testid="login-api-error"
            >
              {apiError}
            </div>
          )}

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
                type="text"
                icon={Mail}
                id="email-input"
                data-testid="email-input"
                {...register("username", {
                  required: "Este campo es obligatorio",
                })}
                error={errors.username?.message}
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
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
                error={errors.password?.message}
              />
            </div>
          </div>

          <div data-testid="login-button-container" id="login-button-container">
            <Button
              type="submit"
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
        </form>
      </div>
    </div>
  );
};

export default Login;
