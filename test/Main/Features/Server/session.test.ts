// Test for session store functionality
// These tests import and test the actual session module functions

import {
  getActiveSession,
  saveSession,
  clearSession,
  isServerLoggedIn,
} from "../../../../src/Main/Features/Server/session";
import type { ServerSession } from "../../../../src/shared/types/server";

// Mock electron-store
const mockStoreData: Record<string, unknown> = {};

jest.mock("electron-store", () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn((key: string) => mockStoreData[key]),
    set: jest.fn((key: string, value: unknown) => {
      mockStoreData[key] = value;
    }),
  }));
});

describe("Session Store", () => {
  beforeEach(() => {
    // Reset mock store data before each test
    Object.keys(mockStoreData).forEach((key) => delete mockStoreData[key]);
    mockStoreData.activeSession = null;
    jest.clearAllMocks();
  });

  describe("getActiveSession", () => {
    it("should return null when no session exists", () => {
      mockStoreData.activeSession = null;

      const session = getActiveSession();

      expect(session).toBeNull();
    });

    it("should return the active session when one exists", () => {
      const mockSession: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      mockStoreData.activeSession = mockSession;

      const session = getActiveSession();

      expect(session).toEqual(mockSession);
      expect(session?.serverId).toBe("server-1");
      expect(session?.username).toBe("testuser");
      expect(session?.loginTime).toBe("2024-01-01T00:00:00.000Z");
    });
  });

  describe("saveSession", () => {
    it("should save a new session", () => {
      const mockSession: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };

      saveSession(mockSession);

      expect(mockStoreData.activeSession).toEqual(mockSession);
    });

    it("should overwrite existing session with new session", () => {
      const session1: ServerSession = {
        serverId: "server-1",
        username: "user1",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      const session2: ServerSession = {
        serverId: "server-2",
        username: "user2",
        loginTime: "2024-01-02T00:00:00.000Z",
      };

      saveSession(session1);
      expect(mockStoreData.activeSession).toEqual(session1);

      saveSession(session2);
      expect(mockStoreData.activeSession).toEqual(session2);
      expect(mockStoreData.activeSession).not.toEqual(session1);
    });
  });

  describe("clearSession", () => {
    it("should clear the active session", () => {
      const mockSession: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      mockStoreData.activeSession = mockSession;

      clearSession();

      expect(mockStoreData.activeSession).toBeNull();
    });

    it("should be safe to call when no session exists", () => {
      mockStoreData.activeSession = null;

      // Should not throw
      expect(() => clearSession()).not.toThrow();
      expect(mockStoreData.activeSession).toBeNull();
    });

    it("should clear session after save", () => {
      const mockSession: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };

      saveSession(mockSession);
      expect(mockStoreData.activeSession).toEqual(mockSession);

      clearSession();
      expect(mockStoreData.activeSession).toBeNull();
    });
  });

  describe("isServerLoggedIn", () => {
    it("should return false when no session exists", () => {
      mockStoreData.activeSession = null;

      const result = isServerLoggedIn("server-1");

      expect(result).toBe(false);
    });

    it("should return true when the specified server is logged in", () => {
      const mockSession: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      mockStoreData.activeSession = mockSession;

      const result = isServerLoggedIn("server-1");

      expect(result).toBe(true);
    });

    it("should return false when a different server is logged in", () => {
      const mockSession: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      mockStoreData.activeSession = mockSession;

      const result = isServerLoggedIn("server-2");

      expect(result).toBe(false);
    });

    it("should correctly identify server after session change", () => {
      const session1: ServerSession = {
        serverId: "server-1",
        username: "user1",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      const session2: ServerSession = {
        serverId: "server-2",
        username: "user2",
        loginTime: "2024-01-02T00:00:00.000Z",
      };

      saveSession(session1);
      expect(isServerLoggedIn("server-1")).toBe(true);
      expect(isServerLoggedIn("server-2")).toBe(false);

      saveSession(session2);
      expect(isServerLoggedIn("server-1")).toBe(false);
      expect(isServerLoggedIn("server-2")).toBe(true);
    });

    it("should return false after session is cleared", () => {
      const mockSession: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      mockStoreData.activeSession = mockSession;

      expect(isServerLoggedIn("server-1")).toBe(true);

      clearSession();

      expect(isServerLoggedIn("server-1")).toBe(false);
    });
  });

  describe("integration scenarios", () => {
    it("should handle full login/logout cycle", () => {
      // Initially no session
      expect(getActiveSession()).toBeNull();
      expect(isServerLoggedIn("server-1")).toBe(false);

      // Login
      const session: ServerSession = {
        serverId: "server-1",
        username: "testuser",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      saveSession(session);

      // Verify logged in
      expect(getActiveSession()).toEqual(session);
      expect(isServerLoggedIn("server-1")).toBe(true);

      // Logout
      clearSession();

      // Verify logged out
      expect(getActiveSession()).toBeNull();
      expect(isServerLoggedIn("server-1")).toBe(false);
    });

    it("should handle switching between servers", () => {
      const server1Session: ServerSession = {
        serverId: "server-1",
        username: "user1",
        loginTime: "2024-01-01T00:00:00.000Z",
      };
      const server2Session: ServerSession = {
        serverId: "server-2",
        username: "user2",
        loginTime: "2024-01-02T00:00:00.000Z",
      };

      // Login to server 1
      saveSession(server1Session);
      expect(isServerLoggedIn("server-1")).toBe(true);
      expect(isServerLoggedIn("server-2")).toBe(false);

      // Switch to server 2 (overwrites session)
      saveSession(server2Session);
      expect(isServerLoggedIn("server-1")).toBe(false);
      expect(isServerLoggedIn("server-2")).toBe(true);

      // Verify active session is server 2
      const activeSession = getActiveSession();
      expect(activeSession?.serverId).toBe("server-2");
      expect(activeSession?.username).toBe("user2");
    });
  });
});
