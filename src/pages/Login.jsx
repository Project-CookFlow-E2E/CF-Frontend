import React from 'react'
import Input from "../components/Input"
import Boton from "../components/Boton"

const Login = () => {
  const handleLogin = () => {
    // lógica de inicio de sesión
  };
  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-[#FDF3E8] px-4 pt-50">
      <h2 className="text-3xl font-bold mb-2 text-black">Hello again!</h2>
      <h4 className=" text-sm mb-12 text-black" >Enter your details to continue</h4>
      <div className="flex flex-col mb-4">
        <label className="text-xs mb-2 font-bold text-black">Correo electrónico</label>
        <Input placeholder="Correo electrónico" type="email" />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-xs mb-2 font-bold text-black">Contraseña</label>
        <Input placeholder = "Contraseña" type="email"/>
      </div>
      <div>
        <Boton onClick={handleLogin} className="mb-3 w-40 px-1">Iniciar sesión</Boton>
      </div>
      <h4 className="text-xs mb-12 text-black" >Don't have an account? Sign up here</h4>
    </div>
  )
}

export default Login;