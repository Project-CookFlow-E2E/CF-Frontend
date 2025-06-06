import React from "react";

/**
 * Input es un campo de texto reutilizable con soporte para íconos.
 *
 * Diseñado para usarse en formularios o filtros, con estilos personalizados y opcionalmente un ícono a la izquierda.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {string} props.type - Tipo del input (por ejemplo: "text", "email", "password").
 * @param {function} props.onChange - Función que se ejecuta cuando el valor del input cambia.
 * @param {string} props.placeholder - Texto de ayuda que aparece dentro del input.
 * @param {string} props.value - Valor actual del input (controlado externamente).
 * @param {React.ComponentType} [props.icon] - Componente de ícono (por ejemplo: un ícono de búsqueda o usuario).
 * @returns {JSX.Element} Campo de entrada con estilos y funcionalidad personalizables.
 */
const Input = ({ type, onChange, placeholder, value, icon: Icon }) => {
  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-300 px-4 py-3 w-full">
      {Icon && <Icon className="mr-3 text-black w-5 h-5" />}
      <input
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className="outline-none w-full bg-transparent"
      />
    </div>
  );
};

export default Input;
