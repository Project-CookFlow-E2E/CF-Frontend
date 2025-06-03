import React from "react";
import logo from "../assets/logo.svg";
import { Link } from 'react-router-dom'; 

const Header = ({ isLoggedIn = true, onLogOut }) => {
    return (
        <header className="bg-background px-4 py-3">
        {isLoggedIn ? (
          <div className="flex justify-between items-center mx-auto max-w-6xl">
            <Link to="/" className="flex items-center gap-3">
  <img src={logo} alt="Logo" width={35} height={35} />
  <h1 className="text-xl font-mate">
    <span className="text-3xl">C</span>OOK
    <span className="text-3xl">F</span>LOW
  </h1>
</Link>
      
            <Link
              to="/profile"
              className="px-4 py-2 rounded-lg text-white bg-accent hover:opacity-90 transition"
            >
              Mi Perfil
            </Link>
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
