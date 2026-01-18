import { CliProvider } from "../../../../src/Main/Features/P4/providers/cli";
import * as executor from "../../../../src/Main/Features/P4/providers/cli/executor";

// Mock the executor module
jest.mock("../../../../src/Main/Features/P4/providers/cli/executor");

const mockExecutor = executor as jest.Mocked<typeof executor>;

describe("CliProvider Authentication", () => {
  let provider: CliProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new CliProvider();
  });

  describe("login", () => {
    it("should login successfully and return ticket", async () => {
      mockExecutor.executeP4CommandWithInput.mockResolvedValue({
        stdout: "ABC123DEF456GHI789JKL012MNO345PQ",
        stderr: "",
      });

      const result = await provider.login(
        "ssl:perforce.example.com:1666",
        "testuser",
        "password123"
      );

      expect(result.success).toBe(true);
      expect(result.data?.ticket).toBe("ABC123DEF456GHI789JKL012MNO345PQ");
      expect(mockExecutor.executeP4CommandWithInput).toHaveBeenCalledWith(
        "login -p",
        {
          P4PORT: "ssl:perforce.example.com:1666",
          P4USER: "testuser",
        },
        {
          input: "password123",
        }
      );
    });

    it("should return error when login fails", async () => {
      mockExecutor.executeP4CommandWithInput.mockRejectedValue(
        new Error("Password invalid")
      );

      const result = await provider.login(
        "ssl:perforce.example.com:1666",
        "testuser",
        "wrongpassword"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Password invalid");
    });

    it("should return error when no ticket received", async () => {
      mockExecutor.executeP4CommandWithInput.mockResolvedValue({
        stdout: "",
        stderr: "",
      });

      const result = await provider.login(
        "ssl:perforce.example.com:1666",
        "testuser",
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("No ticket received from login");
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      mockExecutor.executeP4Command.mockResolvedValue({
        stdout: "User testuser logged out.",
        stderr: "",
      });

      const result = await provider.logout(
        "ssl:perforce.example.com:1666",
        "testuser"
      );

      expect(result.success).toBe(true);
      expect(mockExecutor.executeP4Command).toHaveBeenCalledWith("logout", {
        P4PORT: "ssl:perforce.example.com:1666",
        P4USER: "testuser",
      });
    });

    it("should return error when logout fails", async () => {
      mockExecutor.executeP4Command.mockRejectedValue(
        new Error("Connection refused")
      );

      const result = await provider.logout(
        "ssl:perforce.example.com:1666",
        "testuser"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection refused");
    });
  });

  describe("validateTicket", () => {
    it("should return true when ticket is valid", async () => {
      mockExecutor.executeP4Command.mockResolvedValue({
        stdout: "User testuser ticket expires in 43200 seconds.",
        stderr: "",
      });

      const isValid = await provider.validateTicket(
        "ssl:perforce.example.com:1666",
        "testuser",
        "ABC123"
      );

      expect(isValid).toBe(true);
      expect(mockExecutor.executeP4Command).toHaveBeenCalledWith("login -s", {
        P4PORT: "ssl:perforce.example.com:1666",
        P4USER: "testuser",
        P4TICKET: "ABC123",
      });
    });

    it("should return false when ticket is invalid", async () => {
      mockExecutor.executeP4Command.mockRejectedValue(
        new Error("Your session has expired")
      );

      const isValid = await provider.validateTicket(
        "ssl:perforce.example.com:1666",
        "testuser",
        "EXPIRED123"
      );

      expect(isValid).toBe(false);
    });

    it("should return false when connection fails", async () => {
      mockExecutor.executeP4Command.mockRejectedValue(
        new Error("Connection refused")
      );

      const isValid = await provider.validateTicket(
        "ssl:perforce.example.com:1666",
        "testuser",
        "ABC123"
      );

      expect(isValid).toBe(false);
    });
  });
});
