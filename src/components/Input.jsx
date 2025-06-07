import React from "react";

const Input = ({ type, onChange, placeholder, value, icon: Icon }) => {
  return (
    <div
      className="flex items-center bg-white rounded-lg border border-gray-300 px-4 py-3 w-full"
      data-testid="input-wrapper"
    >
      {Icon && <Icon className="mr-3 text-black w-5 h-5" data-testid="input-icon" />}
      <input
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className="outline-none w-full bg-transparent"
        data-testid="input-element"
      />
    </div>
  );
};

export default Input;
