import { IoMdTime } from "react-icons/io";
import PropTypes from "prop-types";

/**
 * TimerBadge muestra un badge con el tiempo estimado en minutos.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {number} props.minutes - Tiempo en minutos a mostrar.
 * @param {string} [props.className] - Clases adicionales para personalizar el estilo.
 * @param {string} [props.color="text-gray-700"] - Color del texto del badge.
 * @param {number} [props.sizeIcon=18] - Tamaño del ícono de reloj.
 * @returns {JSX.Element} Badge con el tiempo estimado.
 * @author Hema Priya
 *
 * @modifiedby Ángel Aragón
 * @modified
 * - Creada documentación.
 * - Agregado props className, color y sizeIcon para que sea reutilizable.
 * - Agregado icono de reloj con ReactIcons.
 */
const TimerBadge = ({
  minutes,
  className,
  sizeIcon = 18,
  color = "text-gray-700",
}) => (
  <div
    className={`flex items-center ${color} ${className}`}
    data-testid="timer-badge"
  >
    <IoMdTime size={sizeIcon} />

    <span className="text-xs sm:text-sm">{minutes}m</span>
  </div>
);

export default TimerBadge;

/**
 * PropTypes de TimerBadge component
 * @typedef {Object} TimerBadgeProps
 * @property {number} minutes - Tiempo en minutos a mostrar.
 * @property {string} [className] - Clases adicionales para personalizar el estilo.
 * @property {string} [color="text-gray-700"] - Color del texto del badge.
 * @property {number} [sizeIcon=18] - Tamaño del ícono de reloj.
 * @type {import('prop-types').InferProps<TimerBadgeProps>}
 * @author Ángel Aragón
 */
TimerBadge.propTypes = {
  minutes: PropTypes.number.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  sizeIcon: PropTypes.number,
};
