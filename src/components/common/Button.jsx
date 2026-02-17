import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  
  const baseStyles = "font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:scale-105 focus:ring-purple-500",
    secondary: "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 focus:ring-purple-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg hover:scale-105 focus:ring-red-500",
    outline: "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 focus:ring-purple-500",
    ghost: "bg-transparent text-purple-600 hover:bg-purple-50 focus:ring-purple-500"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};