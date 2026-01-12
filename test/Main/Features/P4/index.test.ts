import {
  getSubmittedChanges,
  getPendingChanges,
  getCurrentUser,
} from "../../../../src/Main/Features/P4/index";
import * as executor from "../../../../src/Main/Features/P4/executor";

// Mock the executor module
jest.mock("../../../../src/Main/Features/P4/executor");

const mockExecuteP4Command = executor.executeP4Command as jest.MockedFunction<
  typeof executor.executeP4Command
>;

describe("P4 Feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSubmittedChanges", () => {
    it("should fetch submitted changes with default options", async () => {
      mockExecuteP4Command.mockResolvedValue({
        stdout: `Change 12345 on 2024/01/15 by jsmith@ws *submitted* 'Test change'`,
        stderr: "",
      });

      const result = await getSubmittedChanges();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].id).toBe(12345);
      expect(mockExecuteP4Command).toHaveBeenCalledWith("changes -s submitted");
    });

    it("should apply maxCount option", async () => {
      mockExecuteP4Command.mockResolvedValue({ stdout: "", stderr: "" });

      await getSubmittedChanges({ maxCount: 10 });

      expect(mockExecuteP4Command).toHaveBeenCalledWith(
        "changes -s submitted -m 10"
      );
    });

    it("should apply depotPath option", async () => {
      mockExecuteP4Command.mockResolvedValue({ stdout: "", stderr: "" });

      await getSubmittedChanges({ depotPath: "//depot/main/..." });

      expect(mockExecuteP4Command).toHaveBeenCalledWith(
        "changes -s submitted //depot/main/..."
      );
    });

    it("should apply both maxCount and depotPath options", async () => {
      mockExecuteP4Command.mockResolvedValue({ stdout: "", stderr: "" });

      await getSubmittedChanges({ maxCount: 5, depotPath: "//depot/..." });

      expect(mockExecuteP4Command).toHaveBeenCalledWith(
        "changes -s submitted -m 5 //depot/..."
      );
    });

    it("should handle errors gracefully", async () => {
      mockExecuteP4Command.mockRejectedValue(new Error("P4 not found"));

      const result = await getSubmittedChanges();

      expect(result.success).toBe(false);
      expect(result.error).toBe("P4 not found");
      expect(result.data).toBeUndefined();
    });

    it("should return empty array when no changes found", async () => {
      mockExecuteP4Command.mockResolvedValue({ stdout: "", stderr: "" });

      const result = await getSubmittedChanges();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });
  });

  describe("getPendingChanges", () => {
    it("should fetch pending changes for specified user", async () => {
      mockExecuteP4Command.mockResolvedValue({
        stdout: `Change 12346 on 2024/01/16 by jsmith@ws *pending* 'WIP'`,
        stderr: "",
      });

      const result = await getPendingChanges({ user: "jsmith" });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].status).toBe("pending");
      expect(mockExecuteP4Command).toHaveBeenCalledWith(
        "changes -s pending -u jsmith"
      );
    });

    it("should get current user if not specified", async () => {
      // First call for user -o, second for changes
      mockExecuteP4Command
        .mockResolvedValueOnce({ stdout: "User:   jsmith\n", stderr: "" })
        .mockResolvedValueOnce({ stdout: "", stderr: "" });

      await getPendingChanges();

      expect(mockExecuteP4Command).toHaveBeenCalledWith("user -o");
      expect(mockExecuteP4Command).toHaveBeenCalledWith(
        "changes -s pending -u jsmith"
      );
    });

    it("should return error if current user cannot be determined", async () => {
      mockExecuteP4Command.mockResolvedValue({
        stdout: "Invalid output",
        stderr: "",
      });

      const result = await getPendingChanges();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Could not determine current user");
    });

    it("should handle errors gracefully", async () => {
      mockExecuteP4Command.mockRejectedValue(new Error("Connection refused"));

      const result = await getPendingChanges({ user: "jsmith" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection refused");
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user", async () => {
      mockExecuteP4Command.mockResolvedValue({
        stdout: "User:   jsmith\nEmail:  jsmith@example.com",
        stderr: "",
      });

      const result = await getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toBe("jsmith");
    });

    it("should return error if user cannot be parsed", async () => {
      mockExecuteP4Command.mockResolvedValue({
        stdout: "Invalid output",
        stderr: "",
      });

      const result = await getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Could not parse user from output");
    });

    it("should handle errors gracefully", async () => {
      mockExecuteP4Command.mockRejectedValue(new Error("P4 not configured"));

      const result = await getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.error).toBe("P4 not configured");
    });
  });
});
