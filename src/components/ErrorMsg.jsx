import PropTypes from "prop-types";
import { MdError } from "react-icons/md";

/**
 * Componente para mostrar mensajes de error.
 *
 * @export
 * @param {{ children: any; }} param0
 * @param {any} param0.children
 * @returns {JSX.Element}
 * @author Ángel Aragón
 */
export default function ErrorMsg({ children }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
      <MdError size={20} className="inline-block mr-2 mb-1  " /> {children}
    </div>
  );
}

/**
 * PropTypes para ErrorMsg
 * @typedef {Object} ErrorMsgProps
 * @property {React.ReactNode} children - Contenido del mensaje de error.
 * @author Ángel Aragón
 */
ErrorMsg.propTypes = {
  children: PropTypes.node.isRequired,
};
