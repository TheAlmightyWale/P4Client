/**
 * P4 Provider Interface
 *
 * Defines the contract that both CLI and API providers must implement.
 */

import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../shared/types/p4";

/**
 * Interface that both CLI and API providers must implement
 */
export interface P4Provider {
  /**
   * Fetches submitted changelists from Perforce
   */
  getSubmittedChanges(
    options?: GetSubmittedChangesOptions
  ): Promise<P4Result<ChangelistInfo[]>>;

  /**
   * Fetches pending changelists for a user
   */
  getPendingChanges(
    options?: GetPendingChangesOptions
  ): Promise<P4Result<ChangelistInfo[]>>;

  /**
   * Gets the current Perforce user
   */
  getCurrentUser(): Promise<P4Result<string>>;

  /**
   * Initialize the provider (e.g., establish connection)
   */
  initialize?(): Promise<void>;

  /**
   * Cleanup resources (e.g., close connection)
   */
  dispose?(): Promise<void>;
}
