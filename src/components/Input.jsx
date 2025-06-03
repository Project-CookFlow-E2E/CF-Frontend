import React from 'react'

const Input = ({ type, onChange, placeholder, value }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className='bg-white-500'
    />
  );
};

export default Input;