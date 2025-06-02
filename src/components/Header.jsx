import React from "react";
import logo from "../assets/logo.svg";

const Header = ({ isLoggedIn = true, onLogOut }) => {
    return (
        <header className="bg-background px-4 py-3">
            {isLoggedIn ? (
                <div className="flex justify-center items-center mx-auto">
                    <div className="flex text-center justify-center items-center gap-3">
                        <img src={logo} alt="Logo" width={35} height={35} />
                        <h1 className="text-xl font-mate"><span className="text-3xl">C</span>OOK<span className="text-3xl">F</span>LOW</h1>
                    </div>
                </div>
            ) : (
              <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" width={35} height={35} />

                        <h1 className="hidden md:block text-xl font-mate"><span className="text-3xl">C</span>OOK<span className="text-3xl">F</span>LOW</h1>
                    </div>
                <ul className="flex gap-5 items-center">
                    <li>
                        <button className="text-accent bg-white px-3 py-1.5 rounded-full">
                            Iniciar Sesion
                        </button>
                    </li>
                    <li>
                        <button className="px-3 py-1.5 bg-accent text-white rounded-full cursor-pointer hover:bg-gray-500 transition-colors duration-300">
                            Registrarse
                        </button>
                    </li>
                </ul>
              </div>
            )}
        </header>
    );
};

export default Header;
