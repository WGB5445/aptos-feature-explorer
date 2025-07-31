import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Feature, NetworkType } from '../types/feature';
import { networks } from '../data/aptosApi';
import { getNetworkColor, cn } from '../utils/helpers';
import { BarChart3, TrendingUp } from 'lucide-react';

interface FeatureStatsProps {
  features: Feature[];
  selectedNetwork: NetworkType | null;
}

const FeatureStats: React.FC<FeatureStatsProps> = ({ features, selectedNetwork }) => {
  const { t } = useTranslation();
  const getStatsForNetwork = (networkId: NetworkType) => {
    const enabled = features.filter(f => f.status[networkId] === 'enabled').length;
    const disabled = features.filter(f => f.status[networkId] === 'disabled').length;
    const pending = features.filter(f => f.status[networkId] === 'unknown').length;
    const total = features.length;
    
    return { enabled, disabled, pending, total };
  };

  const getOverallStats = () => {
    const total = features.length;
    
    // 计算每个网络的启用率，然后求平均
    let totalEnabledRate = 0;
    let validNetworks = 0;
    
    networks.forEach(network => {
      const stats = getStatsForNetwork(network.id);
      if (stats.total > 0) {
        totalEnabledRate += (stats.enabled / stats.total) * 100;
        validNetworks++;
      }
    });

    const averageEnabled = validNetworks > 0 ? Math.round(totalEnabledRate / validNetworks) : 0;

    return {
      total,
      averageEnabled,
      networksCount: networks.length
    };
  };

  const renderNetworkStats = (networkId: NetworkType) => {
    const stats = getStatsForNetwork(networkId);
    const network = networks.find(n => n.id === networkId)!;
    const enabledPercentage = stats.total > 0 ? Math.round((stats.enabled / stats.total) * 100) : 0;

    return (
      <div key={networkId} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn(
            'text-lg font-semibold',
            getNetworkColor(networkId).split(' ')[0]
          )}>
            {network.name}
          </h3>
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            getNetworkColor(networkId)
          )}>
            {enabledPercentage}% {t('common.enabled')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.enabled}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.enabled')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.disabled}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.disabled')}</div>
          </div>
        </div>

        {stats.pending > 0 && (
          <div className="text-center mb-4">
            <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.pending')}</div>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${enabledPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  const renderOverallStats = () => {
    const stats = getOverallStats();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('common.featureList')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                已知功能映射
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-aptos-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">平均启用率</p>
              <p className="text-2xl font-bold text-aptos-600">{stats.averageEnabled}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                跨 {stats.networksCount} 个网络
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-aptos-600" />
          </div>
        </div>
      </div>
    );
  };

  if (selectedNetwork) {
    return (
      <div className="mb-6">
        {renderNetworkStats(selectedNetwork)}
      </div>
    );
  }

  return (
    <div className="mb-6">
      {renderOverallStats()}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {networks.map(network => renderNetworkStats(network.id))}
      </div>
    </div>
  );
};

export default FeatureStats;