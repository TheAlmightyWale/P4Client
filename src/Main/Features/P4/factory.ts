/**
 * P4 Provider Factory
 *
 * Creates and manages the P4 provider instance.
 */

import type { P4Provider } from "./types";
import { CliProvider } from "./providers/cli";

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
 * Creates a new CLI provider.
 */
function createProvider(): P4Provider {
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
