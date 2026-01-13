import {
  getP4Config,
  setP4Config,
  useNativeApi,
  resetP4Config,
} from "../../../../src/Main/Features/P4/config";

describe("P4 Config", () => {
  beforeEach(() => {
    resetP4Config();
  });

  describe("getP4Config", () => {
    it("should return default config", () => {
      const config = getP4Config();

      expect(config.useNativeApi).toBe(true);
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
    it("should update useNativeApi flag", () => {
      setP4Config({ useNativeApi: false });

      const config = getP4Config();
      expect(config.useNativeApi).toBe(false);
    });

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
      expect(config.useNativeApi).toBe(true); // Default preserved
    });

    it("should allow overwriting values", () => {
      setP4Config({ port: "server1:1666" });
      setP4Config({ port: "server2:1666" });

      const config = getP4Config();
      expect(config.port).toBe("server2:1666");
    });
  });

  describe("useNativeApi", () => {
    it("should return true by default", () => {
      expect(useNativeApi()).toBe(true);
    });

    it("should return false when set to false", () => {
      setP4Config({ useNativeApi: false });
      expect(useNativeApi()).toBe(false);
    });

    it("should return true when set back to true", () => {
      setP4Config({ useNativeApi: false });
      setP4Config({ useNativeApi: true });
      expect(useNativeApi()).toBe(true);
    });
  });

  describe("resetP4Config", () => {
    it("should reset to default values", () => {
      setP4Config({
        useNativeApi: false,
        port: "custom:1666",
        user: "customuser",
      });

      resetP4Config();

      const config = getP4Config();
      expect(config.useNativeApi).toBe(true);
      expect(config.port).toBeUndefined();
      expect(config.user).toBeUndefined();
    });
  });
});
