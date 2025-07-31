import React from 'react';
import type { NetworkType } from '../types/feature';
import { networks } from '../data/aptosApi';
import { cn } from '../utils/helpers';
import { Globe } from 'lucide-react';

interface NetworkSwitcherProps {
  selectedNetwork: NetworkType | null;
  onNetworkChange: (network: NetworkType | null) => void;
}

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  selectedNetwork,
  onNetworkChange,
}) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Globe className="w-4 h-4" />
        <span>网络选择</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onNetworkChange(null)}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
            selectedNetwork === null
              ? 'bg-aptos-600 text-white shadow-md border-aptos-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
          )}
        >
          全部网络
        </button>
        
        {networks.map((network) => {
          const isSelected = selectedNetwork === network.id;
          
          // 为每个网络定义清晰的选中状态颜色
          const getSelectedColors = (networkId: NetworkType) => {
            switch (networkId) {
              case 'mainnet':
                return 'bg-blue-600 text-white shadow-md border-blue-700';
              case 'testnet':
                return 'bg-green-600 text-white shadow-md border-green-700';
              case 'devnet':
                return 'bg-yellow-600 text-white shadow-md border-yellow-700';
              default:
                return 'bg-gray-600 text-white shadow-md border-gray-700';
            }
          };
          
          return (
            <button
              key={network.id}
              onClick={() => onNetworkChange(network.id)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
                isSelected
                  ? getSelectedColors(network.id)
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
              )}
            >
              {network.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkSwitcher;