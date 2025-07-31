import type { 
  Feature, 
  FeatureCategory, 
  NetworkInfo, 
  NetworkType, 
  FeatureStatus
} from '../types/feature';
import { isEnabled, createFeaturesFromHex, getEnabledFeatures, analyzeFeatureHex } from '../utils/featureBitmap';

export const networks: NetworkInfo[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    description: 'Aptos主网络',
    color: 'blue',
    rpc_url: 'https://api.mainnet.aptoslabs.com/v1'
  },
  {
    id: 'testnet', 
    name: 'Testnet',
    description: 'Aptos测试网络',
    color: 'green',
    rpc_url: 'https://api.testnet.aptoslabs.com/v1'
  },
  {
    id: 'devnet',
    name: 'Devnet',
    description: 'Aptos开发网络',
    color: 'yellow',
    rpc_url: 'https://api.devnet.aptoslabs.com/v1'
  }
];

export const categories: FeatureCategory[] = [
  {
    id: 'consensus',
    name: '共识机制',
    description: '共识算法和网络协议相关功能',
    color: 'red'
  },
  {
    id: 'vm',
    name: 'Move VM',
    description: 'Move虚拟机和执行引擎功能',
    color: 'purple'
  },
  {
    id: 'crypto',
    name: '密码学',
    description: '加密算法和数字签名功能',
    color: 'blue'
  },
  {
    id: 'account',
    name: '账户系统',
    description: '账户抽象和多签功能',
    color: 'green'
  },
  {
    id: 'asset',
    name: '资产管理',
    description: '代币和资产相关功能',
    color: 'orange'
  },
  {
    id: 'storage',
    name: '存储优化',
    description: '状态存储和数据结构优化',
    color: 'yellow'
  },
  {
    id: 'governance',
    name: '治理机制',
    description: '链上治理和提案功能',
    color: 'indigo'
  },
  {
    id: 'other',
    name: '其他功能',
    description: '其他基础设施功能',
    color: 'gray'
  }
];

