import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Feature, NetworkType } from '../types/feature';
import { 
  getStatusColor, 
  getStatusIcon, 
  getNetworkColor, 
  getCategoryColor, 
  formatDate,
  cn 
} from '../utils/helpers';
import { networks } from '../data/aptosApi';
import { ExternalLink, Clock, Tag, Hash } from 'lucide-react';

interface FeatureCardProps {
  feature: Feature;
  selectedNetwork: NetworkType | null;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, selectedNetwork }) => {
  const { t } = useTranslation();
  const getNetworksToShow = () => {
    if (selectedNetwork) {
      return networks.filter(network => network.id === selectedNetwork);
    }
    return networks;
  };

  const networksToShow = getNetworksToShow();

  return (
    <div className="feature-card p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={cn(
              'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
              getCategoryColor(feature.category)
            )}>
              <Tag className="w-3 h-3 mr-1" />
              {feature.category}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <Hash className="w-3 h-3 mr-1" />
              {feature.id}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 break-words">
            {feature.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Network Status */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('common.networkStatus')}
        </h4>
        <div className="space-y-2">
          {networksToShow.map((network) => {
            const status = feature.status[network.id];
            
            return (
              <div
                key={network.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getNetworkColor(network.id)
                  )}>
                    {network.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-base">{getStatusIcon(status)}</span>
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                    getStatusColor(status)
                  )}>
                    {status === 'enabled' ? t('common.enabled') : 
                     status === 'disabled' ? t('common.disabled') : t('common.pending')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Show placeholder for enabled time (data not available from API) */}
        {!selectedNetwork && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{t('common.enabledTimeUnknown')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            函数名: {feature.function_name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t('common.updated')}: {formatDate(feature.last_updated)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <a
            href={`https://github.com/aptos-labs/aptos-core/search?q=${feature.function_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-aptos-600 hover:text-aptos-700 dark:text-aptos-400 dark:hover:text-aptos-300"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            GitHub
          </a>
          <a
            href={`https://aptos.dev/move/move-on-aptos/cli`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-aptos-600 hover:text-aptos-700 dark:text-aptos-400 dark:hover:text-aptos-300"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            {t('common.documentation')}
          </a>
        </div>
      </div>

      {/* Notes and Additional Information */}
      {(feature.notes || feature.additional_info) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {feature.notes && (
            <div className="mb-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-2.5">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-900 dark:text-blue-100 font-medium mb-1">
                      💡 {t('common.notes')}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      {feature.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {feature.additional_info && Object.keys(feature.additional_info).length > 0 && (
            <div>
              <h6 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 flex items-center">
                <span className="mr-1">📊</span>
                {t('common.additionalInfo')}
              </h6>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(feature.additional_info).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400 truncate mr-1">{key}</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium shrink-0">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeatureCard;