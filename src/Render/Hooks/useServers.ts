import { useState, useEffect, useCallback } from "react";
import type {
  ServerConfig,
  CreateServerInput,
  UpdateServerInput,
  ConnectionTestResult,
} from "../../shared/types/server";

interface UseServersReturn {
  servers: ServerConfig[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addServer: (input: CreateServerInput) => Promise<ServerConfig>;
  updateServer: (input: UpdateServerInput) => Promise<ServerConfig>;
  removeServer: (id: string) => Promise<boolean>;
  testConnection: (p4port: string) => Promise<ConnectionTestResult>;
}

export function useServers(): UseServersReturn {
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

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

  return {
    servers,
    loading,
    error,
    refresh: fetchServers,
    addServer,
    updateServer,
    removeServer,
    testConnection,
  };
}
