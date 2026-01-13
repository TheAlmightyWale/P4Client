/**
 * P4 Configuration Module
 *
 * Manages configuration for P4 providers including the flag to switch
 * between native API and CLI backends.
 */

export interface P4Config {
  /**
   * Use native p4api instead of CLI
   * Default: true (use native API)
   * Set to false to fall back to CLI
   */
  useNativeApi: boolean;

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
  useNativeApi: true,
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
 * Checks if native API should be used
 */
export function useNativeApi(): boolean {
  return currentConfig.useNativeApi;
}

/**
 * Resets configuration to defaults
 */
export function resetP4Config(): void {
  currentConfig = { ...defaultConfig };
}
