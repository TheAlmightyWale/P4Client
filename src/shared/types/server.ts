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
 * Stored session data for a logged-in server
 */
export interface ServerSession {
  serverId: string;
  username: string;
  ticket: string;
  loginTime: string;
  expiresAt?: string;
}

/**
 * Login input
 */
export interface LoginInput {
  serverId: string;
  username: string;
  password: string;
}

/**
 * Login result
 */
export interface LoginResult {
  success: boolean;
  needsLogout?: boolean;
  currentServerId?: string;
  user?: string;
  error?: string;
}

/**
 * Logout result
 */
export interface LogoutResult {
  success: boolean;
  error?: string;
}

/**
 * Session status
 */
export interface SessionStatus {
  isLoggedIn: boolean;
  serverId?: string;
  serverName?: string;
  username?: string;
  loginTime?: string;
}

/**
 * Server API interface exposed to renderer
 */
export interface ServerAPI {
  // Server management methods
  getServers: () => Promise<ServerConfig[]>;
  getServer: (id: string) => Promise<ServerConfig | null>;
  addServer: (input: CreateServerInput) => Promise<ServerConfig>;
  updateServer: (input: UpdateServerInput) => Promise<ServerConfig>;
  removeServer: (id: string) => Promise<boolean>;
  testConnection: (p4port: string) => Promise<ConnectionTestResult>;

  // Authentication methods
  login: (input: LoginInput) => Promise<LoginResult>;
  logout: (serverId: string) => Promise<LogoutResult>;
  getSessionStatus: () => Promise<SessionStatus>;
  validateSession: () => Promise<boolean>;
}

declare global {
  interface Window {
    serverAPI: ServerAPI;
  }
}

export {};