// Feature ID 到名称的映射表 (基于 aptos-core/framework/features.move)
const FEATURE_NAMES: Record<number, {
  name: string;
  description: string;
  category: string;
}> = {
  1: { name: 'Code Dependency Check', description: '代码依赖检查', category: 'vm' },
  2: { name: 'Treat Friend as Private', description: '将friend函数视为私有', category: 'vm' },
  3: { name: 'SHA-512 and RIPEMD-160 Natives', description: 'SHA-512和RIPEMD-160原生支持', category: 'crypto' },
  4: { name: 'Aptos Stdlib Chain ID Natives', description: 'Aptos标准库链ID原生支持', category: 'other' },
  5: { name: 'VM Binary Format V6', description: 'VM二进制格式V6', category: 'vm' },
  7: { name: 'Multi Ed25519 PK Validate V2', description: '多Ed25519公钥验证V2', category: 'crypto' },
  8: { name: 'Blake2b-256 Native', description: 'Blake2b-256原生支持', category: 'crypto' },
  9: { name: 'Resource Groups', description: '资源组', category: 'storage' },
  10: { name: 'Multisig Accounts', description: '多重签名账户', category: 'account' },
  11: { name: 'Delegation Pools', description: '委托池', category: 'governance' },
  12: { name: 'Cryptography Algebra Natives', description: '密码学代数原生支持', category: 'crypto' },
  13: { name: 'BLS12-381 Structures', description: 'BLS12-381数据结构', category: 'crypto' },
  15: { name: 'Struct Constructors', description: '结构体构造器', category: 'vm' },
  16: { name: 'Periodical Reward Rate Decrease', description: '定期奖励率递减', category: 'governance' },
  17: { name: 'Partial Governance Voting', description: '部分治理投票', category: 'governance' },
  20: { name: 'Charge Invariant Violation', description: '不变量违反收费', category: 'vm' },
  21: { name: 'Delegation Pool Partial Governance Voting', description: '委托池部分治理投票', category: 'governance' },
  22: { name: 'Fee Payer Enabled', description: 'Gas付费者功能', category: 'account' },
  23: { name: 'Aptos Unique Identifiers', description: 'Aptos唯一标识符', category: 'other' },
  24: { name: 'Bulletproofs Natives', description: 'Bulletproofs原生支持', category: 'crypto' },
  25: { name: 'Signer Native Format Fix', description: '签名者原生格式修复', category: 'account' },
  26: { name: 'Module Event', description: '模块事件', category: 'vm' },
  31: { name: 'Safer Resource Groups', description: '更安全的资源组', category: 'storage' },
  32: { name: 'Safer Metadata', description: '更安全的元数据', category: 'storage' },
  33: { name: 'Single Sender Authenticator', description: '单发送者认证器', category: 'account' },
  34: { name: 'Sponsored Automatic Account Creation', description: '赞助自动账户创建', category: 'account' },
  35: { name: 'Fee Payer Account Optional', description: '可选费用付费账户', category: 'account' },
  38: { name: 'Limit Max Identifier Length', description: '限制最大标识符长度', category: 'vm' },
  39: { name: 'Operator Beneficiary Change', description: '操作员受益人变更', category: 'governance' },
  40: { name: 'VM Binary Format V7', description: 'VM二进制格式V7', category: 'vm' },
  42: { name: 'Commission Change Delegation Pool', description: '委托池佣金变更', category: 'governance' },
  43: { name: 'BN254 Structures', description: 'BN254数据结构', category: 'crypto' },
  45: { name: 'Reconfigure with DKG', description: 'DKG重新配置', category: 'consensus' },
  46: { name: 'Keyless Accounts', description: '无密钥账户', category: 'account' },
  47: { name: 'Keyless but ZKless Accounts', description: '无密钥但非零知识账户', category: 'account' },
  49: { name: 'JWK Consensus', description: 'JWK共识', category: 'consensus' },
  50: { name: 'Concurrent Fungible Assets', description: '并发可替代资产', category: 'asset' },
  52: { name: 'Object Code Deployment', description: '对象代码部署', category: 'storage' },
  53: { name: 'Max Object Nesting Check', description: '最大对象嵌套检查', category: 'storage' },
  54: { name: 'Keyless Accounts with Passkeys', description: '支持Passkey的无密钥账户', category: 'account' },
  55: { name: 'Multisig V2 Enhancement', description: '多重签名V2增强', category: 'account' },
  56: { name: 'Delegation Pool Allowlisting', description: '委托池白名单', category: 'governance' },
  57: { name: 'Module Event Migration', description: '模块事件迁移', category: 'vm' },
  59: { name: 'Transaction Context Extension', description: '交易上下文扩展', category: 'vm' },
  60: { name: 'Coin to Fungible Asset Migration', description: '代币到可替代资产迁移', category: 'asset' },
  62: { name: 'Object Native Derived Address', description: '对象原生派生地址', category: 'storage' },
  63: { name: 'Dispatchable Fungible Asset', description: '可调度可替代资产', category: 'asset' },
  64: { name: 'New Accounts Default to FA APT Store', description: '新账户默认FA APT存储', category: 'asset' },
  65: { name: 'Operations Default to FA APT Store', description: '操作默认FA APT存储', category: 'asset' },
  66: { name: 'Aggregator V2 Is At Least API', description: '聚合器V2至少API', category: 'vm' },
  67: { name: 'Concurrent Fungible Balance', description: '并发可替代余额', category: 'asset' },
  68: { name: 'Default to Concurrent Fungible Balance', description: '默认并发可替代余额', category: 'asset' },
  70: { name: 'Abort If Multisig Payload Mismatch', description: '多签负载不匹配时中止', category: 'account' },
  78: { name: 'Transaction Simulation Enhancement', description: '交易模拟增强', category: 'vm' },
  79: { name: 'Collection Owner', description: '集合所有者', category: 'storage' },
  80: { name: 'Native Memory Operations', description: '原生内存操作', category: 'vm' },
  84: { name: 'Permissioned Signer', description: '权限签名者', category: 'account' },
  85: { name: 'Account Abstraction', description: '账户抽象', category: 'account' },
  87: { name: 'Bulletproofs Batch Natives', description: 'Bulletproofs批量原生支持', category: 'crypto' },
  88: { name: 'Derivable Account Abstraction', description: '可派生账户抽象', category: 'account' },
  90: { name: 'New Accounts Default to FA Store', description: '新账户默认FA存储', category: 'asset' },
  91: { name: 'Default Account Resource', description: '默认账户资源', category: 'account' },
  92: { name: 'JWK Consensus Per Key Mode', description: 'JWK共识按密钥模式', category: 'consensus' },
  94: { name: 'Orderless Transactions', description: '无序交易', category: 'vm' }
};



