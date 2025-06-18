/**
 * CheckedLineItem muestra un ingrediente con su nombre, cantidad y unidad, junto a un checkbox.
 *
 * Es ideal para listas de ingredientes donde el usuario puede marcar lo que ya tiene o ha usado.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {string} props.name - Nombre del ingrediente (por ejemplo: "Azúcar").
 * @param {number|string} props.quantity - Cantidad necesaria del ingrediente.
 * @param {string} props.unit - Unidad de medida (por ejemplo: "g", "ml", "ud").
 * @param {boolean} props.checked - Estado del checkbox (si está marcado).
 * @param {Function} props.onChange - Función que se ejecuta al marcar o desmarcar el checkbox.
 * @returns {JSX.Element} Elemento visual con checkbox e información del ingrediente.
 */
export default function CheckedLineItem({ name, quantity, unit, checked, onChange }) {
  return (
    <li
      className="flex items-center justify-between py-2 border-b border-gray-100"
      data-testid="ingredient-item"
    >
      <label className="flex items-center cursor-pointer w-full" data-testid="ingredient-label">
        {/* Checkbox personalizado */}
        <div className="relative mr-3" data-testid="ingredient-checkbox-wrapper">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="hidden"
            data-testid="ingredient-checkbox"
          />
          <div
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              checked ? 'bg-black border-black' : 'border-gray-700'
            }`}
            data-testid="ingredient-checkbox-box"
          >
            {checked && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-testid="ingredient-checkbox-checkmark"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Nombre + línea hasta la cantidad */}
        <div
          className="flex-1 flex items-center border-b border-dotted border-gray-300"
          data-testid="ingredient-name-wrapper"
        >
          <span className="text-gray-800" data-testid="ingredient-name">{name}</span>
        </div>

        {/* Cantidad */}
        <span
          className="text-sm text-gray-800 whitespace-nowrap ml-2"
          data-testid="ingredient-quantity"
        >
          {quantity} {unit}
        </span>
      </label>
    </li>
  );
}
