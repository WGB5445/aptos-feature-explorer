# Aptos Feature Explorer | Aptos 功能探索器

A beautiful web application to explore and track Aptos blockchain feature enablement status across different networks. Real-time feature status retrieval based on bitmap technology, supporting detailed information display for 96+ known features.

一个美观的Web应用程序，用于探索和跟踪Aptos区块链网络中的功能启用状态。基于位图技术实时获取功能状态，支持96个已知功能的详细信息展示。

## ✨ Features | 功能特性

- 🚀 **Real-time Feature Tracking | 实时功能跟踪** - View feature enablement status across mainnet, testnet, and devnet using bitmap technology | 基于位图技术查看主网、测试网和开发网上各项功能的启用情况
- 📊 **Statistics Overview | 统计概览** - Clear data visualization for feature enablement rates and distribution | 清晰的数据可视化，了解功能启用率和分布
- 🔍 **Smart Search | 智能搜索** - Quickly find features by name, description, category, or ID | 通过名称、描述、分类或ID快速查找功能
- 🏷️ **Category Filtering | 分类筛选** - Filter by feature categories (consensus, VM, crypto, accounts, etc.) | 按功能分类（共识、VM、密码学、账户等）过滤
- 🌐 **Multi-language Support | 多语言支持** - Supports Chinese and English interfaces | 支持中文和英文界面
- 📱 **Responsive Design | 响应式设计** - Perfect adaptation for desktop and mobile | 完美适配桌面端和移动端
- 🌙 **Dark Mode | 深色模式** - Supports light and dark themes | 支持明亮和深色主题
- ⚡ **Performance Optimized | 性能优化** - Fast loading and smooth user experience | 快速加载和流畅的用户体验

## 🎯 Feature Categories | 功能分类

- **Consensus | 共识机制** - Consensus algorithms and validator-related features | 共识算法和验证器相关功能
- **Move VM** - Move virtual machine and execution engine features | Move虚拟机和执行引擎功能
- **Cryptography | 密码学** - Encryption algorithms and digital signature features | 加密算法和数字签名功能
- **Account System | 账户系统** - Account abstraction and multi-signature features | 账户抽象和多签功能
- **Asset Management | 资产管理** - Token and asset-related features | 代币和资产相关功能
- **Storage Optimization | 存储优化** - State storage and data structure optimization | 状态存储和数据结构优化
- **Governance | 治理机制** - On-chain governance and proposal features | 链上治理和提案功能
- **Other Features | 其他功能** - Other infrastructure features | 其他基础设施功能

## 🌐 Supported Networks | 支持的网络

- **Mainnet** - Aptos main network | Aptos主网络
- **Testnet** - Aptos test network | Aptos测试网络
- **Devnet** - Aptos development network | Aptos开发网络

## 🚀 Quick Start | 快速开始

### Prerequisites | 前提条件

- Node.js 18+
- pnpm

### Install Dependencies | 安装依赖

```bash
pnpm install
```

### Start Development Server | 启动开发服务器

```bash
pnpm dev
```

The application will start at `http://localhost:5173` | 应用将在 `http://localhost:5173` 启动。

### Build for Production | 构建生产版本

```bash
pnpm build
```

### Preview Production Build | 预览生产版本

```bash
pnpm preview
```

### GitHub Pages Deployment | GitHub Pages部署

The project is configured for automatic deployment to GitHub Pages | 项目已配置自动部署到GitHub Pages：

1. **Auto Deployment | 自动部署**: Triggered automatically when code is pushed to `main` branch | 当代码推送到`main`分支时自动触发部署
2. **Manual Deployment | 手动部署**: Can be manually triggered from GitHub Actions page | 在GitHub仓库的Actions页面可以手动触发部署  
3. **Access URL | 访问地址**: `https://[username].github.io/aptos-feature-explorer/` | `https://[用户名].github.io/aptos-feature-explorer/`

#### Deployment Steps | 部署步骤

1. Fork or clone this repository | Fork或Clone此仓库
2. Push code to `main` branch | 推送代码到`main`分支
3. Enable Pages in repository settings | 在GitHub仓库设置中启用Pages功能：
   - Go to Settings → Pages | 进入 Settings → Pages
   - Select "GitHub Actions" as Source | Source选择 "GitHub Actions"
4. Wait for GitHub Action to complete deployment | 等待GitHub Action完成部署

#### Local Testing for GitHub Pages Build | 本地测试GitHub Pages构建

