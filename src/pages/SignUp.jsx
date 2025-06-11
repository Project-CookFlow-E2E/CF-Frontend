/**
 * @file SignUp.jsx
 * @description Página de registro de nuevos usuarios en la aplicación CookFlow.
 *
 * Esta vista permite al usuario crear una cuenta proporcionando los siguientes datos:
 * - Nombre
 * - Primer y segundo apellido
 * - Correo electrónico
 * - Contraseña y confirmación
 *
 * Funcionalidades:
 * - Campos con íconos para mejor experiencia visual.
 * - Navegación hacia la página de login si el usuario ya tiene cuenta.
 * - Diseño responsivo con imagen lateral en pantallas grandes.
 *
 * Componentes utilizados:
 * - Input: campo reutilizable con ícono.
 * - Button: botón estilizado para envío de formulario.
 *
 * Navegación:
 * - Redirecciona a la página principal ("/") al hacer clic en "Crear cuenta".
 * - Enlace hacia la página de inicio de sesión ("/login").
 */

import { Button } from "../components";
import Input from "../components/Input";
import { Mail, Lock, PersonStanding } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const passwordValidation = (value, allValues) => {
  if (!value) return "La contraseña es obligatoria";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  if (/^\d+$/.test(value)) return "La contraseña no puede ser solo números";
  const lower = value.toLowerCase();
  if (
    lower.includes((allValues.name || "").toLowerCase()) ||
    lower.includes((allValues.lastname1 || "").toLowerCase()) ||
    lower.includes((allValues.lastname2 || "").toLowerCase()) ||
    lower.includes((allValues.email || "").toLowerCase())
  ) {
    return "La contraseña no debe ser similar a tus datos personales";
  }
  return true;
};

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    //TODO: Aquí iría la lógica de registro (API)
    //TODO: Borrar console.log una vez implementada la API
    console.log("Datos de registro:", data);
    navigate("/");
  };

  const password = watch("password", "");

  return (
    <div
      className="min-h-screen flex bg-[#FDF3E8]"
      data-testid="signup-container"
    >
      <div
        className="hidden md:block w-1/2"
        data-testid="signup-image-container"
      >
        <img
          src="/login.png"
          alt="Sign Up Illustration"
          className="h-full w-full object-cover"
          data-testid="signup-image"
        />
      </div>

      <div
        className="w-full md:w-1/2 flex justify-center items-start pt-20"
        data-testid="signup-form-container"
      >
        <form
          className="w-[320px] flex flex-col items-center px-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h2
            className="text-3xl font-bold mb-2 text-black whitespace-nowrap"
            data-testid="signup-welcome-title"
          >
            ¡Bienvenido!
          </h2>
          <h4
            className="text-sm mb-8 text-black text-center leading-snug"
            data-testid="signup-subtitle"
          >
            Únete a CookFlow y empieza tu viaje culinario
          </h4>

          <div
            className="flex flex-col mb-4 w-full"
            data-testid="signup-lastname1-container"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="lastname1-input"
            >
              Primer apellido
            </label>
            <Input
              placeholder="Primer apellido"
              type="text"
              icon={PersonStanding}
              id="lastname1-input"
              name="lastname1"
              {...register("lastname1", {
                required: "El primer apellido es obligatorio",
              })}
              error={errors.lastname1?.message}
            />
          </div>

          <div
            className="flex flex-col mb-4 w-full"
            data-testid="signup-lastname2-container"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="lastname2-input"
            >
              Segundo apellido
            </label>
            <Input
              placeholder="Segundo apellido"
              type="text"
              icon={PersonStanding}
              id="lastname2-input"
              name="lastname2"
              {...register("lastname2", {
                required: "El segundo apellido es obligatorio",
              })}
              error={errors.lastname2?.message}
            />
          </div>

          <div
            className="flex flex-col mb-4 w-full"
            data-testid="signup-name-container"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="name-input"
            >
              Nombre
            </label>
            <Input
              placeholder="Nombre"
              type="text"
              icon={PersonStanding}
              id="name-input"
              name="name"
              {...register("name", { required: "El nombre es obligatorio" })}
              error={errors.name?.message}
            />
          </div>

          <div
            className="flex flex-col mb-4 w-full"
            data-testid="signup-email-container"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="email-input"
            >
              Correo electrónico
            </label>
            <Input
              placeholder="Correo electrónico"
              type="email"
              icon={Mail}
              id="email-input"
              name="email"
              {...register("email", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo electrónico no válido",
                },
              })}
              error={errors.email?.message}
            />
          </div>

          <div
            className="flex flex-col mb-4 w-full"
            data-testid="signup-password-container"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="password-input"
            >
              Contraseña
            </label>
            <Input
              placeholder="Contraseña"
              type="password"
              icon={Lock}
              id="password-input"
              name="password"
              {...register("password", {
                validate: (value) => passwordValidation(value, getValues()),
              })}
              error={errors.password?.message}
            />
          </div>

          <div
            className="flex flex-col mb-12 w-full"
            data-testid="signup-repeat-password-container"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="repeat-password-input"
            >
              Repite contraseña
            </label>
            <Input
              placeholder="Repite contraseña"
              type="password"
              icon={Lock}
              id="repeat-password-input"
              name="repeatPassword"
              {...register("repeatPassword", {
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
              error={errors.repeatPassword?.message}
            />
          </div>

          <Button type="submit" data-testid="signup-create-account-btn">
            Crear cuenta
          </Button>

          <h4
            className="text-xs mt-4 mb-12 text-black"
            data-testid="signup-login-link-container"
          >
            ¿Ya tienes una cuenta? Entra aquí:{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
              data-testid="signup-login-link"
            >
              Log In
            </Link>
          </h4>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
