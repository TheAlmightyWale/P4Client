/**
 * P4 Feature Module
 *
 * Public API for Perforce operations. Uses the CLI provider for all
 * Perforce interactions.
 */

import { getProvider } from "./factory";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../shared/types/p4";

// Re-export types for external use
export * from "../../../shared/types/p4";

// Re-export configuration functions
export { getP4Config, setP4Config, resetP4Config } from "./config";

// Re-export factory functions for advanced use
export { resetProvider } from "./factory";

/**
 * Fetches submitted changelists from Perforce
 */
export async function getSubmittedChanges(
  options: GetSubmittedChangesOptions = {}
): Promise<P4Result<ChangelistInfo[]>> {
  return getProvider().getSubmittedChanges(options);
}

/**
 * Fetches pending changelists for a user
 */
export async function getPendingChanges(
  options: GetPendingChangesOptions = {}
): Promise<P4Result<ChangelistInfo[]>> {
  return getProvider().getPendingChanges(options);
}

/**
 * Gets the current Perforce user
 */
export async function getCurrentUser(): Promise<P4Result<string>> {
  return getProvider().getCurrentUser();
}
