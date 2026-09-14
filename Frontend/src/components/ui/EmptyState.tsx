import React from 'react';
import { LucideIcon } from 'lucide-react';
import { tc } from '../../utils/themeClasses';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="mb-4 p-4 rounded-full bg-light-surface-2 dark:bg-codaini-navy-lighter">
          <Icon className={`w-10 h-10 ${tc.textMuted}`} />
        </div>
      )}
      <h3 className={`text-lg font-semibold mb-2 ${tc.textPrimary}`}>{title}</h3>
      {description && (
        <p className={`text-sm mb-6 max-w-sm ${tc.textMuted}`}>{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
