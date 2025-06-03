import React from 'react'
import Input from "../components/Input"
import Boton from "../components/Boton"
import { Mail, Lock} from "lucide-react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-[#FDF3E8] px-4 pt-50">
      <h2 className="text-3xl font-bold mb-2 text-black">¡Bienvenido de nuevo!</h2>
      <h4 className=" text-sm mb-12 text-black" >Introduce tu información</h4>
      <div className="flex flex-col mb-4" >
        <label className="text-xs mb-2 font-bold text-black">Correo electrónico</label>
        <div className="peer border border-black rounded-md">
          <Input placeholder="Correo electrónico" type="email" icon={Mail}/>
        </div>
      </div>
      <div className="flex flex-col mb-12">
        <label className="text-xs mb-2 font-bold text-black">Contraseña</label>
        <div className="peer border border-black rounded-md">
          <Input placeholder = "Contraseña" type="email" icon={Lock}/>
        </div>
        
      </div>
      <div>
        <Boton onClick={handleLogin} className="mb-3 w-40 px-1">Iniciar sesión</Boton>
      </div>
      <h4 className="text-xs mb-12 text-black" >¿No tienes cuenta? Regístrate aquí.</h4>
    </div>
  )
}

export default Login;