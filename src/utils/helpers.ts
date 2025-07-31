import type { FeatureStatus, NetworkType } from '../types/feature';
import clsx from 'clsx';

export const getStatusColor = (status: FeatureStatus): string => {
  switch (status) {
    case 'enabled':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'disabled':
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    case 'unknown':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
  }
};

export const getStatusIcon = (status: FeatureStatus): string => {
  switch (status) {
    case 'enabled':
      return '✅';
    case 'disabled':
      return '❌';
    case 'unknown':
      return '⏳';
    default:
      return '❓';
  }
};

export const getNetworkColor = (network: NetworkType): string => {
  switch (network) {
    case 'mainnet':
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    case 'testnet':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'devnet':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
  }
};

export const getCategoryColor = (category: string): string => {
  const colors = {
    core: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    vm: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    api: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    consensus: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    storage: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    security: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
  };
  return colors[category as keyof typeof colors] || colors.core;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} 分钟前`;
    }
    return `${diffHours} 小时前`;
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 30) {
    return `${diffDays} 天前`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} 个月前`;
  } else {
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} 年前`;
  }
};

export const cn = clsx;