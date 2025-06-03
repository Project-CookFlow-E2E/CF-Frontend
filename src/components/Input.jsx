import React from "react";

const Input = ({ type = "text", onChange, placeholder, value }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="bg-white rounded-lg border border-gray-300 px-6 py-3 w-full"
    />
  );
};

export default Input;
