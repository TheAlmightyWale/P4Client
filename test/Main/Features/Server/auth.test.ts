// Test for auth module functionality
// These tests import and test the actual auth module functions

// Mock electron-store before any imports
jest.mock("electron-store", () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
  }));
});

// Mock the dependencies before importing the module under test
jest.mock("../../../../src/Main/Features/Server/session");
jest.mock("../../../../src/Main/Features/Server/store");
jest.mock("../../../../src/Main/Features/P4/factory");

import {
  login,
  logout,
  getSessionStatus,
  validateSession,
  recoverSession,
} from "../../../../src/Main/Features/Server/auth";
import * as sessionModule from "../../../../src/Main/Features/Server/session";
import * as storeModule from "../../../../src/Main/Features/Server/store";
import * as factoryModule from "../../../../src/Main/Features/P4/factory";
import type { P4Provider } from "../../../../src/Main/Features/P4/types";
import type {
  ServerConfig,
  ServerSession,
} from "../../../../src/shared/types/server";

describe("Auth Module", () => {
  // Mock data
  const mockServer: ServerConfig = {
    id: "server-1",
    name: "Test Server",
    p4port: "ssl:perforce.example.com:1666",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  const mockSession: ServerSession = {
    serverId: "server-1",
    username: "testuser",
    loginTime: "2024-01-01T00:00:00.000Z",
  };

  // Mock provider
  const mockProvider: jest.Mocked<P4Provider> = {
    login: jest.fn(),
    logout: jest.fn(),
    getSet: jest.fn(),
    getTickets: jest.fn(),
    hasValidTicket: jest.fn(),
    getSubmittedChanges: jest.fn(),
    getPendingChanges: jest.fn(),
    getCurrentUser: jest.fn(),
    runInfoCommand: jest.fn(),
  };

  // Get typed mocks
  const mockedGetActiveSession =
    sessionModule.getActiveSession as jest.MockedFunction<
      typeof sessionModule.getActiveSession
    >;
  const mockedSaveSession = sessionModule.saveSession as jest.MockedFunction<
    typeof sessionModule.saveSession
  >;
  const mockedClearSession = sessionModule.clearSession as jest.MockedFunction<
    typeof sessionModule.clearSession
  >;
  const mockedGetServerById = storeModule.getServerById as jest.MockedFunction<
    typeof storeModule.getServerById
  >;
  const mockedGetProvider = factoryModule.getProvider as jest.MockedFunction<
    typeof factoryModule.getProvider
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetProvider.mockReturnValue(mockProvider);
  });

  describe("login", () => {
    it("should login successfully and save session", async () => {
      mockedGetActiveSession.mockReturnValue(null);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.login.mockResolvedValue({
        success: true,
        data: { success: true },
      });

      const result = await login({
        serverId: "server-1",
        username: "testuser",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(result.user).toBe("testuser");
      expect(mockProvider.login).toHaveBeenCalledWith(
        "ssl:perforce.example.com:1666",
        "testuser",
        "password123"
      );
      expect(mockedSaveSession).toHaveBeenCalledWith(
        expect.objectContaining({
          serverId: "server-1",
          username: "testuser",
        })
      );
    });

    it("should return needsLogout when another server is logged in", async () => {
      const otherSession: ServerSession = {
        serverId: "server-2",
        username: "otheruser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      mockedGetActiveSession.mockReturnValue(otherSession);

      const result = await login({
        serverId: "server-1",
        username: "testuser",
        password: "password123",
      });

      expect(result.success).toBe(false);
      expect(result.needsLogout).toBe(true);
      expect(result.currentServerId).toBe("server-2");
      expect(mockProvider.login).not.toHaveBeenCalled();
    });

    it("should return error when server not found", async () => {
      mockedGetActiveSession.mockReturnValue(null);
      mockedGetServerById.mockReturnValue(null);

      const result = await login({
        serverId: "nonexistent",
        username: "testuser",
        password: "password123",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Server not found");
      expect(mockProvider.login).not.toHaveBeenCalled();
    });

    it("should return error when login fails", async () => {
      mockedGetActiveSession.mockReturnValue(null);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const result = await login({
        serverId: "server-1",
        username: "testuser",
        password: "wrongpassword",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid credentials");
      expect(mockedSaveSession).not.toHaveBeenCalled();
    });

    it("should handle provider exceptions", async () => {
      mockedGetActiveSession.mockReturnValue(null);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.login.mockRejectedValue(new Error("Network error"));

      const result = await login({
        serverId: "server-1",
        username: "testuser",
        password: "password123",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });

    it("should allow login to same server when already logged in", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.login.mockResolvedValue({
        success: true,
        data: { success: true },
      });

      const result = await login({
        serverId: "server-1",
        username: "testuser",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(mockProvider.login).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout successfully and clear session", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.logout.mockResolvedValue({ success: true });

      const result = await logout("server-1");

      expect(result.success).toBe(true);
      expect(mockProvider.logout).toHaveBeenCalledWith(
        "ssl:perforce.example.com:1666",
        "testuser"
      );
      expect(mockedClearSession).toHaveBeenCalled();
    });

    it("should return success when already logged out (no session)", async () => {
      mockedGetActiveSession.mockReturnValue(null);

      const result = await logout("server-1");

      expect(result.success).toBe(true);
      expect(mockProvider.logout).not.toHaveBeenCalled();
    });

    it("should return success when logging out from different server", async () => {
      const otherSession: ServerSession = {
        serverId: "server-2",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      mockedGetActiveSession.mockReturnValue(otherSession);

      const result = await logout("server-1");

      expect(result.success).toBe(true);
      expect(mockProvider.logout).not.toHaveBeenCalled();
    });

    it("should clear session even when server not found", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(null);

      const result = await logout("server-1");

      expect(result.success).toBe(true);
      expect(mockedClearSession).toHaveBeenCalled();
    });

    it("should clear session even when logout command fails", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.logout.mockRejectedValue(new Error("Logout failed"));

      const result = await logout("server-1");

      expect(result.success).toBe(true);
      expect(mockedClearSession).toHaveBeenCalled();
    });
  });

  describe("getSessionStatus", () => {
    it("should return not logged in when no session", () => {
      mockedGetActiveSession.mockReturnValue(null);

      const status = getSessionStatus();

      expect(status.isLoggedIn).toBe(false);
      expect(status.serverId).toBeUndefined();
      expect(status.username).toBeUndefined();
    });

    it("should return session info when logged in", () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);

      const status = getSessionStatus();

      expect(status.isLoggedIn).toBe(true);
      expect(status.serverId).toBe("server-1");
      expect(status.serverName).toBe("Test Server");
      expect(status.username).toBe("testuser");
      expect(status.loginTime).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should return session info without server name when server not found", () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(null);

      const status = getSessionStatus();

      expect(status.isLoggedIn).toBe(true);
      expect(status.serverId).toBe("server-1");
      expect(status.serverName).toBeUndefined();
      expect(status.username).toBe("testuser");
    });
  });

  describe("validateSession", () => {
    it("should return false when no session", async () => {
      mockedGetActiveSession.mockReturnValue(null);

      const isValid = await validateSession();

      expect(isValid).toBe(false);
      expect(mockProvider.hasValidTicket).not.toHaveBeenCalled();
    });

    it("should return true when ticket is valid", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.hasValidTicket.mockResolvedValue(true);

      const isValid = await validateSession();

      expect(isValid).toBe(true);
      expect(mockProvider.hasValidTicket).toHaveBeenCalledWith(
        "ssl:perforce.example.com:1666",
        "testuser"
      );
      expect(mockedClearSession).not.toHaveBeenCalled();
    });

    it("should return false and clear session when ticket is invalid", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.hasValidTicket.mockResolvedValue(false);

      const isValid = await validateSession();

      expect(isValid).toBe(false);
      expect(mockedClearSession).toHaveBeenCalled();
    });

    it("should return false and clear session when server not found", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(null);

      const isValid = await validateSession();

      expect(isValid).toBe(false);
      expect(mockedClearSession).toHaveBeenCalled();
      expect(mockProvider.hasValidTicket).not.toHaveBeenCalled();
    });

    it("should return false and clear session when validation throws", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.hasValidTicket.mockRejectedValue(new Error("Network error"));

      const isValid = await validateSession();

      expect(isValid).toBe(false);
      expect(mockedClearSession).toHaveBeenCalled();
    });
  });

  describe("recoverSession", () => {
    it("should return false when no session", async () => {
      mockedGetActiveSession.mockReturnValue(null);

      const recovered = await recoverSession();

      expect(recovered).toBe(false);
      expect(mockProvider.hasValidTicket).not.toHaveBeenCalled();
    });

    it("should return true when valid ticket exists in ticket file", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.hasValidTicket.mockResolvedValue(true);

      const recovered = await recoverSession();

      expect(recovered).toBe(true);
      expect(mockProvider.hasValidTicket).toHaveBeenCalledWith(
        "ssl:perforce.example.com:1666",
        "testuser"
      );
      expect(mockedClearSession).not.toHaveBeenCalled();
    });

    it("should return false and clear session when no valid ticket", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.hasValidTicket.mockResolvedValue(false);

      const recovered = await recoverSession();

      expect(recovered).toBe(false);
      expect(mockedClearSession).toHaveBeenCalled();
    });

    it("should return false and clear session when server not found", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(null);

      const recovered = await recoverSession();

      expect(recovered).toBe(false);
      expect(mockedClearSession).toHaveBeenCalled();
    });

    it("should return false and clear session when hasValidTicket throws", async () => {
      mockedGetActiveSession.mockReturnValue(mockSession);
      mockedGetServerById.mockReturnValue(mockServer);
      mockProvider.hasValidTicket.mockRejectedValue(new Error("Network error"));

      const recovered = await recoverSession();

      expect(recovered).toBe(false);
      expect(mockedClearSession).toHaveBeenCalled();
    });
  });
});
