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
    it("should login successfully", async () => {
      mockExecutor.executeP4CommandWithInput.mockResolvedValue({
        stdout: "User testuser logged in.",
        stderr: "",
      });

      const result = await provider.login(
        "ssl:perforce.example.com:1666",
        "testuser",
        "password123"
      );

      expect(result.success).toBe(true);
      expect(result.data?.success).toBe(true);
      expect(mockExecutor.executeP4CommandWithInput).toHaveBeenCalledWith(
        "login",
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

  describe("getTickets", () => {
    it("should return all tickets from ticket file", async () => {
      const ticketsOutput = `... user testuser
... ticket ABC123DEF456
... Host ssl:perforce.example.com:1666
... user admin
... ticket XYZ789ABC
... Host ssl:other-server:1666`;

      mockExecutor.executeP4Command.mockResolvedValue({
        stdout: ticketsOutput,
        stderr: "",
      });

      const result = await provider.getTickets();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0]).toEqual({
        user: "testuser",
        ticket: "ABC123DEF456",
        host: "ssl:perforce.example.com:1666",
      });
      expect(result.data?.[1]).toEqual({
        user: "admin",
        ticket: "XYZ789ABC",
        host: "ssl:other-server:1666",
      });
      expect(mockExecutor.executeP4Command).toHaveBeenCalledWith("tickets");
    });

    it("should return empty array when no tickets exist", async () => {
      mockExecutor.executeP4Command.mockResolvedValue({
        stdout: "",
        stderr: "",
      });

      const result = await provider.getTickets();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it("should return error when command fails", async () => {
      mockExecutor.executeP4Command.mockRejectedValue(
        new Error("Command failed")
      );

      const result = await provider.getTickets();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Command failed");
    });
  });

  describe("hasValidTicket", () => {
    it("should return true when ticket exists for server/user", async () => {
      const ticketsOutput = `... user testuser
... ticket ABC123DEF456
... Host ssl:perforce.example.com:1666`;

      mockExecutor.executeP4Command.mockResolvedValue({
        stdout: ticketsOutput,
        stderr: "",
      });

      const hasTicket = await provider.hasValidTicket(
        "ssl:perforce.example.com:1666",
        "testuser"
      );

      expect(hasTicket).toBe(true);
    });

    it("should return false when no ticket for server/user", async () => {
      const ticketsOutput = `... user otheruser
... ticket ABC123DEF456
... Host ssl:perforce.example.com:1666`;

      mockExecutor.executeP4Command.mockResolvedValue({
        stdout: ticketsOutput,
        stderr: "",
      });

      const hasTicket = await provider.hasValidTicket(
        "ssl:perforce.example.com:1666",
        "testuser"
      );

      expect(hasTicket).toBe(false);
    });

    it("should return false when no tickets exist", async () => {
      mockExecutor.executeP4Command.mockResolvedValue({
        stdout: "",
        stderr: "",
      });

      const hasTicket = await provider.hasValidTicket(
        "ssl:perforce.example.com:1666",
        "testuser"
      );

      expect(hasTicket).toBe(false);
    });

    it("should return false when getTickets fails", async () => {
      mockExecutor.executeP4Command.mockRejectedValue(
        new Error("Connection refused")
      );

      const hasTicket = await provider.hasValidTicket(
        "ssl:perforce.example.com:1666",
        "testuser"
      );

      expect(hasTicket).toBe(false);
    });
  });
});
