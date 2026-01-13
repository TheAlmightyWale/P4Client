/**
 * P4 Provider Factory
 *
 * Creates and manages the P4 provider instance based on configuration.
 * Supports automatic fallback from API to CLI if API initialization fails.
 */

import { useNativeApi } from "./config";
import type { P4Provider } from "./types";
import { CliProvider } from "./providers/cli";
import { ApiProvider } from "./providers/api";

let provider: P4Provider | null = null;

/**
 * Gets the current P4 provider instance.
 * Creates a new provider if one doesn't exist.
 */
export function getProvider(): P4Provider {
  if (!provider) {
    provider = createProvider();
  }
  return provider;
}

/**
 * Creates a new provider based on configuration.
 * Falls back to CLI if API initialization fails.
 */
function createProvider(): P4Provider {
  if (useNativeApi()) {
    try {
      return new ApiProvider();
    } catch (error) {
      console.warn("Failed to initialize p4api, falling back to CLI:", error);
      return new CliProvider();
    }
  }
  return new CliProvider();
}

/**
 * Resets the provider instance.
 * Useful for testing or when configuration changes.
 */
export async function resetProvider(): Promise<void> {
  if (provider?.dispose) {
    await provider.dispose();
  }
  provider = null;
}
