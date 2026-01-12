/**
 * Represents a single Perforce changelist
 */
export interface ChangelistInfo {
  id: number;
  user: string;
  client: string;
  date: Date;
  description: string;
  status: "submitted" | "pending";
}

/**
 * Options for fetching submitted changes
 */
export interface GetSubmittedChangesOptions {
  /** -m flag: limit number of results */
  maxCount?: number;
  /** Filter by depot path, e.g. //depot/... */
  depotPath?: string;
}

/**
 * Options for fetching pending changes
 */
export interface GetPendingChangesOptions {
  /** -u flag: filter by user, defaults to current user */
  user?: string;
}

/**
 * Result wrapper for P4 operations
 */
export interface P4Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}
