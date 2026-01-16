/**
 * Server configuration stored in electron-store
 */
export interface ServerConfig {
  id: string;
  name: string;
  p4port: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new server
 */
export interface CreateServerInput {
  name: string;
  p4port: string;
  description?: string;
}

/**
 * Input for updating an existing server
 */
export interface UpdateServerInput {
  id: string;
  name?: string;
  p4port?: string;
  description?: string;
}

/**
 * Result of a connection test
 */
export interface ConnectionTestResult {
  success: boolean;
  serverInfo?: {
    serverVersion: string;
    serverAddress: string;
    serverRoot?: string;
    serverDate?: string;
    serverUptime?: string;
    serverLicense?: string;
  };
  error?: string;
  responseTime?: number;
}

/**
 * Server API interface exposed to renderer
 */
export interface ServerAPI {
  getServers: () => Promise<ServerConfig[]>;
  getServer: (id: string) => Promise<ServerConfig | null>;
  addServer: (input: CreateServerInput) => Promise<ServerConfig>;
  updateServer: (input: UpdateServerInput) => Promise<ServerConfig>;
  removeServer: (id: string) => Promise<boolean>;
  testConnection: (p4port: string) => Promise<ConnectionTestResult>;
}

declare global {
  interface Window {
    serverAPI: ServerAPI;
  }
}

export {};
