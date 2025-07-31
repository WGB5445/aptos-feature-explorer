import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Feature, NetworkType, FeatureStatus } from './types/feature';
import { getFeatures } from './data/aptosApi';
import FeatureCard from './components/FeatureCard';
import NetworkSwitcher from './components/NetworkSwitcher';
import FeatureFilters from './components/FeatureFilters';
import SearchBar from './components/SearchBar';
import FeatureStats from './components/FeatureStats';
import LoadingSpinner from './components/LoadingSpinner';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Github, ExternalLink, Zap, RefreshCw } from 'lucide-react';

function App() {
  const { t } = useTranslation();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FeatureStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load features
  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const featuresData = await getFeatures();
      setFeatures(featuresData);
    } catch (err) {
      setError(t('common.loadError'));
      console.error('Error loading features:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter features
  const filteredFeatures = features.filter(feature => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        feature.name.toLowerCase().includes(searchLower) ||
        feature.description.toLowerCase().includes(searchLower) ||
        feature.category.toLowerCase().includes(searchLower) ||
        feature.function_name.toLowerCase().includes(searchLower) ||
        feature.id.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory && feature.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus) {
      if (selectedNetwork) {
        // If network is selected, check status for that network
        return feature.status[selectedNetwork] === selectedStatus;
      } else {
        // If no network selected, check if any network has the selected status
        return Object.values(feature.status).includes(selectedStatus);
      }
    }

    // Network filter (if no status filter, show all features for selected network)
    if (selectedNetwork && !selectedStatus) {
      return true; // Show all features when network is selected (status shown in card)
    }

    return true;
  });

  const handleRefresh = () => {
    loadFeatures();
  };

  const clearAllFilters = () => {
    setSelectedNetwork(null);
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSearchTerm('');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('common.loadingData')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-medium">
            {error}
          </div>
          <button
            onClick={handleRefresh}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('common.retry')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-aptos-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('app.title')}
                </h1>
              </div>
              <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-aptos-100 text-aptos-800 dark:bg-aptos-900 dark:text-aptos-200">
                {t('app.version')}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={handleRefresh}
                className="btn-secondary inline-flex items-center space-x-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t('common.refresh')}</span>
              </button>
              
              <a
                href="https://github.com/aptos-labs/aptos-core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Description */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {t('app.description')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t('app.subDescription')}
          </p>
        </div>

        {/* Stats Overview */}
        <FeatureStats features={filteredFeatures} selectedNetwork={selectedNetwork} />

        {/* Filters Section */}
        <div className="mb-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('common.searchAndFilter')}
              </h2>
              {(selectedNetwork || selectedCategory || selectedStatus || searchTerm) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-aptos-600 hover:text-aptos-700 dark:text-aptos-400 dark:hover:text-aptos-300"
                >
                  {t('common.clearAll')}
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NetworkSwitcher
                  selectedNetwork={selectedNetwork}
                  onNetworkChange={setSelectedNetwork}
                />
                
                <div className="space-y-6">
                  <FeatureFilters
                    selectedCategory={selectedCategory}
                    selectedStatus={selectedStatus}
                    onCategoryChange={setSelectedCategory}
                    onStatusChange={setSelectedStatus}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.featureList')} ({filteredFeatures.length})
          </h2>
          
          {filteredFeatures.length !== features.length && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.filteredResults', { filtered: filteredFeatures.length, total: features.length })}
            </span>
          )}
        </div>

        {/* Feature Grid */}
        {filteredFeatures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('common.noResults')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('common.noResultsDescription')}
            </p>
            <button
              onClick={clearAllFilters}
              className="btn-primary"
            >
              {t('common.clearAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                selectedNetwork={selectedNetwork}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('footer.copyright')}
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://aptos.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-aptos-600 hover:text-aptos-700 dark:text-aptos-400 dark:hover:text-aptos-300"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              {t('footer.aptosDocs')}
            </a>
            <a
              href="https://github.com/aptos-labs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-aptos-600 hover:text-aptos-700 dark:text-aptos-400 dark:hover:text-aptos-300"
            >
              <Github className="w-4 h-4 mr-1" />
              {t('footer.github')}
            </a>
          </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
