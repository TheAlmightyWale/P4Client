import Store from "electron-store";
import type { ServerSession } from "../../../shared/types/server";

interface SessionStoreSchema {
  activeSession: ServerSession | null;
}

const sessionStore = new Store<SessionStoreSchema>({
  name: "session",
  defaults: {
    activeSession: null,
  },
  encryptionKey: "p4client-session-key", // Encrypt sensitive data
});

/**
 * Get the currently active session
 */
export function getActiveSession(): ServerSession | null {
  return sessionStore.get("activeSession");
}

/**
 * Save a new session
 */
export function saveSession(session: ServerSession): void {
  sessionStore.set("activeSession", session);
}

/**
 * Clear the current session
 */
export function clearSession(): void {
  sessionStore.set("activeSession", null);
}

/**
 * Check if a specific server is logged in
 */
export function isServerLoggedIn(serverId: string): boolean {
  const session = getActiveSession();
  return session?.serverId === serverId;
}
