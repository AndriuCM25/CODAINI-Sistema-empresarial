import React from 'react';
import { Search, X } from 'lucide-react';
import { tc } from '../../utils/themeClasses';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`w-4 h-4 ${tc.textMuted}`} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${tc.input} pl-9 pr-9`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${tc.textMuted} hover:text-light-text dark:hover:text-codaini-text transition-colors`}
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
