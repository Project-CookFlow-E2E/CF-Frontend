import { Button } from "../components";
import Input from "../components/Input";
import { Mail, Lock, PersonStanding } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { userService } from "../services/userService";
import { useState } from "react";

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

const Register= () => {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setApiError(""); // Limpia errores previos
    try {
      await userService.createUser({
        username: data.username,
        name: data.name,
        surname: data.lastname1,
        second_surname: data.lastname2,
        email: data.email,
        password: data.password,
      });
      navigate("/login", {
        state: { successMsg: "¡Registro exitoso!" },
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("email", {
          type: "manual",
          message: "El correo electrónico o nombre de usuario ya existe",
        });
        setApiError("El correo electrónico o nombre de usuario ya existe");
      } else {
        setApiError("Error al registrar usuario. Inténtalo de nuevo.");
      }
    }
  };

  const password = watch("password", "");

  return (
    <div
      className="min-h-screen flex bg-[#FDF3E8]"
      data-testid="register-container"
    >
      <div
        className="hidden md:block w-1/2"
        data-testid="register-image-container"
      >
        <img
          src="/login.png"
          alt="Sign Up Illustration"
          className="h-full w-full object-cover"
          data-testid="register-image"
        />
      </div>

      <div
        className="w-full md:w-1/2 flex justify-center items-start pt-20"
        data-testid="register-form-container"
      >
        <form
          className="w-[320px] flex flex-col items-center px-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h2
            className="text-3xl font-bold mb-2 text-black whitespace-nowrap"
            data-testid="register-welcome-title"
          >
            ¡Bienvenido!
          </h2>
          <h4
            className="text-sm mb-8 text-black text-center leading-snug"
            data-testid="register-subtitle"
          >
            Únete a CookFlow y empieza tu viaje culinario
          </h4>
          {apiError && (
            <div
              className="text-red-500 text-sm mb-4"
              data-testid="register-api-error"
            >
              {apiError}
            </div>
          )}
          <div
            className="flex flex-col mb-4 w-full"
            data-testid="register-username-container"
          >
            <label
              className="text-xs mb-2 font-bold text-black"
              htmlFor="username-input"
            >
              Nombre de usuario
            </label>
            <Input
              placeholder="Nombre de usuario"
              type="text"
              icon={PersonStanding}
              id="username-input"
              name="username"
              {...register("username", {
                required: "El nombre de usuario es obligatorio",
                minLength: {
                  value: 3,
                  message:
                    "El nombre de usuario debe tener al menos 3 caracteres",
                },
              })}
              error={errors.username?.message}
            />
          </div>
          <div
            className="flex flex-col mb-4 w-full"
            data-testid="register-name-container"
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
            data-testid="register-lastname1-container"
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
            data-testid="register-lastname2-container"
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
            data-testid="register-email-container"
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
            data-testid="register-password-container"
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
            data-testid="register-repeat-password-container"
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

          <Button type="submit" data-testid="register-create-account-btn">
            Crear cuenta
          </Button>

          <h4
            className="text-xs mt-4 mb-12 text-black"
            data-testid="register-login-link-container"
          >
            ¿Ya tienes una cuenta? Entra aquí:{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
              data-testid="register-login-link"
            >
              Log In
            </Link>
          </h4>
        </form>
      </div>
    </div>
  );
};

export default Register;
