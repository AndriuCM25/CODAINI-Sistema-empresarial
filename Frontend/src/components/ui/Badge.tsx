import React from 'react';
import { tc } from '../../utils/themeClasses';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<string, string> = {
    success: tc.badgeSuccess,
    warning: tc.badgeWarning,
    danger:  tc.badgeDanger,
    info:    tc.badgeInfo,
    default: tc.badgeDefault,
    primary: 'bg-codaini-cyan/10 dark:bg-codaini-cyan/10 text-light-accent dark:text-codaini-cyan border-codaini-cyan/20 dark:border-codaini-cyan/30',
  };

  const dotColors: Record<string, string> = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger:  'bg-red-500',
    info:    'bg-blue-500',
    default: 'bg-gray-400',
    primary: 'bg-codaini-cyan dark:bg-codaini-cyan',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs font-medium',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
