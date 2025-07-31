/**
 * TypeScript implementation of Aptos feature flag bitmap operations
 * Converted from Move code in aptos-core/aptos-move/framework/aptos-framework/sources/features.move
 */

export interface Features {
  features: Uint8Array;
}

/**
 * Check whether the feature is enabled.
 * Equivalent to Move's `is_enabled(feature: u64): bool`
 */
export function isEnabled(features: Features | null, feature: number): boolean {
  if (!features) {
    return false;
  }
  return contains(features.features, feature);
}

/**
 * Helper to include or exclude a feature flag.
 * Equivalent to Move's `set(features: &mut vector<u8>, feature: u64, include: bool)`
 */
export function setFeature(features: Uint8Array, feature: number, include: boolean): Uint8Array {
  const byteIndex = Math.floor(feature / 8);
  const bitMask = 1 << (feature % 8);
  
  // Extend the array if necessary
  const newFeatures = new Uint8Array(Math.max(features.length, byteIndex + 1));
  newFeatures.set(features);
  
  if (include) {
    newFeatures[byteIndex] |= bitMask;
  } else {
    newFeatures[byteIndex] &= (0xff ^ bitMask);
  }
  
  return newFeatures;
}

/**
 * Helper to check whether a feature flag is enabled.
 * Equivalent to Move's `contains(features: &vector<u8>, feature: u64): bool`
 */
export function contains(features: Uint8Array, feature: number): boolean {
  const byteIndex = Math.floor(feature / 8);
  const bitMask = 1 << (feature % 8);
  
  return byteIndex < features.length && (features[byteIndex] & bitMask) !== 0;
}

/**
 * Apply a diff of features to enable and disable.
 * Equivalent to Move's `apply_diff(features: &mut vector<u8>, enable: vector<u64>, disable: vector<u64>)`
 */
export function applyDiff(
  features: Uint8Array, 
  enable: number[], 
  disable: number[]
): Uint8Array {
  let result = new Uint8Array(features);
  
  // Enable features
  enable.forEach(feature => {
    result = setFeature(result, feature, true);
  });
  
  // Disable features
  disable.forEach(feature => {
    result = setFeature(result, feature, false);
  });
  
  return result;
}

/**
 * Create a new empty feature bitmap
 */
export function createEmptyFeatures(): Features {
  return {
    features: new Uint8Array(0)
  };
}

/**
 * Create features from a hex string (as returned by Aptos API)
 */
export function createFeaturesFromHex(hexString: string): Features {
  // Remove '0x' prefix if present
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  
  // Convert hex string to Uint8Array
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  
  return { features: bytes };
}

/**
 * Convert features back to hex string
 */
export function featuresToHex(features: Features): string {
  return '0x' + Array.from(features.features)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get all enabled feature indices from a feature bitmap
 */
export function getEnabledFeatures(features: Features): number[] {
  const enabled: number[] = [];
  
  for (let byteIndex = 0; byteIndex < features.features.length; byteIndex++) {
    const byte = features.features[byteIndex];
    
    for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
      const bitMask = 1 << bitIndex;
      if ((byte & bitMask) !== 0) {
        enabled.push(byteIndex * 8 + bitIndex);
      }
    }
  }
  
  return enabled;
}

/**
 * Create a human-readable representation of the feature bitmap
 */
export function debugFeatures(features: Features): string {
  const enabled = getEnabledFeatures(features);
  return `Features bitmap (${features.features.length} bytes): [${enabled.join(', ')}]`;
}

/**
 * Utility function to test the bitmap operations
 */
export function testFeatureBitmap(): void {
  console.log('Testing feature bitmap operations...');
  
  // Create empty features
  let features = createEmptyFeatures();
  console.log('Empty features:', debugFeatures(features));
  
  // Set some features
  features.features = setFeature(features.features, 5, true);
  features.features = setFeature(features.features, 12, true);
  features.features = setFeature(features.features, 20, true);
  
  console.log('After setting features 5, 12, 20:', debugFeatures(features));
  
  // Test individual checks
  console.log('Feature 5 enabled:', isEnabled(features, 5)); // true
  console.log('Feature 10 enabled:', isEnabled(features, 10)); // false
  console.log('Feature 12 enabled:', isEnabled(features, 12)); // true
  
  // Apply diff
  features.features = applyDiff(features.features, [25, 30], [12]);
  console.log('After applying diff (enable: [25, 30], disable: [12]):', debugFeatures(features));
  
  // Test hex conversion
  const hexString = featuresToHex(features);
  console.log('Hex representation:', hexString);
  
  const featuresFromHex = createFeaturesFromHex(hexString);
  console.log('Recreated from hex:', debugFeatures(featuresFromHex));
}

/**
 * Calculate the total number of features in a feature bitmap
 * This counts both enabled and disabled features based on the bitmap size
 */
export function getTotalFeatureCount(features: Features): number {
  // Each byte can represent 8 features (bits)
  // The total number of features is the number of bytes * 8
  return features.features.length * 8;
}

/**
 * Get detailed statistics about features in a bitmap
 */
export function getFeatureStatistics(features: Features): {
  totalFeatures: number;
  enabledFeatures: number;
  disabledFeatures: number;
  enabledFeatureIds: number[];
  bitmapSize: number;
} {
  const enabledFeatureIds = getEnabledFeatures(features);
  const totalFeatures = getTotalFeatureCount(features);
  
  return {
    totalFeatures,
    enabledFeatures: enabledFeatureIds.length,
    disabledFeatures: totalFeatures - enabledFeatureIds.length,
    enabledFeatureIds,
    bitmapSize: features.features.length
  };
}

/**
 * Analyze a hex string from Aptos API and return feature statistics
 */
export function analyzeFeatureHex(hexString: string): {
  totalFeatures: number;
  enabledFeatures: number;
  disabledFeatures: number;
  enabledFeatureIds: number[];
  bitmapSize: number;
  hexString: string;
} {
  const features = createFeaturesFromHex(hexString);
  const stats = getFeatureStatistics(features);
  
  return {
    ...stats,
    hexString
  };
}

// Export for testing in development
if (import.meta.env.DEV) {
  (window as any).testFeatureBitmap = testFeatureBitmap;
  
  // Test with the actual hex string from the user
  (window as any).analyzeUserHex = () => {
    const userHex = "0xaeffffffff5fbedfe5f7e76f";
    console.log('Analyzing user hex string:', userHex);
    const analysis = analyzeFeatureHex(userHex);
    console.log('Feature Analysis:', analysis);
    console.log('Total features:', analysis.totalFeatures);
    console.log('Enabled features:', analysis.enabledFeatures);
    console.log('Disabled features:', analysis.disabledFeatures);
    console.log('Enabled feature IDs:', analysis.enabledFeatureIds);
  };
}