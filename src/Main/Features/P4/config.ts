/**
 * P4 Configuration Module
 *
 * Manages configuration for P4 connection settings.
 */

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
