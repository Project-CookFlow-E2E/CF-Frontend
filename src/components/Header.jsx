import React from "react";
import logo from "../assets/logo.svg";

const Header = ({ isLoggedIn, onLogOut }) => {
    return (
        <header className="bg-gray-300 px-4 py-3">
            <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" width={35} height={35} />

                    <h1>Cookflow</h1>
                </div>
                {isLoggedIn ? (
                    <div>
                        <input type="search" name="" id="" />
                    </div>
                ) : (
                    <ul className="flex gap-10 items-center">
                        <li>
                            <a href="">Iniciar Sesión</a>
                        </li>
                        <li>
                            <button className="px-3 py-1.5 bg-black text-white rounded-full cursor-pointer hover:bg-gray-500 transition-colors duration-300">
                                Registrarse
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    );
};

export default Header;
