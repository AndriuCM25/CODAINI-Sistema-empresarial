import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { tc } from '../../utils/themeClasses';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  delay?: number;
  suffix?: string;
}

const colorMap = {
  primary: {
    icon: 'text-light-accent dark:text-codaini-cyan',
    bg:   'bg-light-accent/10 dark:bg-codaini-cyan/10',
    bar:  'bg-light-accent dark:bg-codaini-cyan',
  },
  success: {
    icon: 'text-green-600 dark:text-green-400',
    bg:   'bg-green-100 dark:bg-green-400/10',
    bar:  'bg-green-600 dark:bg-green-400',
  },
  warning: {
    icon: 'text-yellow-600 dark:text-yellow-400',
    bg:   'bg-yellow-100 dark:bg-yellow-400/10',
    bar:  'bg-yellow-600 dark:bg-yellow-400',
  },
  danger: {
    icon: 'text-red-600 dark:text-red-400',
    bg:   'bg-red-100 dark:bg-red-400/10',
    bar:  'bg-red-600 dark:bg-red-400',
  },
  info: {
    icon: 'text-blue-600 dark:text-blue-400',
    bg:   'bg-blue-100 dark:bg-blue-400/10',
    bar:  'bg-blue-600 dark:bg-blue-400',
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  delay = 0,
  suffix,
}) => {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`
        ${tc.cardShadow}
        p-6 hover:shadow-md dark:hover:shadow-codaini
        transition-all duration-300
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium mb-1 ${tc.textMuted}`}>{title}</p>
          <h3 className={`text-3xl font-bold ${tc.textHeading} mb-1`}>
            {value}
            {suffix && <span className={`text-lg ml-1 ${tc.textMuted}`}>{suffix}</span>}
          </h3>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className={`${tc.textMuted} font-normal`}>vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${c.bg}`}>
          <Icon className={`w-7 h-7 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
