import { getProvider } from "../P4/factory";
import { getServerById } from "./store";
import { getActiveSession, saveSession, clearSession } from "./session";
import type {
  LoginInput,
  LoginResult,
  LogoutResult,
  SessionStatus,
} from "../../../shared/types/server";

/**
 * Login to a Perforce server
 *
 * Note: This function always calls p4 login even if a valid ticket already exists.
 * This ensures the ticket lifetime is automatically extended each time the user logs in.
 */
export async function login(input: LoginInput): Promise<LoginResult> {
  const { serverId, username, password } = input;

  // Check if another server is logged in
  const currentSession = getActiveSession();
  if (currentSession && currentSession.serverId !== serverId) {
    return {
      success: false,
      needsLogout: true,
      currentServerId: currentSession.serverId,
    };
  }

  // Get server config
  const server = getServerById(serverId);
  if (!server) {
    return { success: false, error: "Server not found" };
  }

  try {
    const provider = getProvider();

    // Always run p4 login - this extends the ticket lifetime if one already exists
    // The ticket is stored in the p4 ticket file, not in our session store
    const result = await provider.login(server.p4port, username, password);

    if (result.success) {
      // Save session WITHOUT ticket - ticket is managed by p4 ticket file
      saveSession({
        serverId,
        username,
        loginTime: new Date().toISOString(),
      });

      return {
        success: true,
        user: username,
      };
    }

    return {
      success: false,
      error: result.error || "Login failed",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

/**
 * Logout from a Perforce server
 */
export async function logout(serverId: string): Promise<LogoutResult> {
  const session = getActiveSession();

  if (!session || session.serverId !== serverId) {
    return { success: true }; // Already logged out
  }

  const server = getServerById(serverId);
  if (!server) {
    clearSession();
    return { success: true };
  }

  try {
    const provider = getProvider();

    // Run p4 logout
    await provider.logout(server.p4port, session.username);

    // Clear session
    clearSession();

    return { success: true };
  } catch (error) {
    // Clear session even if logout command fails
    clearSession();
    return {
      success: true, // Consider it successful since session is cleared
    };
  }
}

/**
 * Get current session status
 */
export function getSessionStatus(): SessionStatus {
  const session = getActiveSession();

  if (!session) {
    return { isLoggedIn: false };
  }

  const server = getServerById(session.serverId);

  return {
    isLoggedIn: true,
    serverId: session.serverId,
    serverName: server?.name,
    username: session.username,
    loginTime: session.loginTime,
  };
}

/**
 * Validate current session by checking if a valid ticket exists in the ticket file
 */
export async function validateSession(): Promise<boolean> {
  const session = getActiveSession();

  if (!session) {
    return false;
  }

  const server = getServerById(session.serverId);
  if (!server) {
    clearSession();
    return false;
  }

  try {
    const provider = getProvider();

    // Use hasValidTicket instead of validateTicket
    const isValid = await provider.hasValidTicket(
      server.p4port,
      session.username
    );

    if (!isValid) {
      clearSession();
    }

    return isValid;
  } catch {
    clearSession();
    return false;
  }
}

/**
 * Recover session on app startup by checking if there's a valid ticket in the ticket file
 * for the active session's server/user combination.
 */
export async function recoverSession(): Promise<boolean> {
  const session = getActiveSession();

  if (!session) {
    return false;
  }

  const server = getServerById(session.serverId);
  if (!server) {
    clearSession();
    return false;
  }

  try {
    // Check if there's still a valid ticket in the ticket file
    const provider = getProvider();
    const hasTicket = await provider.hasValidTicket(
      server.p4port,
      session.username
    );

    if (!hasTicket) {
      clearSession();
      return false;
    }

    return true;
  } catch {
    clearSession();
    return false;
  }
}
