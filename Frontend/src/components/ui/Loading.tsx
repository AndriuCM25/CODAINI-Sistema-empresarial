import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  text = 'Cargando...',
  size = 'md',
  fullPage = false,
}) => {
  const sizeMap = {
    sm: { ring: 'w-6 h-6 border-2', text: 'text-xs' },
    md: { ring: 'w-10 h-10 border-2', text: 'text-sm' },
    lg: { ring: 'w-14 h-14 border-[3px]', text: 'text-base' },
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          ${sizeMap[size].ring}
          rounded-full
          border-codaini-border dark:border-codaini-border border-light-border
          border-t-codaini-cyan dark:border-t-codaini-cyan border-t-light-accent
          animate-spin
        `}
      />
      {text && (
        <p className={`${sizeMap[size].text} text-light-muted dark:text-codaini-muted font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center bg-light-bg dark:bg-codaini-navy z-50"
      >
        {spinner}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default Loading;
