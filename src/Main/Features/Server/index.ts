import { randomUUID } from "crypto";
import type {
  ServerConfig,
  CreateServerInput,
  UpdateServerInput,
  ConnectionTestResult,
} from "../../../shared/types/server";
import {
  getAllServers,
  getServerById,
  saveServer,
  deleteServer,
} from "./store";
import { getProvider } from "../P4/factory";

// Re-export store functions
export { getAllServers, getServerById };

// Re-export auth functions
export { login, logout, getSessionStatus, validateSession } from "./auth";

/**
 * Add a new server configuration
 */
export function addServer(input: CreateServerInput): ServerConfig {
  const now = new Date().toISOString();
  const server: ServerConfig = {
    id: randomUUID(),
    name: input.name.trim(),
    p4port: input.p4port.trim(),
    description: input.description?.trim(),
    createdAt: now,
    updatedAt: now,
  };

  saveServer(server);
  return server;
}

/**
 * Update an existing server configuration
 */
export function updateServer(input: UpdateServerInput): ServerConfig {
  const existing = getServerById(input.id);
  if (!existing) {
    throw new Error(`Server with id ${input.id} not found`);
  }

  const updated: ServerConfig = {
    ...existing,
    name: input.name?.trim() ?? existing.name,
    p4port: input.p4port?.trim() ?? existing.p4port,
    description: input.description?.trim() ?? existing.description,
    updatedAt: new Date().toISOString(),
  };

  saveServer(updated);
  return updated;
}

/**
 * Remove a server configuration
 */
export function removeServer(id: string): boolean {
  return deleteServer(id);
}

/**
 * Test connection to a Perforce server using p4 info
 */
export async function testConnection(
  p4port: string
): Promise<ConnectionTestResult> {
  const startTime = Date.now();

  try {
    const provider = getProvider();

    // Run p4 info against the specified server
    const result = await provider.runInfoCommand(p4port);

    const responseTime = Date.now() - startTime;

    if (result.success && result.data) {
      return {
        success: true,
        serverInfo: result.data,
        responseTime,
      };
    }

    return {
      success: false,
      error: result.error || "Unknown error occurred",
      responseTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
      responseTime: Date.now() - startTime,
    };
  }
}
