// Test for discovery module functionality
// These tests import and test the actual discovery module functions

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
jest.mock("os", () => ({
  hostname: jest.fn(() => "MY-PC"),
}));

import {
  extractServerName,
  getEnvironmentConfig,
  discoverFromTickets,
  serverExists,
  findServerByPort,
  createServerFromDiscovery,
  recoverSessionForTicket,
  discoverServers,
} from "../../../../src/Main/Features/Server/discovery";
import type { DiscoveredServer } from "../../../../src/Main/Features/Server/discovery";
import * as sessionModule from "../../../../src/Main/Features/Server/session";
import * as storeModule from "../../../../src/Main/Features/Server/store";
import * as factoryModule from "../../../../src/Main/Features/P4/factory";
import type { P4Provider } from "../../../../src/Main/Features/P4/types";
import type { ServerConfig } from "../../../../src/shared/types/server";

describe("Server Discovery", () => {
  // Mock provider
  const mockProvider: jest.Mocked<P4Provider> = {
    login: jest.fn(),
    logout: jest.fn(),
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
  const mockedGetAllServers = storeModule.getAllServers as jest.MockedFunction<
    typeof storeModule.getAllServers
  >;
  const mockedSaveServer = storeModule.saveServer as jest.MockedFunction<
    typeof storeModule.saveServer
  >;
  const mockedGetProvider = factoryModule.getProvider as jest.MockedFunction<
    typeof factoryModule.getProvider
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.P4PORT;
    delete process.env.P4USER;
    delete process.env.P4CLIENT;
    mockedGetProvider.mockReturnValue(mockProvider);
  });

  describe("extractServerName", () => {
    it("should extract hostname from ssl:host:port format", () => {
      expect(extractServerName("ssl:perforce.example.com:1666")).toBe(
        "perforce.example.com",
      );
    });

    it("should extract hostname from host:port format", () => {
      expect(extractServerName("perforce.example.com:1666")).toBe(
        "perforce.example.com",
      );
    });

    it("should handle IP addresses", () => {
      expect(extractServerName("192.168.1.100:1666")).toBe("192.168.1.100");
    });

    it("should handle localhost", () => {
      expect(extractServerName("localhost:1666")).toBe("localhost");
    });

    it("should handle hostnames without port", () => {
      expect(extractServerName("perforce.example.com")).toBe(
        "perforce.example.com",
      );
    });

    it("should handle various protocol prefixes", () => {
      expect(extractServerName("tcp:perforce.example.com:1666")).toBe(
        "perforce.example.com",
      );
      expect(extractServerName("ssl4:perforce.example.com:1666")).toBe(
        "perforce.example.com",
      );
    });

    it("should handle different port numbers", () => {
      expect(extractServerName("ssl:p4.company.io:1667")).toBe("p4.company.io");
      expect(extractServerName("perforce.example.com:2666")).toBe(
        "perforce.example.com",
      );
    });

    it("should handle IPv6 addresses", () => {
      expect(extractServerName("[::1]:1666")).toBe("::1");
      expect(extractServerName("[2001:db8::1]:1666")).toBe("2001:db8::1");
    });

    it("should return PC hostname for port-only value", () => {
      expect(extractServerName("1666")).toBe("MY-PC");
    });

    it("should fall back to localhost when os.hostname() returns empty string", () => {
      const os = require("os");
      os.hostname.mockReturnValueOnce("");
      expect(extractServerName("1666")).toBe("localhost");
    });
  });

  describe("getEnvironmentConfig", () => {
    it("should use default P4PORT of 1666 when not set in environment", () => {
      const result = getEnvironmentConfig();

      expect(result).not.toBeNull();
      expect(result?.p4port).toBe("1666");
      expect(result?.name).toBe("MY-PC");
      expect(result?.source).toBe("environment");
    });

    it("should return DiscoveredServer when P4PORT is set", () => {
      process.env.P4PORT = "ssl:perforce.example.com:1666";

      const result = getEnvironmentConfig();

      expect(result).not.toBeNull();
      expect(result?.p4port).toBe("ssl:perforce.example.com:1666");
      expect(result?.name).toBe("perforce.example.com");
      expect(result?.source).toBe("environment");
    });

    it("should include P4USER when available", () => {
      process.env.P4PORT = "ssl:perforce.example.com:1666";
      process.env.P4USER = "testuser";

      const result = getEnvironmentConfig();

      expect(result?.username).toBe("testuser");
    });

    it("should not include username when P4USER is not set", () => {
      process.env.P4PORT = "ssl:perforce.example.com:1666";

      const result = getEnvironmentConfig();

      expect(result?.username).toBeUndefined();
    });
  });

  describe("discoverFromTickets", () => {
    it("should return empty array when no tickets exist", async () => {
      mockProvider.getTickets.mockResolvedValue({ success: true, data: [] });

      const result = await discoverFromTickets();

      expect(result).toEqual([]);
    });

    it("should return DiscoveredServer for each ticket", async () => {
      mockProvider.getTickets.mockResolvedValue({
        success: true,
        data: [
          {
            host: "ssl:perforce.example.com:1666",
            user: "user1",
            ticket: "ABC123",
          },
          { host: "ssl:other-server:1666", user: "user2", ticket: "DEF456" },
        ],
      });

      const result = await discoverFromTickets();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        p4port: "ssl:perforce.example.com:1666",
        name: "perforce.example.com",
        source: "ticket",
        username: "user1",
      });
      expect(result[1]).toEqual({
        p4port: "ssl:other-server:1666",
        name: "other-server",
        source: "ticket",
        username: "user2",
      });
    });

    it("should handle ticket retrieval failure gracefully", async () => {
      mockProvider.getTickets.mockResolvedValue({
        success: false,
        error: "Failed to get tickets",
      });

      const result = await discoverFromTickets();

      expect(result).toEqual([]);
    });
  });

  describe("serverExists", () => {
    it("should return true for existing server", () => {
      mockedGetAllServers.mockReturnValue([
        {
          id: "1",
          name: "Test Server",
          p4port: "ssl:perforce.example.com:1666",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ]);

      expect(serverExists("ssl:perforce.example.com:1666")).toBe(true);
    });

    it("should return false for non-existing server", () => {
      mockedGetAllServers.mockReturnValue([
        {
          id: "1",
          name: "Test Server",
          p4port: "ssl:perforce.example.com:1666",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ]);

      expect(serverExists("ssl:other-server:1666")).toBe(false);
    });

    it("should be case-insensitive", () => {
      mockedGetAllServers.mockReturnValue([
        {
          id: "1",
          name: "Test Server",
          p4port: "ssl:Perforce.Example.Com:1666",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ]);

      expect(serverExists("ssl:perforce.example.com:1666")).toBe(true);
      expect(serverExists("SSL:PERFORCE.EXAMPLE.COM:1666")).toBe(true);
    });
  });

  describe("findServerByPort", () => {
    it("should find server by p4port", () => {
      const server: ServerConfig = {
        id: "1",
        name: "Test Server",
        p4port: "ssl:perforce.example.com:1666",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };
      mockedGetAllServers.mockReturnValue([server]);

      expect(findServerByPort("ssl:perforce.example.com:1666")).toEqual(server);
    });

    it("should return null when server not found", () => {
      mockedGetAllServers.mockReturnValue([]);

      expect(findServerByPort("ssl:perforce.example.com:1666")).toBeNull();
    });

    it("should be case-insensitive", () => {
      const server: ServerConfig = {
        id: "1",
        name: "Test Server",
        p4port: "ssl:Perforce.Example.Com:1666",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };
      mockedGetAllServers.mockReturnValue([server]);

      expect(findServerByPort("ssl:perforce.example.com:1666")).toEqual(server);
    });
  });

  describe("createServerFromDiscovery", () => {
    it("should create ServerConfig with correct defaults", () => {
      const discovered: DiscoveredServer = {
        p4port: "ssl:perforce.example.com:1666",
        name: "perforce.example.com",
        source: "environment",
      };

      const result = createServerFromDiscovery(discovered);

      expect(result.id).toBeDefined();
      expect(result.name).toBe("perforce.example.com");
      expect(result.p4port).toBe("ssl:perforce.example.com:1666");
      expect(result.description).toBe("Auto-discovered from environment");
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it("should set description based on source", () => {
      const ticketDiscovered: DiscoveredServer = {
        p4port: "ssl:perforce.example.com:1666",
        name: "perforce.example.com",
        source: "ticket",
        username: "testuser",
      };

      const result = createServerFromDiscovery(ticketDiscovered);

      expect(result.description).toBe("Auto-discovered from ticket");
    });
  });

  describe("recoverSessionForTicket", () => {
    it("should create session when no active session exists", () => {
      mockedGetActiveSession.mockReturnValue(null);

      const result = recoverSessionForTicket("server-1", "testuser");

      expect(result).toBe(true);
      expect(mockedSaveSession).toHaveBeenCalledWith(
        expect.objectContaining({
          serverId: "server-1",
          username: "testuser",
        }),
      );
    });

    it("should not override existing session", () => {
      mockedGetActiveSession.mockReturnValue({
        serverId: "other-server",
        username: "otheruser",
        loginTime: "2024-01-01",
      });

      const result = recoverSessionForTicket("server-1", "testuser");

      expect(result).toBe(false);
      expect(mockedSaveSession).not.toHaveBeenCalled();
    });
  });

  describe("discoverServers", () => {
    beforeEach(() => {
      mockedGetAllServers.mockReturnValue([]);
      mockedGetActiveSession.mockReturnValue(null);
      mockProvider.getTickets.mockResolvedValue({ success: true, data: [] });
    });

    it("should create servers from environment when not existing", async () => {
      process.env.P4PORT = "ssl:perforce.example.com:1666";

      const result = await discoverServers();

      expect(result.serversCreated).toHaveLength(1);
      expect(result.serversCreated[0].p4port).toBe(
        "ssl:perforce.example.com:1666",
      );
      expect(mockedSaveServer).toHaveBeenCalled();
    });

    it("should create servers from tickets when not existing", async () => {
      mockProvider.getTickets.mockResolvedValue({
        success: true,
        data: [
          {
            host: "ssl:perforce.example.com:1666",
            user: "testuser",
            ticket: "ABC123",
          },
        ],
      });

      const result = await discoverServers();

      // Expect 2: the default environment server (1666) + the ticket server
      expect(result.serversCreated).toHaveLength(2);
      expect(result.serversCreated.map((s) => s.p4port)).toContain(
        "ssl:perforce.example.com:1666",
      );
    });

    it("should not create duplicate servers", async () => {
      mockedGetAllServers.mockReturnValue([
        {
          id: "existing-1",
          name: "Existing Server",
          p4port: "ssl:perforce.example.com:1666",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ]);
      process.env.P4PORT = "ssl:perforce.example.com:1666";

      const result = await discoverServers();

      expect(result.serversCreated).toHaveLength(0);
      expect(mockedSaveServer).not.toHaveBeenCalled();
    });

    it("should recover sessions for ticket-based discoveries", async () => {
      mockProvider.getTickets.mockResolvedValue({
        success: true,
        data: [
          {
            host: "ssl:perforce.example.com:1666",
            user: "testuser",
            ticket: "ABC123",
          },
        ],
      });

      const result = await discoverServers();

      expect(result.sessionsRecovered).toBe(1);
      expect(mockedSaveSession).toHaveBeenCalled();
    });

    it("should not override existing sessions", async () => {
      mockedGetActiveSession.mockReturnValue({
        serverId: "other-server",
        username: "otheruser",
        loginTime: "2024-01-01",
      });
      mockProvider.getTickets.mockResolvedValue({
        success: true,
        data: [
          {
            host: "ssl:perforce.example.com:1666",
            user: "testuser",
            ticket: "ABC123",
          },
        ],
      });

      const result = await discoverServers();

      expect(result.sessionsRecovered).toBe(0);
      expect(mockedSaveSession).not.toHaveBeenCalled();
    });

    it("should return discovery results", async () => {
      process.env.P4PORT = "ssl:perforce.example.com:1666";

      const result = await discoverServers();

      expect(result).toHaveProperty("serversCreated");
      expect(result).toHaveProperty("sessionsRecovered");
      expect(result).toHaveProperty("errors");
    });

    it("should handle errors gracefully", async () => {
      mockProvider.getTickets.mockRejectedValue(new Error("Network error"));

      const result = await discoverServers();

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Ticket discovery failed");
    });

    it("should deduplicate servers from environment and tickets", async () => {
      process.env.P4PORT = "ssl:perforce.example.com:1666";
      mockProvider.getTickets.mockResolvedValue({
        success: true,
        data: [
          {
            host: "ssl:perforce.example.com:1666",
            user: "testuser",
            ticket: "ABC123",
          },
        ],
      });

      const result = await discoverServers();

      // Should only create one server, not two
      expect(result.serversCreated).toHaveLength(1);
      // Should prefer ticket source (has username)
      expect(mockedSaveSession).toHaveBeenCalled();
    });

    it("should recover session for existing server with active ticket", async () => {
      mockedGetAllServers.mockReturnValue([
        {
          id: "existing-1",
          name: "Existing Server",
          p4port: "ssl:perforce.example.com:1666",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "existing-default",
          name: "MY-PC",
          p4port: "1666",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ]);
      mockProvider.getTickets.mockResolvedValue({
        success: true,
        data: [
          {
            host: "ssl:perforce.example.com:1666",
            user: "testuser",
            ticket: "ABC123",
          },
        ],
      });

      const result = await discoverServers();

      expect(result.serversCreated).toHaveLength(0);
      expect(result.sessionsRecovered).toBe(1);
      expect(mockedSaveSession).toHaveBeenCalledWith(
        expect.objectContaining({
          serverId: "existing-1",
          username: "testuser",
        }),
      );
    });
  });
});
