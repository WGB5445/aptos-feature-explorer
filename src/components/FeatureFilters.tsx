import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FeatureStatus } from '../types/feature';
import { categories } from '../data/aptosApi';
import { getCategoryColor, getStatusColor, cn } from '../utils/helpers';
import { Tag, CheckCircle } from 'lucide-react';

interface FeatureFiltersProps {
  selectedCategory: string | null;
  selectedStatus: FeatureStatus | null;
  onCategoryChange: (category: string | null) => void;
  onStatusChange: (status: FeatureStatus | null) => void;
}

const FeatureFilters: React.FC<FeatureFiltersProps> = ({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const statusOptions: { value: FeatureStatus; label: string }[] = [
    { value: 'enabled', label: t('common.enabled') },
    { value: 'disabled', label: t('common.disabled') },
    { value: 'unknown', label: t('common.pending') },
  ];

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Tag className="w-4 h-4" />
          <span>{t('categories.all')}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              selectedCategory === null
                ? 'bg-aptos-600 text-white shadow-md border border-aptos-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            )}
          >
            {t('categories.all')}
          </button>
          
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            
            // 为每个分类定义清晰的选中状态颜色
            const getSelectedColors = (categoryId: string) => {
              switch (categoryId) {
                case 'consensus':
                  return 'bg-red-600 text-white shadow-md border border-red-700';
                case 'vm':
                  return 'bg-purple-600 text-white shadow-md border border-purple-700';
                case 'crypto':
                  return 'bg-blue-600 text-white shadow-md border border-blue-700';
                case 'account':
                  return 'bg-green-600 text-white shadow-md border border-green-700';
                case 'asset':
                  return 'bg-orange-600 text-white shadow-md border border-orange-700';
                case 'storage':
                  return 'bg-yellow-600 text-white shadow-md border border-yellow-700';
                case 'governance':
                  return 'bg-indigo-600 text-white shadow-md border border-indigo-700';
                case 'other':
                  return 'bg-gray-600 text-white shadow-md border border-gray-700';
                default:
                  return 'bg-gray-600 text-white shadow-md border border-gray-700';
              }
            };
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isSelected
                    ? getSelectedColors(category.id)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <CheckCircle className="w-4 h-4" />
          <span>{t('status.all')}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange(null)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              selectedStatus === null
                ? 'bg-aptos-600 text-white shadow-md border border-aptos-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            )}
          >
            {t('status.all')}
          </button>
          
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.value;
            
            // 为每个状态定义清晰的选中状态颜色
            const getSelectedColors = (status: FeatureStatus) => {
              switch (status) {
                case 'enabled':
                  return 'bg-green-600 text-white shadow-md border border-green-700';
                case 'disabled':
                  return 'bg-red-600 text-white shadow-md border border-red-700';
                case 'unknown':
                  return 'bg-yellow-600 text-white shadow-md border border-yellow-700';
                default:
                  return 'bg-gray-600 text-white shadow-md border border-gray-700';
              }
            };
            
            return (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isSelected
                    ? getSelectedColors(option.value)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureFilters;