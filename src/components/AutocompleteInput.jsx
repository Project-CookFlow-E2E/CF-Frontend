import { useState } from "react";
/**
 * Componente de input con autocompletado a partir de una lista de sugerencias.
 * Muestra un desplegable con coincidencias conforme se escribe, y permite seleccionar una opción.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.label - Etiqueta que se muestra sobre el input.
 * @param {string[]} props.suggestions - Lista de opciones disponibles para el autocompletado.
 * @param {string} [props.placeholder] - Texto de ejemplo que se muestra dentro del input.
 * @param {function} [props.onChange] - Función que se ejecuta al cambiar o seleccionar el valor.
 *
 * @example
 * <AutocompleteInput
 *   label="Ingrediente"
 *   suggestions={['Leche', 'Huevos', 'Harina']}
 *   placeholder="Añade un ingrediente"
 *   onChange={(value) => console.log(value)}
 * />
 *
 * @author Nico
 */
export default function AutocompleteInput({
  label,
  suggestions,
  placeholder = "",
  onChange,
}) {
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e) => {
    const input = e.target.value;
    setValue(input);
    onChange?.(input);

    if (input.length > 0) {
      const results = suggestions.filter((s) =>
        s.toLowerCase().includes(input.toLowerCase()),
      );
      setFiltered(results);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (item) => {
    setValue(item);
    onChange?.(item);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white rounded-lg border border-gray-300 px-6 py-3 w-full"
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-md">
          {filtered.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
