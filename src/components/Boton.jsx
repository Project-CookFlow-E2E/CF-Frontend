import React from "react";

const Boton = ({ children, onClick, type = "button", className = "", disabled = false }) => {
  const baseStyles = `
    px-4 py-2 rounded-xl font-medium transition-colors duration-300
    bg-gray-200 text-gray-800 hover:bg-gray-300
    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Boton;
