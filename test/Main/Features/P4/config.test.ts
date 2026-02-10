jest.mock("../../../../src/Main/Features/P4/factory");

import {
  getP4Config,
  setP4Config,
  resetP4Config,
  resolveP4EnvVar,
} from "../../../../src/Main/Features/P4/config";
import * as factoryModule from "../../../../src/Main/Features/P4/factory";
import type { P4Provider } from "../../../../src/Main/Features/P4/types";

const mockProvider: jest.Mocked<Pick<P4Provider, "getSet">> = {
  getSet: jest.fn(),
};
const mockedGetProvider = factoryModule.getProvider as jest.MockedFunction<
  typeof factoryModule.getProvider
>;

describe("P4 Config", () => {
  beforeEach(() => {
    resetP4Config();
    jest.clearAllMocks();
    delete process.env.P4PORT;
    delete process.env.P4USER;
    delete process.env.P4CLIENT;
    mockedGetProvider.mockReturnValue(mockProvider as unknown as P4Provider);
    mockProvider.getSet.mockResolvedValue({ success: true, data: {} });
  });

  describe("getP4Config", () => {
    it("should return default config", () => {
      const config = getP4Config();

      expect(config.port).toBeUndefined();
      expect(config.user).toBeUndefined();
      expect(config.client).toBeUndefined();
      expect(config.password).toBeUndefined();
    });

    it("should return a copy of config (not reference)", () => {
      const config1 = getP4Config();
      const config2 = getP4Config();

      expect(config1).not.toBe(config2);
      expect(config1).toEqual(config2);
    });
  });

  describe("setP4Config", () => {
    it("should update connection settings", () => {
      setP4Config({
        port: "ssl:perforce.example.com:1666",
        user: "testuser",
        client: "testclient",
        password: "secret",
      });

      const config = getP4Config();
      expect(config.port).toBe("ssl:perforce.example.com:1666");
      expect(config.user).toBe("testuser");
      expect(config.client).toBe("testclient");
      expect(config.password).toBe("secret");
    });

    it("should merge with existing config", () => {
      setP4Config({ port: "localhost:1666" });
      setP4Config({ user: "admin" });

      const config = getP4Config();
      expect(config.port).toBe("localhost:1666");
      expect(config.user).toBe("admin");
    });

    it("should allow overwriting values", () => {
      setP4Config({ port: "server1:1666" });
      setP4Config({ port: "server2:1666" });

      const config = getP4Config();
      expect(config.port).toBe("server2:1666");
    });
  });

  describe("resetP4Config", () => {
    it("should reset to default values", () => {
      setP4Config({
        port: "custom:1666",
        user: "customuser",
      });

      resetP4Config();

      const config = getP4Config();
      expect(config.port).toBeUndefined();
      expect(config.user).toBeUndefined();
    });
  });

  describe("resolveP4EnvVar", () => {
    it("should return value from process.env when set", async () => {
      process.env.P4PORT = "ssl:env-server:1666";

      const result = await resolveP4EnvVar("P4PORT");

      expect(result).toBe("ssl:env-server:1666");
      expect(mockProvider.getSet).not.toHaveBeenCalled();
    });

    it("should fall back to p4 set when not in process.env", async () => {
      mockProvider.getSet.mockResolvedValue({
        success: true,
        data: { P4PORT: "ssl:p4set-server:1666" },
      });

      const result = await resolveP4EnvVar("P4PORT");

      expect(result).toBe("ssl:p4set-server:1666");
      expect(mockProvider.getSet).toHaveBeenCalled();
    });

    it("should return default value when not found anywhere", async () => {
      const result = await resolveP4EnvVar("P4PORT", "1666");

      expect(result).toBe("1666");
    });

    it("should return undefined when not found and no default", async () => {
      const result = await resolveP4EnvVar("P4USER");

      expect(result).toBeUndefined();
    });

    it("should prefer process.env over p4 set", async () => {
      process.env.P4USER = "envuser";
      mockProvider.getSet.mockResolvedValue({
        success: true,
        data: { P4USER: "p4setuser" },
      });

      const result = await resolveP4EnvVar("P4USER");

      expect(result).toBe("envuser");
      expect(mockProvider.getSet).not.toHaveBeenCalled();
    });

    it("should handle p4 set failure gracefully and return default", async () => {
      mockProvider.getSet.mockRejectedValue(new Error("p4 not found"));

      const result = await resolveP4EnvVar("P4PORT", "1666");

      expect(result).toBe("1666");
    });

    it("should handle p4 set returning unsuccessful result", async () => {
      mockProvider.getSet.mockResolvedValue({
        success: false,
        error: "command failed",
      });

      const result = await resolveP4EnvVar("P4PORT", "1666");

      expect(result).toBe("1666");
    });

    it("should work with any P4 variable name", async () => {
      process.env.P4CLIENT = "my-workspace";

      const result = await resolveP4EnvVar("P4CLIENT");

      expect(result).toBe("my-workspace");
    });
  });
});
