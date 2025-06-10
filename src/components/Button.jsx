import PropTypes from "prop-types";

/**
 * Button component
 * Renders a customizable button element.
 *
 * @author Sergio
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display inside the button
 * @param {function} props.onClick - Function to handle button click event
 * @param {string} [props.type="button"] - Button type attribute
 * @param {string} [props.className=""] - Optional additional class names
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.ariaLabel] - Optional ariaLabel for accessibility
 * @returns {JSX.Element} The rendered button component
 *
 * @modifiedby Ángel Aragón
 * @modified Agregado cursor-pointer y ariaLabel para accesibilidad
 */
const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  ariaLabel,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid="custom-button"
      aria-label={ariaLabel}
      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-300 bg-accent text-white cursor-pointer hover:bg-rose-600${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </button>
  );
};

/**
 * PropTypes de Button component
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - Contenido a mostrar dentro del botón
 * @property {function} [onClick] - Función para manejar el evento de clic del botón
 * @property {string} [type="button"] - Atributo de tipo del botón
 * @property {string} [className=""] - Clases adicionales opcionales
 * @property {boolean} [disabled=false] - Indica si el botón está deshabilitado
 * @property {string} [ariaLabel] - Atributo aria-label para accesibilidad
 * @type {import('prop-types').InferProps<ButtonProps>}
 *
 * @author Ángel Aragón
 */
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
};
export default Button;
