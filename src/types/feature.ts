export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

export type FeatureStatus = 'enabled' | 'disabled' | 'unknown';

// Aptos API 返回的原始数据结构
export interface AptosFunction {
  name: string;
  visibility: string;
  is_entry: boolean;
  is_view: boolean;
  generic_type_params: any[];
  params: string[];
  return: string[];
}

export interface AptosModuleABI {
  address: string;
  name: string;
  friends: string[];
  exposed_functions: AptosFunction[];
  structs: any[];
}

export interface AptosModuleResponse {
  bytecode: string;
  abi: AptosModuleABI;
}

// 处理后的功能数据结构
export interface Feature {
  id: string; // 使用函数名作为ID
  name: string; // 格式化后的显示名称
  description: string; // 自动生成的描述
  category: string; // 根据函数名推断的分类
  function_name: string; // 原始函数名
  status: Record<NetworkType, FeatureStatus>;
  last_updated: string; // ISO date string
  notes?: string; // 备注信息
  additional_info?: Record<string, string>; // 额外的键值对信息
}

export interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface NetworkInfo {
  id: NetworkType;
  name: string;
  description: string;
  color: string;
  rpc_url: string;
}