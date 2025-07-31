import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { cn } from '../utils/helpers';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder
}) => {
  const { t } = useTranslation();
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-aptos-500 focus:border-aptos-500',
            'bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'text-sm transition-colors duration-200'
          )}
          placeholder={placeholder || t('common.searchPlaceholder')}
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {t('common.search')}: "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;