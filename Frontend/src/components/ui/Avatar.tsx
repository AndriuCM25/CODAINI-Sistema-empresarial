import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  iniciales?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  iniciales = 'U',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <div className={`${sizeStyles[size]} rounded-full overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-gradient-to-br from-primary to-primary-gray flex items-center justify-center text-primary-dark font-bold ${className}`}
    >
      {iniciales}
    </div>
  );
};

export default Avatar;
