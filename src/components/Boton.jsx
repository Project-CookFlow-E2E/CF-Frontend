import React from "react";

const Boton = ({ children, onClick, type = "button", className = "", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-300
                  bg-accent text-white hover:bg-gray-300
                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                  ${className}`}
    >
      {children}
    </button>
  );
};

export default Boton;
