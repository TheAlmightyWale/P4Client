import {
  getProvider,
  resetProvider,
} from "../../../../src/Main/Features/P4/factory";
import {
  setP4Config,
  resetP4Config,
} from "../../../../src/Main/Features/P4/config";
import { CliProvider } from "../../../../src/Main/Features/P4/providers/cli";
import { ApiProvider } from "../../../../src/Main/Features/P4/providers/api";

// Mock the providers
jest.mock("../../../../src/Main/Features/P4/providers/cli");
jest.mock("../../../../src/Main/Features/P4/providers/api");

describe("P4 Provider Factory", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    resetP4Config();
    await resetProvider();
  });

  afterAll(async () => {
    resetP4Config();
    await resetProvider();
  });

  describe("getProvider", () => {
    it("should return ApiProvider when useNativeApi is true", () => {
      setP4Config({ useNativeApi: true });

      const provider = getProvider();

      expect(ApiProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(ApiProvider);
    });

    it("should return CliProvider when useNativeApi is false", () => {
      setP4Config({ useNativeApi: false });

      const provider = getProvider();

      expect(CliProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(CliProvider);
    });

    it("should return same provider instance on subsequent calls", () => {
      setP4Config({ useNativeApi: false });

      const provider1 = getProvider();
      const provider2 = getProvider();

      expect(provider1).toBe(provider2);
      expect(CliProvider).toHaveBeenCalledTimes(1);
    });

    it("should fall back to CliProvider if ApiProvider throws", () => {
      setP4Config({ useNativeApi: true });

      // Make ApiProvider constructor throw
      (ApiProvider as jest.Mock).mockImplementationOnce(() => {
        throw new Error("p4api not available");
      });

      const provider = getProvider();

      expect(CliProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(CliProvider);
    });
  });

  describe("resetProvider", () => {
    it("should allow creating new provider after reset", async () => {
      setP4Config({ useNativeApi: false });

      const provider1 = getProvider();
      await resetProvider();
      const provider2 = getProvider();

      expect(provider1).not.toBe(provider2);
      expect(CliProvider).toHaveBeenCalledTimes(2);
    });

    it("should call dispose on provider if available", async () => {
      setP4Config({ useNativeApi: false });

      const mockDispose = jest.fn().mockResolvedValue(undefined);
      (CliProvider as jest.Mock).mockImplementationOnce(() => ({
        dispose: mockDispose,
      }));

      getProvider();
      await resetProvider();

      expect(mockDispose).toHaveBeenCalled();
    });

    it("should handle provider without dispose method", async () => {
      setP4Config({ useNativeApi: false });

      (CliProvider as jest.Mock).mockImplementationOnce(() => ({}));

      getProvider();

      // Should not throw
      await expect(resetProvider()).resolves.toBeUndefined();
    });
  });
});
