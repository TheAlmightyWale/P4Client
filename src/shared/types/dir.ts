/** Default number of directory levels to fetch per IPC call. */
export const DIR_FETCH_DEPTH = 2;

/**
 * Represents a directory entry returned from the main process.
 * When fetched with depth > 1, `children` contains pre-fetched subdirectories.
 */
export interface DirEntry {
  name: string;
  path: string;
  children?: DirEntry[];
}

/**
 * Options for listing directory contents.
 */
export interface DirListOptions {
  path: string;
  depth?: number;
}

/**
 * Result wrapper for directory operations, matching P4Result pattern.
 */
export interface DirResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * API exposed to renderer for directory operations.
 */
export interface DirAPI {
  getWorkspaceRoot: () => Promise<DirResult<string>>;
  listDirectories: (options: DirListOptions) => Promise<DirResult<DirEntry[]>>;
}

declare global {
  interface Window {
    dirAPI: DirAPI;
  }
}
