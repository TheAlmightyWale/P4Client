/**
 * P4 Configuration Module
 *
 * Manages configuration for P4 connection settings.
 */

import { getProvider } from "./factory";

export interface P4Config {
  /**
   * P4 connection settings
   */
  port?: string; // P4PORT
  user?: string; // P4USER
  client?: string; // P4CLIENT
  password?: string; // P4PASSWD
}

// Default configuration
const defaultConfig: P4Config = {
  // Connection settings default to environment variables
};

let currentConfig: P4Config = { ...defaultConfig };

/**
 * Gets the current P4 configuration
 */
export function getP4Config(): P4Config {
  return { ...currentConfig };
}

/**
 * Updates the P4 configuration
 * @param config - Partial configuration to merge with current config
 */
export function setP4Config(config: Partial<P4Config>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Resets configuration to defaults
 */
export function resetP4Config(): void {
  currentConfig = { ...defaultConfig };
}

/**
 * Resolves a P4 environment variable by checking multiple sources in order:
 *
 * 1. Process environment (`process.env[varName]`)
 * 2. `p4 set` output (registry/config file values)
 * 3. Provided default value
 *
 * @param varName - The P4 variable name (e.g., "P4PORT", "P4USER", "P4CLIENT")
 * @param defaultValue - Optional fallback if not found in any source
 * @returns The resolved value, or undefined if not found anywhere
 */
export async function resolveP4EnvVar(
  varName: string,
  defaultValue?: string,
): Promise<string | undefined> {
  // 1. Check process environment
  const envValue = process.env[varName];
  if (envValue) {
    return envValue;
  }

  // 2. Check p4 set output
  try {
    const provider = getProvider();
    const result = await provider.getSet();
    if (result.success && result.data?.[varName]) {
      return result.data[varName];
    }
  } catch {
    // p4 set failed — continue with default
  }

  // 3. Fall back to default
  return defaultValue;
}
