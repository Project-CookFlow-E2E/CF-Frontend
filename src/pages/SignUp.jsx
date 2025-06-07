import { Button, Input } from "../components";
import { Mail, Lock, PersonStanding } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex bg-[#FDF3E8]"
      data-testid="signup-container"
    >
      {/* Image */}
      <div className="hidden md:block w-1/2" data-testid="signup-image-container">
        <img
          src="/login.png"
          alt="Sign Up Illustration"
          className="h-full w-full object-cover"
          data-testid="signup-image"
        />
      </div>

      {/* Form */}
      <div
        className="w-full md:w-1/2 flex justify-center items-start pt-20"
        data-testid="signup-form-container"
      >
        <div className="w-[320px] flex flex-col items-center px-4">
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

          <div className="flex flex-col mb-4" data-testid="signup-lastname1-container">
            <label
              className="text-xs mb-2 font-bold text-black"
              data-testid="signup-lastname1-label"
              htmlFor="lastname1-input"
            >
              Primer apellido
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Primer apellido"
                type="text"
                icon={PersonStanding}
                id="lastname1-input"
                data-testid="signup-lastname1-input"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4" data-testid="signup-lastname2-container">
            <label
              className="text-xs mb-2 font-bold text-black"
              data-testid="signup-lastname2-label"
              htmlFor="lastname2-input"
            >
              Segundo apellido
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Segundo apellido"
                type="text"
                icon={PersonStanding}
                id="lastname2-input"
                data-testid="signup-lastname2-input"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4" data-testid="signup-name-container">
            <label
              className="text-xs mb-2 font-bold text-black"
              data-testid="signup-name-label"
              htmlFor="name-input"
            >
              Nombre
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Nombre"
                type="text"
                icon={PersonStanding}
                id="name-input"
                data-testid="signup-name-input"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4" data-testid="signup-email-container">
            <label
              className="text-xs mb-2 font-bold text-black"
              data-testid="signup-email-label"
              htmlFor="email-input"
            >
              Correo electrónico
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Correo electrónico"
                type="email"
                icon={Mail}
                id="email-input"
                data-testid="signup-email-input"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4 w-full" data-testid="signup-password-container">
            <label
              className="text-xs mb-2 font-bold text-black"
              data-testid="signup-password-label"
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
                data-testid="signup-password-input"
              />
            </div>
          </div>

          <div className="flex flex-col mb-12 w-full" data-testid="signup-repeat-password-container">
            <label
              className="text-xs mb-2 font-bold text-black"
              data-testid="signup-repeat-password-label"
              htmlFor="repeat-password-input"
            >
              Repite contraseña
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Repite contraseña"
                type="password"
                icon={Lock}
                id="repeat-password-input"
                data-testid="signup-repeat-password-input"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="mb-3 w-40 px-1"
            data-testid="signup-create-account-btn"
          >
            Crear cuenta
          </Button>

          <h4
            className="text-xs mb-12 text-black"
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
        </div>
      </div>
    </div>
  );
};

export default SignUp;
