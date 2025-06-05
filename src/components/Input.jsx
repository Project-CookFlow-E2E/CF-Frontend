/**
 * Input component
 *
 * Stylized input field for forms, filters and more. Admite ícono opcional.
 *
 * @author Julia
 *
 * Props:
 * - type: string. Input type, e.g. "text", "password".
 * - onChange: function. Callback for input changes.
 * - placeholder: string. Placeholder text for the input.
 * - value: string. The current value of the input.
 * - icon: React component (optional). Icon to render at the start of the input.
 *
 * Example:
 * <Input
 *   type="text"
 *   value={valor}
 *   onChange={handleChange}
 *   placeholder="Buscar..."
 *   icon={SearchIcon}
 * />
 */
import React from "react";

const Input = ({
  type,
  onChange,
  placeholder,
  value,
  icon: Icon
}) => {
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
