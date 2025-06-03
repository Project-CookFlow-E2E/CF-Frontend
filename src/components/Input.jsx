import React from "react";

const Input = ({ type, onChange, placeholder, value, icon: Icon }) => {
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

export default Input;
