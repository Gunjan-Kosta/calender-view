
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus-visible:ring-neutral-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 focus-visible:ring-primary-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
