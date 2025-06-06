import React from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
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
                    alt="Login Illustration"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Form */}
            <div className="w-full md:w-1/2 flex justify-center items-start pt-20">
                <div className="w-[320px] flex flex-col items-center px-4">
                    <h2 className="text-3xl font-bold mb-2 text-black whitespace-nowrap">
                        ¡Bienvenido de nuevo!
                    </h2>
                    <h4 className="text-sm mb-12 text-black">
                        Introduce tu información
                    </h4>

                    <div className="flex flex-col mb-4 w-full">
                        <label className="text-xs mb-2 font-bold text-black">
                            Correo electrónico
                        </label>
                        <div className="peer border border-black rounded-md">
                            <Input
                                placeholder="Correo electrónico"
                                type="email"
                                icon={Mail}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-12 w-full">
                        <label className="text-xs mb-2 font-bold text-black">
                            Contraseña
                        </label>
                        <div className="peer border border-black rounded-md">
                            <Input
                                placeholder="Contraseña"
                                type="password"
                                icon={Lock}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            onClick={handleLogin}
                            className="mb-3 w-40 px-1"
                        >
                            Iniciar sesión
                        </Button>
                    </div>

                    <h4 className="text-xs mb-12 text-black">
                        ¿No tienes cuenta? Regístrate aquí:{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 hover:underline"
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
