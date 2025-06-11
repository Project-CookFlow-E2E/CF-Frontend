import PropTypes from "prop-types";
import React from "react";
import { MdError } from "react-icons/md";

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
 * @param {string} [props.name] - Nombre del input, útil para formularios.
 * @param {string} [props.error] - Mensaje de error que se muestra debajo del input si existe.
 * @param {React.ComponentType} [props.icon] - Componente de ícono (por ejemplo: un ícono de búsqueda o usuario).
 * @returns {JSX.Element} Campo de entrada con estilos y funcionalidad personalizables.
 *
 * @modifiedby Ángel Aragón
 * @modified Agregado PropTypes, error, error icon (MdError) y name como propiedades opcionales.
 */
const Input = ({
  type,
  onChange,
  placeholder,
  value,
  icon: Icon,
  name,
  error,
  ...rest
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center bg-white rounded-lg border border-gray-300 px-4 py-3 w-full">
        {Icon && <Icon className="mr-3 text-black w-5 h-5" />}
        <input
          type={type}
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="outline-none w-full bg-transparent"
          {...rest}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1" data-testid="input-error">
          <MdError size={16} className="inline-block mr-1 mb-1" /> {error}
        </span>
      )}
    </div>
  );
};

/**
 * PropTypes para el componente Input.
 * Define los tipos de las propiedades esperadas y sus requisitos.
 * @typedef {Object} PropTypes.Input
 * @property {string} type - Tipo del input (requerido).
 * @property {function} onChange - Función que se ejecuta al cambiar el valor del input (requerido).
 * @property {string} placeholder - Texto de ayuda que aparece dentro del input (requerido).
 * @property {string} value - Valor actual del input (requerido).
 * @property {React.ComponentType} [icon] - Componente de ícono opcional.
 * @property {string} [name] - Nombre del input, útil para formularios.
 * @property {string} [error] - Mensaje de error que se muestra debajo del input si existe.
 *
 * @author Ángel Aragón
 */
PropTypes.Input = {
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  name: PropTypes.string,
  error: PropTypes.string,
};

export default Input;
