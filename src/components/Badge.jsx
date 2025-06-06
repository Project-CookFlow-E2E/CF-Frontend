import React from "react";

/**
 * Badge es un componente visual tipo etiqueta (pill) que funciona como un checkbox oculto.
 *
 * Permite seleccionar o deseleccionar su estado visualmente, útil para filtros, categorías, etc.
 *
 * @component
 * @param {object} props - Props del componente.
 * @param {React.ReactNode} props.children - Contenido del badge (texto o icono).
 * @param {string} [props.className] - Clases adicionales para personalizar el estilo.
 * @param {any} [props.rest] - Cualquier otra prop válida para el input (como onChange, name, checked...).
 * @returns {JSX.Element} Elemento visual interactivo.
 */
const Badge = ({ children, className = "", ...props }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...props} />
            <span
                className={`px-4 py-2 rounded-full bg-white text-black transition peer-checked:ring-1 peer-checked:ring-accent peer-checked:bg-accent peer-checked:text-white ${className}`}
            >
                {children}
            </span>
        </label>
    );
};

export default Badge;

