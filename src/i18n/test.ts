import i18n from './index';

// 测试翻译功能
export const testTranslations = () => {
  console.log('Testing translations...');
  
  // 测试英文
  i18n.changeLanguage('en');
  console.log('English:', {
    title: i18n.t('app.title'),
    refresh: i18n.t('common.refresh'),
    enabled: i18n.t('common.enabled'),
    disabled: i18n.t('common.disabled')
  });
  
  // 测试中文
  i18n.changeLanguage('zh');
  console.log('中文:', {
    title: i18n.t('app.title'),
    refresh: i18n.t('common.refresh'),
    enabled: i18n.t('common.enabled'),
    disabled: i18n.t('common.disabled')
  });
  
  // 测试插值
  console.log('Interpolation test:', i18n.t('common.filteredResults', { filtered: 5, total: 10 }));
};

// 在开发环境下运行测试
if (import.meta.env.DEV) {
  setTimeout(() => {
    testTranslations();
  }, 1000);
} 