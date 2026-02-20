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
  
  const baseStyles =
    "font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";
  
  const variants = {
    primary:
      "bg-gradient-to-r from-sky-400 to-emerald-400 text-white hover:shadow-lg hover:scale-105 focus:ring-sky-400",

    secondary:
      "bg-white text-sky-500 border-2 border-sky-400 hover:bg-sky-50 focus:ring-sky-400",

    success:
      "bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:shadow-lg hover:scale-105 focus:ring-emerald-400",

    danger:
      "bg-gradient-to-r from-rose-400 to-red-500 text-white hover:shadow-lg hover:scale-105 focus:ring-rose-400",

    outline:
      "bg-transparent border-2 border-sky-300 text-sky-500 hover:bg-sky-50 focus:ring-sky-400",

    ghost:
      "bg-transparent text-sky-500 hover:bg-sky-50 focus:ring-sky-400"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed hover:scale-100"
    : "";
  
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

export default Button;