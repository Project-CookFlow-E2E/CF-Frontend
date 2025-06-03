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
      <h2 className="text-3xl font-bold mb-2 text-black">Hello again!</h2>
      <h4 className=" text-sm mb-12 text-black" >Enter your details to continue</h4>
      <div className="flex flex-col mb-4" >
        <label className="text-xs mb-2 font-bold text-black">Correo electrónico</label>
        <div className="peer border border-black rounded-md">
          <Mail className="absolute left-21.5 top-1/2 -translate-y-[1px] text-black" size={15} />
          <Input placeholder="Correo electrónico" type="email" />
        </div>
      </div>
      <div className="flex flex-col mb-12">
        <label className="text-xs mb-2 font-bold text-black">Contraseña</label>
        <div className="peer border border-black rounded-md">
          <Lock className="absolute left-[5.375rem] top-[60.5%] -translate-y-[1px] text-black" size={15} />
          <Input placeholder = "Contraseña" type="email"/>
        </div>
        
      </div>
      <div>
        <Boton onClick={handleLogin} className="mb-3 w-40 px-1">Iniciar sesión</Boton>
      </div>
      <h4 className="text-xs mb-12 text-black" >Don't have an account? Sign up here</h4>
    </div>
  )
}

export default Login;