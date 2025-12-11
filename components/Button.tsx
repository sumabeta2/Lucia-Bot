import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  let baseStyles = 'w-full py-3 px-6 rounded-lg font-bold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  switch (variant) {
    case 'primary':
      baseStyles += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      break;
    case 'secondary':
      baseStyles += ' bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'ghost':
      baseStyles += ' bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500';
      break;
  }

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;