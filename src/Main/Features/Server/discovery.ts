/**
 * Server Auto-Discovery Module
 *
 * Discovers Perforce servers from environment variables and active tickets
 * at application startup. Creates server entries for discovered servers
 * that don't already exist in the store.
 */

import { randomUUID } from "crypto";
import { hostname as osHostname } from "os";
import type { ServerConfig } from "../../../shared/types/server";
import { getAllServers, saveServer } from "./store";
import { getActiveSession, saveSession } from "./session";
import { getProvider } from "../P4/factory";

/**
 * Represents a server discovered from environment or tickets
 */
export interface DiscoveredServer {
  p4port: string;
  name: string;
  source: "environment" | "ticket";
  username?: string; // Only set if discovered from ticket
}

/**
 * Result of the discovery process
 */
export interface DiscoveryResult {
  serversCreated: ServerConfig[];
  sessionsRecovered: number;
  errors: string[];
}

/**
 * Extracts server name from P4PORT
 *
 * Examples:
 *   "ssl:perforce.example.com:1666" -> "perforce.example.com"
 *   "perforce.example.com:1666" -> "perforce.example.com"
 *   "localhost:1666" -> "localhost"
 *   "192.168.1.100:1666" -> "192.168.1.100"
 *
 * @param p4port - The P4PORT string
 * @returns The extracted hostname
 */
export function extractServerName(p4port: string): string {
  let hostname = p4port;

  // Remove protocol prefix if present (ssl:, ssl4:, tcp:, tcp4:, tcp6:, etc.)
  // Protocol prefixes are alphanumeric and end with a colon followed by a hostname
  // We need to be careful not to match "hostname:port" as "protocol:hostname"
  // Protocol prefixes are typically: ssl, ssl4, ssl6, tcp, tcp4, tcp6, etc.
  const knownProtocols = /^(ssl|ssl4|ssl6|tcp|tcp4|tcp6|ssl64|tcp64):(.+)$/i;
  const protocolMatch = hostname.match(knownProtocols);
  if (protocolMatch) {
    hostname = protocolMatch[2];
  }

  // Port-only value (e.g. "1666") implies localhost
  if (/^\d+$/.test(hostname)) {
    return osHostname() || "localhost";
  }

  // Remove port suffix if present
  // Handle IPv6 addresses like [::1]:1666
  if (hostname.startsWith("[")) {
    // IPv6 address
    const ipv6Match = hostname.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (ipv6Match) {
      hostname = ipv6Match[1];
    }
  } else {
    // IPv4 or hostname - remove trailing :port (port is numeric)
    // Match the last colon followed by digits only
    const portMatch = hostname.match(/^(.+):(\d+)$/);
    if (portMatch && !portMatch[1].match(/^\d+$/)) {
      // Make sure we're not stripping a numeric hostname (unlikely but safe)
      hostname = portMatch[1];
    } else if (portMatch) {
      hostname = portMatch[1];
    }
  }

  return hostname;
}

/**
 * Reads P4 environment variables
 *
 * @returns DiscoveredServer if P4PORT is set, null otherwise
 */
export function getEnvironmentConfig(): DiscoveredServer | null {
  const p4port = process.env.P4PORT ?? "1666";

  return {
    p4port,
    name: extractServerName(p4port),
    source: "environment",
    username: process.env.P4USER,
  };
}

/**
 * Discovers servers from active p4 tickets
 *
 * @returns Array of discovered servers from tickets
 */
export async function discoverFromTickets(): Promise<DiscoveredServer[]> {
  const provider = getProvider();
  const result = await provider.getTickets();

  if (!result.success || !result.data) {
    return [];
  }

  return result.data.map((ticket) => ({
    p4port: ticket.host,
    name: extractServerName(ticket.host),
    source: "ticket" as const,
    username: ticket.user,
  }));
}

/**
 * Checks if a server with the given p4port exists in store
 *
 * @param p4port - The P4PORT to check
 * @returns true if server exists, false otherwise
 */