```bash
# Build production version with GitHub Pages path | 构建生产版本（带GitHub Pages路径）
pnpm build:github

# Preview build result | 预览构建结果
pnpm preview
```

## 🏗️ Project Structure | 项目结构

```
src/
├── components/              # React组件
│   ├── FeatureCard.tsx         # 功能卡片组件
│   ├── FeatureFilters.tsx      # 筛选器组件
│   ├── FeatureStats.tsx        # 统计组件
│   ├── NetworkSwitcher.tsx     # 网络切换器
│   ├── SearchBar.tsx           # 搜索栏
│   ├── LoadingSpinner.tsx      # 加载动画
│   └── LanguageSwitcher.tsx    # 语言切换器
├── data/                   # 数据和API
│   └── aptosApi.ts            # Aptos API和功能映射
├── i18n/                   # 国际化
│   ├── index.ts               # i18n配置
│   └── locales/               # 语言文件
│       ├── en.json            # 英文翻译
│       └── zh.json            # 中文翻译
├── types/                  # TypeScript类型定义
│   └── feature.ts             # 功能相关类型
├── utils/                  # 工具函数
│   ├── helpers.ts             # 辅助函数
│   └── featureBitmap.ts       # 位图操作工具
└── App.tsx                # 主应用组件
```

## 🔧 Tech Stack | 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库
- **react-i18next** - 国际化
- **clsx** - 条件类名工具

## 📡 API Design | API设计

The application connects directly to Aptos official APIs and uses bitmap technology for real-time feature status retrieval | 应用直接连接Aptos官方API，基于位图技术实时获取功能状态：

```typescript
// 获取所有功能（基于位图）
const features = await getFeatures();

// 按ID获取功能
const feature = await getFeatureById("42");

// 按分类获取功能
const features = await getFeaturesByCategory('crypto');

// 按网络获取功能
const features = await getFeaturesByNetwork('mainnet');

// 检查特定功能状态
const status = await checkFeatureStatus('testnet', 42);

// 获取分类列表
const categories = await getCategories();

// 获取网络列表
const networks = await getNetworks();
```

### Bitmap Technology | 位图技术

The application uses Aptos Feature Bitmap for efficient feature status retrieval | 应用使用Aptos的功能位图（Feature Bitmap）来高效获取功能状态：

```typescript
// 从hex字符串创建位图
const features = createFeaturesFromHex("0xaeffffffff5fbedfe5f7e76f");

// 检查功能是否启用
const enabled = isEnabled(features, 42);

// 获取所有启用的功能ID
const enabledFeatures = getEnabledFeatures(features);
```

## 🎨 Custom Styling | 自定义样式

The project uses Tailwind CSS with custom Aptos theme colors | 项目使用Tailwind CSS，并包含了自定义的Aptos主题色彩：

```css
/* Aptos Theme Colors | Aptos主题色 */
.text-aptos-600 { color: #0284c7; }
.bg-aptos-600 { background-color: #0284c7; }
```

## 📱 Responsive Design | 响应式设计

- **Mobile | 移动端** - Single column layout with touch-friendly interactions | 单列布局，触控友好的交互
- **Tablet | 平板** - Two-column layout with optimized spacing | 双列布局，优化的间距  
- **Desktop | 桌面端** - Three-column layout maximizing information density | 三列布局，最大化信息密度

## 🔮 Future Features | 未来功能

- [x] ~~Connect to real Aptos node APIs | 连接到真实的Aptos节点API~~ ✅ Completed | 已完成
- [x] ~~Real-time feature status updates | 实时功能状态更新~~ ✅ Completed (bitmap-based) | 已完成（基于位图）
- [ ] Feature change history | 功能变更历史记录
- [ ] Detailed feature information and documentation links | 功能详细信息和文档链接
- [ ] Email/push notification subscriptions | 邮件/推送通知订阅
- [ ] Custom dashboard | 自定义仪表板
- [ ] Data export functionality | 导出数据功能
- [ ] More language support | 更多语言支持
- [ ] Feature comparison view | 功能对比视图

## 🤝 Contributing | 贡献

Issues and Pull Requests are welcome! | 欢迎提交Issue和Pull Request！

## 📄 License | 许可证

MIT License

## 🔗 Related Links | 相关链接

- [Aptos Official Website | Aptos官网](https://aptos.dev)
- [Aptos Documentation | Aptos文档](https://aptos.dev/docs)
- [Aptos GitHub](https://github.com/aptos-labs)
