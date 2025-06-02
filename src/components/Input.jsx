import React from 'react'

const Input = ({ type = "text", onChange, placeholder, value }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className='bg-gray-500'
    />
  );
};

export default Input;