export function serverExists(p4port: string): boolean {
  const servers = getAllServers();
  const normalizedPort = p4port.toLowerCase();
  return servers.some((s) => s.p4port.toLowerCase() === normalizedPort);
}

/**
 * Finds a server by p4port (case-insensitive)
 *
 * @param p4port - The P4PORT to find
 * @returns The server if found, null otherwise
 */
export function findServerByPort(p4port: string): ServerConfig | null {
  const servers = getAllServers();
  const normalizedPort = p4port.toLowerCase();
  return servers.find((s) => s.p4port.toLowerCase() === normalizedPort) || null;
}

/**
 * Creates a ServerConfig with reasonable defaults from a discovered server
 *
 * @param discovered - The discovered server
 * @returns A new ServerConfig
 */
export function createServerFromDiscovery(
  discovered: DiscoveredServer,
): ServerConfig {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    name: discovered.name,
    p4port: discovered.p4port,
    description: `Auto-discovered from ${discovered.source}`,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Recovers a session for a server discovered from a ticket
 * Only creates session if no active session exists
 *
 * @param serverId - The server ID
 * @param username - The username from the ticket
 * @returns true if session was recovered, false if skipped
 */
export function recoverSessionForTicket(
  serverId: string,
  username: string,
): boolean {
  const currentSession = getActiveSession();

  // Don't override existing session
  if (currentSession) {
    return false;
  }

  saveSession({
    serverId,
    username,
    loginTime: new Date().toISOString(),
  });

  return true;
}

/**
 * Main discovery function - called at app startup
 *
 * 1. Discovers servers from environment and tickets
 * 2. Filters out servers that already exist
 * 3. Creates new server entries
 * 4. Recovers sessions for ticket-based discoveries
 *
 * @returns Discovery results including created servers and recovered sessions
 */
export async function discoverServers(): Promise<DiscoveryResult> {
  const result: DiscoveryResult = {
    serversCreated: [],
    sessionsRecovered: 0,
    errors: [],
  };

  const discoveredServers: DiscoveredServer[] = [];

  // Discover from environment
  try {
    const envServer = getEnvironmentConfig();
    if (envServer) {
      discoveredServers.push(envServer);
    }
  } catch (error) {
    result.errors.push(
      `Environment discovery failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // Discover from tickets
  try {
    const ticketServers = await discoverFromTickets();
    discoveredServers.push(...ticketServers);
  } catch (error) {
    result.errors.push(
      `Ticket discovery failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // Process discovered servers
  // Use a Map to deduplicate by p4port (case-insensitive)
  const uniqueServers = new Map<string, DiscoveredServer>();
  for (const server of discoveredServers) {
    const key = server.p4port.toLowerCase();
    // Prefer ticket-based discovery over environment (has username)
    if (!uniqueServers.has(key) || server.source === "ticket") {
      uniqueServers.set(key, server);
    }
  }

  // Create servers that don't exist and recover sessions
  for (const discovered of uniqueServers.values()) {
    try {
      if (!serverExists(discovered.p4port)) {
        // Create new server
        const newServer = createServerFromDiscovery(discovered);
        saveServer(newServer);
        result.serversCreated.push(newServer);

        // Recover session if discovered from ticket
        if (discovered.source === "ticket" && discovered.username) {
          if (recoverSessionForTicket(newServer.id, discovered.username)) {
            result.sessionsRecovered++;
          }
        }
      } else if (discovered.source === "ticket" && discovered.username) {
        // Server exists, but we might still want to recover session
        const existingServer = findServerByPort(discovered.p4port);
        if (existingServer) {
          if (recoverSessionForTicket(existingServer.id, discovered.username)) {
            result.sessionsRecovered++;
          }
        }
      }
    } catch (error) {
      result.errors.push(
        `Failed to process server ${discovered.p4port}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return result;
}
