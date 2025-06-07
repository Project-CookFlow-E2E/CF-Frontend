import { useState } from "react";

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
        s.toLowerCase().includes(input.toLowerCase())
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
    <div className="relative w-full" data-testid="autocomplete-wrapper">
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          data-testid="autocomplete-label"
        >
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white rounded-lg border border-gray-300 px-6 py-3 w-full"
        data-testid="autocomplete-input"
      />
      {showDropdown && filtered.length > 0 && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-md"
          data-testid="autocomplete-dropdown"
        >
          {filtered.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
              data-testid={`autocomplete-option-${item}`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
