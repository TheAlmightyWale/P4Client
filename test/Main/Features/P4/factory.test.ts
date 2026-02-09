import {
  getProvider,
  resetProvider,
} from "../../../../src/Main/Features/P4/factory";
import { CliProvider } from "../../../../src/Main/Features/P4/providers/cli";

// Mock the provider
jest.mock("../../../../src/Main/Features/P4/providers/cli");

describe("P4 Provider Factory", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await resetProvider();
  });

  afterAll(async () => {
    await resetProvider();
  });

  describe("getProvider", () => {
    it("should return CliProvider", () => {
      const provider = getProvider();

      expect(CliProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(CliProvider);
    });

    it("should return same provider instance on subsequent calls", () => {
      const provider1 = getProvider();
      const provider2 = getProvider();

      expect(provider1).toBe(provider2);
      expect(CliProvider).toHaveBeenCalledTimes(1);
    });
  });

  describe("resetProvider", () => {
    it("should allow creating new provider after reset", async () => {
      const provider1 = getProvider();
      await resetProvider();
      const provider2 = getProvider();

      expect(provider1).not.toBe(provider2);
      expect(CliProvider).toHaveBeenCalledTimes(2);
    });

    it("should call dispose on provider if available", async () => {
      const mockDispose = jest.fn().mockResolvedValue(undefined);
      (CliProvider as jest.Mock).mockImplementationOnce(() => ({
        dispose: mockDispose,
      }));

      getProvider();
      await resetProvider();

      expect(mockDispose).toHaveBeenCalled();
    });

    it("should handle provider without dispose method", async () => {
      (CliProvider as jest.Mock).mockImplementationOnce(() => ({}));

      getProvider();

      // Should not throw
      await expect(resetProvider()).resolves.toBeUndefined();
    });
  });
});
