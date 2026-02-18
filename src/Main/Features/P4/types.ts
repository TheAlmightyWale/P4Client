/**
 * P4 Provider Interface
 *
 * Defines the contract that the P4 provider must implement.
 */

import type {
  ChangelistInfo,
  PendingChangelistDetail,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../shared/types/p4";

/**
 * Server info returned by p4 info command
 */
export interface ServerInfo {
  serverVersion: string;
  serverAddress: string;
  serverRoot?: string;
  serverDate?: string;
  serverUptime?: string;
  serverLicense?: string;
}

/**
 * Login result from p4 login command
 * Note: ticket is no longer returned since it's stored in the ticket file
 */
export interface P4LoginResult {
  success: boolean;
  expiresAt?: string; // Optional - if we can parse it from output
}

/**
 * Ticket information from p4 tickets command
 */
export interface P4TicketInfo {
  host: string; // Server address (p4port)
  user: string; // Username
  ticket: string; // Ticket value
}

/**
 * Interface that the P4 provider must implement
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
   * Run p4 info command against a specific server
   * Used for connection testing
   */
  runInfoCommand(p4port: string): Promise<P4Result<ServerInfo>>;

  /**
   * Login to a Perforce server
   */
  login(
    p4port: string,
    username: string,
    password: string
  ): Promise<P4Result<P4LoginResult>>;

  /**
   * Logout from a Perforce server
   */
  logout(p4port: string, username: string): Promise<P4Result<void>>;

  /**
   * Get P4 configuration variables from `p4 set`
   * Returns a map of variable names to their values
   */
  getSet(): Promise<P4Result<Record<string, string>>>;

  /**
   * Get all valid tickets from the ticket file
   */
  getTickets(): Promise<P4Result<P4TicketInfo[]>>;

  /**
   * Check if a valid ticket exists for a specific server/user
   */
  hasValidTicket(p4port: string, username: string): Promise<boolean>;

  /**
   * Fetches detailed pending changelists with file lists
   */
  getPendingChangesDetailed(): Promise<P4Result<PendingChangelistDetail[]>>;

  /**
   * Initialize the provider (e.g., establish connection)
   */
  initialize?(): Promise<void>;

  /**
   * Cleanup resources (e.g., close connection)
   */
  dispose?(): Promise<void>;
}
