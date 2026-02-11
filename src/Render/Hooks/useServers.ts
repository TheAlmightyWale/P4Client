import { useState, useEffect, useCallback } from "react";
import { createUseStore } from "@zubridge/electron";
import type {
  ServerConfig,
  CreateServerInput,
  UpdateServerInput,
  ConnectionTestResult,
  SessionStatus,
  LoginResult,
  LogoutResult,
} from "../../shared/types/server";

const useStore = createUseStore();

// Stable defaults to avoid re-render loops in useEffect dependencies
const EMPTY_SERVERS: ServerConfig[] = [];
const DEFAULT_SESSION: SessionStatus = { isLoggedIn: false };

interface UseServersReturn {
  servers: ServerConfig[];
  loading: boolean;
  error: string | null;
  sessionStatus: SessionStatus;
  refresh: () => Promise<void>;
  addServer: (input: CreateServerInput) => Promise<ServerConfig>;
  updateServer: (input: UpdateServerInput) => Promise<ServerConfig>;
  removeServer: (id: string) => Promise<boolean>;
  testConnection: (p4port: string) => Promise<ConnectionTestResult>;
  login: (
    serverId: string,
    username: string,
    password: string
  ) => Promise<LoginResult>;
  logout: (serverId: string) => Promise<LogoutResult>;
  refreshSession: () => Promise<void>;
}

export function useServers(): UseServersReturn {
  const storeState = useStore();

  // Read initial data from Zubridge store (synced from main process)
  const storeServers =
    (storeState?.servers as ServerConfig[]) || EMPTY_SERVERS;
  const storeSession =
    (storeState?.sessionStatus as SessionStatus) || DEFAULT_SESSION;

  const [servers, setServers] = useState<ServerConfig[]>(storeServers);
  const [loading, setLoading] = useState(storeServers.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] =
    useState<SessionStatus>(storeSession);

  // Sync from store when it updates (e.g., after discovery or mutations)
  useEffect(() => {
    if (storeServers.length > 0) {
      setServers(storeServers);
      setLoading(false);
    }
  }, [storeServers]);

  useEffect(() => {
    setSessionStatus(storeSession);
  }, [storeSession]);

  const fetchServers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.serverAPI.getServers();
      setServers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch servers");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const status = await window.serverAPI.getSessionStatus();
      setSessionStatus(status);
    } catch (err) {
      console.error("Failed to refresh session:", err);
      setSessionStatus({ isLoggedIn: false });
    }
  }, []);

  const addServer = useCallback(async (input: CreateServerInput) => {
    const newServer = await window.serverAPI.addServer(input);
    setServers((prev) => [...prev, newServer]);
    return newServer;
  }, []);

  const updateServer = useCallback(async (input: UpdateServerInput) => {
    const updated = await window.serverAPI.updateServer(input);
    setServers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    return updated;
  }, []);

  const removeServer = useCallback(async (id: string) => {
    const success = await window.serverAPI.removeServer(id);
    if (success) {
      setServers((prev) => prev.filter((s) => s.id !== id));
    }
    return success;
  }, []);

  const testConnection = useCallback(async (p4port: string) => {
    return window.serverAPI.testConnection(p4port);
  }, []);

  const login = useCallback(
    async (serverId: string, username: string, password: string) => {
      const result = await window.serverAPI.login({
        serverId,
        username,
        password,
      });

      if (result.success) {
        await refreshSession();
      }

      return result;
    },
    [refreshSession]
  );

  const logout = useCallback(
    async (serverId: string) => {
      const result = await window.serverAPI.logout(serverId);

      if (result.success) {
        await refreshSession();
      }

      return result;
    },
    [refreshSession]
  );

  return {
    servers,
    loading,
    error,
    sessionStatus,
    refresh: fetchServers,
    addServer,
    updateServer,
    removeServer,
    testConnection,
    login,
    logout,
    refreshSession,
  };
}
