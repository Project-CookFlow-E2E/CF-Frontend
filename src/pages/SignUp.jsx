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
    <div className="min-h-screen flex bg-[#FDF3E8]">
      {/* Image */}
      <div className="hidden md:block w-1/2">
        <img
          src="/login.png"
          alt="Sign Up Illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 flex justify-center items-start pt-20">
        <div className="w-[320px] flex flex-col items-center px-4">
          <h2 className="text-3xl font-bold mb-2 text-black whitespace-nowrap">
            ¡Bienvenido!
          </h2>
          <h4 className="text-sm mb-8 text-black text-center leading-snug">
            Únete a CookFlow y empieza tu viaje culinario
          </h4>

       <div className="flex flex-col mb-4" >
        <label className="text-xs mb-2 font-bold text-black">Primer apellido</label>
        <div className="peer border border-black rounded-md">
          <Input placeholder="Correo electrónico" type="email"  icon={PersonStanding}/>
        </div>
      </div>
      <div className="flex flex-col mb-4" >
        <label className="text-xs mb-2 font-bold text-black">Segundo apellido</label>
        <div className="peer border border-black rounded-md">
          <Input placeholder="Correo electrónico" type="email"  icon={PersonStanding}/>
        </div>
      </div>
      
      <div className="flex flex-col mb-4" >
        <label className="text-xs mb-2 font-bold text-black">Nombre</label>
        <div className="peer border border-black rounded-md">
          <Input placeholder="Correo electrónico" type="email" icon={PersonStanding} />
        </div>
      </div>
      
      <div className="flex flex-col mb-4" >
        <label className="text-xs mb-2 font-bold text-black">Correo electrónico</label>
        <div className="peer border border-black rounded-md">
          <Input placeholder="Correo electrónico" type="email" icon={Mail}/>
        </div>
      </div>

          <div className="flex flex-col mb-4 w-full">
            <label className="text-xs mb-2 font-bold text-black">
              Contraseña
            </label>
            <div className="peer border border-black rounded-md">
              <Input placeholder="Contraseña" type="password" icon={Lock} />
            </div>
          </div>

          <div className="flex flex-col mb-12 w-full">
            <label className="text-xs mb-2 font-bold text-black">
              Repite contraseña
            </label>
            <div className="peer border border-black rounded-md">
              <Input
                placeholder="Repite contraseña"
                type="password"
                icon={Lock}
              />
            </div>
          </div>

          <Button onClick={handleLogin} className="mb-3 w-40 px-1">
            Crear cuenta
          </Button>
          <h4 className="text-xs mb-12 text-black">
            ¿Ya tienes una cuenta? Entra aquí:{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