// 导出用于测试的函数
export const getNetworkFeaturesMap = async (): Promise<Record<string, any>> => {
  const networkFeaturesPromises = networks.map(async (network) => {
    const features = await getNetworkFeatures(network.id);
    return { 
      network: network.id, 
      features,
      analysis: features ? analyzeFeatureHex('0x' + Array.from(features.features).map(byte => byte.toString(16).padStart(2, '0')).join('')) : null
    };
  });

  const results = await Promise.all(networkFeaturesPromises);
  
  const map: Record<string, any> = {};
  results.forEach(({ network, features, analysis }) => {
    map[network] = { features, analysis };
  });
  
  return map;
};

// 获取网络的功能资源状态
async function getNetworkFeatures(network: NetworkType) {
  const networkConfig = networks.find(n => n.id === network);
  if (!networkConfig) {
    return null;
  }

  try {
    const response = await fetch(
      `${networkConfig.rpc_url}/accounts/0x1/resource/0x1::features::Features`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data?.features ? createFeaturesFromHex(result.data.features) : null;
  } catch (error) {
    console.error(`Error fetching features for ${network}:`, error);
    return null;
  }
}

// 检查特定feature ID在网络上是否启用
export async function checkFeatureStatus(network: NetworkType, featureId: number): Promise<FeatureStatus> {
  const features = await getNetworkFeatures(network);
  if (!features) {
    return 'unknown';
  }

  return isEnabled(features, featureId) ? 'enabled' : 'disabled';
}

// 主要的 API 函数：获取所有功能（基于位图）
export const getFeatures = async (): Promise<Feature[]> => {
  try {
    // 获取所有网络的feature状态
    const networkFeaturesPromises = networks.map(async (network) => {
      const features = await getNetworkFeatures(network.id);
      return { network: network.id, features };
    });

    const networkFeatures = await Promise.all(networkFeaturesPromises);
    
    // 找出所有可能的feature ID（从所有网络的已启用feature中）
    const allFeatureIds = new Set<number>();
    
    // 首先添加所有已知的feature ID
    Object.keys(FEATURE_NAMES).forEach(id => allFeatureIds.add(parseInt(id)));
    
    // 然后添加从网络中发现的feature ID
    networkFeatures.forEach(({ features }) => {
      if (features) {
        const enabledIds = getEnabledFeatures(features);
        enabledIds.forEach(id => allFeatureIds.add(id));
      }
    });

    // 为每个feature ID创建Feature对象
    const features: Feature[] = [];
    
    for (const featureId of Array.from(allFeatureIds).sort((a, b) => a - b)) {
      const knownFeature = FEATURE_NAMES[featureId];
      
      const feature: Feature = {
        id: featureId.toString(),
        name: knownFeature ? knownFeature.name : `Feature #${featureId}`,
        description: knownFeature ? knownFeature.description : `Feature #${featureId} - 未知功能`,
        category: knownFeature ? knownFeature.category : 'other',
        function_name: `feature_${featureId}`,
        status: {
          mainnet: 'unknown',
          testnet: 'unknown',
          devnet: 'unknown'
        },
        last_updated: new Date().toISOString()
      };

      // 检查每个网络的状态
      networkFeatures.forEach(({ network, features: networkFeatureData }) => {
        if (networkFeatureData) {
          const isFeatureEnabled = isEnabled(networkFeatureData, featureId);
          feature.status[network as NetworkType] = isFeatureEnabled ? 'enabled' : 'disabled';
        } else {
          feature.status[network as NetworkType] = 'unknown';
        }
      });

      features.push(feature);
    }

    return features;
  } catch (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
};

export const getFeatureById = async (id: string): Promise<Feature | null> => {
  const features = await getFeatures();
  return features.find(feature => feature.id === id) || null;
};

export const getFeaturesByCategory = async (category: string): Promise<Feature[]> => {
  const features = await getFeatures();
  return features.filter(feature => feature.category === category);
};

export const getFeaturesByNetwork = async (network: NetworkType): Promise<Feature[]> => {
  const features = await getFeatures();
  return features.filter(feature => feature.status[network] === 'enabled');
};

export const getCategories = async (): Promise<FeatureCategory[]> => {
  return categories;
};

export const getNetworks = async (): Promise<NetworkInfo[]> => {
  return networks;
};