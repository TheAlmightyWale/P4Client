/**
 * Shared P4 types used across Main, Preload, and Render processes
 */

/**
 * Represents a single Perforce changelist
 * Note: In Main process, date is a Date object. When serialized over IPC
 * for Render process, it becomes an ISO string.
 */
export interface ChangelistInfo {
  id: number;
  user: string;
  client: string;
  date: Date | string; // Date in Main, ISO string in Render after IPC serialization
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
 * Detailed pending changelist with file lists
 */
export interface PendingChangelistDetail {
  id: number;
  description: string;
  date?: Date | string;
  status: "pending";
  openedFiles: string[];
  shelvedFiles: string[];
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

/**
 * P4 API interface exposed to the renderer process via contextBridge
 */
export interface P4API {
  getSubmittedChanges: (
    options?: GetSubmittedChangesOptions
  ) => Promise<P4Result<ChangelistInfo[]>>;
  getPendingChanges: (
    options?: GetPendingChangesOptions
  ) => Promise<P4Result<ChangelistInfo[]>>;
  getCurrentUser: () => Promise<P4Result<string>>;
  getPendingChangesDetailed: () => Promise<P4Result<PendingChangelistDetail[]>>;
}

// Extend Window interface for p4API
declare global {
  interface Window {
    p4API: P4API;
  }
}

export {};
