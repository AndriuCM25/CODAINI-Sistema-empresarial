import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'primary', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-primary-dark/50 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-primary-gray text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-primary-light mb-2">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-primary-gray text-xs">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
