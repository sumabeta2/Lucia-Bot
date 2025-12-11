import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  const baseStyles = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
  
  return (
    <div className="mb-4">
      {label && <label htmlFor={props.id} className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>}
      <input className={`${baseStyles} ${className}`} {...props} />
    </div>
  );
};

export default Input;