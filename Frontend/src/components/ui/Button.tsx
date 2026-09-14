import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
}) => {
  const baseStyles =
    'rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1';

  const variantStyles = {
    // Acento CODAINI — teal en light, cyan en dark
    primary:
      'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy hover:opacity-90 shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-codaini-cyan focus:ring-offset-1',
    // Borde con acento
    secondary:
      'border-2 border-light-accent dark:border-codaini-cyan text-light-accent dark:text-codaini-cyan hover:bg-light-accent hover:text-white dark:hover:bg-codaini-cyan dark:hover:text-codaini-navy bg-transparent',
    // Peligro
    danger:
      'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20 focus:ring-red-500',
    // Éxito
    success:
      'bg-green-500 text-white hover:bg-green-600 shadow-sm shadow-green-500/20 focus:ring-green-500',
    // Ghost (solo texto)
    ghost:
      'text-light-muted dark:text-codaini-muted hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter hover:text-light-text dark:hover:text-codaini-text',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
