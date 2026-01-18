import { executeP4Command } from "../../../../src/Main/Features/P4/providers/cli/executor";
import { exec } from "child_process";
import { promisify } from "util";

// Mock child_process
jest.mock("child_process", () => ({
  exec: jest.fn(),
  spawn: jest.fn(),
}));

jest.mock("util", () => ({
  promisify: jest.fn(),
}));

const mockPromisify = promisify as jest.MockedFunction<typeof promisify>;

describe("P4 CLI Executor", () => {
  let mockExecAsync: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecAsync = jest.fn();
    mockPromisify.mockReturnValue(mockExecAsync);
  });

  it("should execute p4 command with -ztag flag and return output", async () => {
    const mockOutput = "... change 12345\n... user jsmith\n... desc Test";

    mockExecAsync.mockResolvedValue({ stdout: mockOutput, stderr: "" });

    const result = await executeP4Command("changes -s submitted -m 1");

    expect(mockExecAsync).toHaveBeenCalledWith(
      "p4 -ztag changes -s submitted -m 1",
      expect.any(Object)
    );
    expect(result.stdout).toBe(mockOutput);
    expect(result.stderr).toBe("");
  });

  it("should include stderr in result when present", async () => {
    const mockStderr = "Warning: some warning message";

    mockExecAsync.mockResolvedValue({ stdout: "", stderr: mockStderr });

    const result = await executeP4Command("changes");

    expect(result.stderr).toBe(mockStderr);
  });

  it("should throw error on command failure", async () => {
    const errorMessage = "P4 error: Connection refused";

    const error = new Error("Command failed") as Error & { stderr: string };
    error.stderr = errorMessage;
    mockExecAsync.mockRejectedValue(error);

    await expect(executeP4Command("invalid")).rejects.toThrow(errorMessage);
  });

  it("should use error message when stderr is not available", async () => {
    const errorMessage = "Command not found";

    const error = new Error(errorMessage);
    mockExecAsync.mockRejectedValue(error);

    await expect(executeP4Command("invalid")).rejects.toThrow(errorMessage);
  });

  it("should prepend p4 -ztag to the command", async () => {
    mockExecAsync.mockResolvedValue({ stdout: "", stderr: "" });

    await executeP4Command("user -o");

    expect(mockExecAsync).toHaveBeenCalledWith(
      "p4 -ztag user -o",
      expect.any(Object)
    );
  });

  it("should include P4PORT option when provided", async () => {
    mockExecAsync.mockResolvedValue({ stdout: "", stderr: "" });

    await executeP4Command("info", { P4PORT: "ssl:perforce.example.com:1666" });

    expect(mockExecAsync).toHaveBeenCalledWith(
      "p4 -ztag -p ssl:perforce.example.com:1666 info",
      expect.any(Object)
    );
  });

  it("should include P4USER option when provided", async () => {
    mockExecAsync.mockResolvedValue({ stdout: "", stderr: "" });

    await executeP4Command("info", { P4USER: "testuser" });

    expect(mockExecAsync).toHaveBeenCalledWith(
      "p4 -ztag -u testuser info",
      expect.any(Object)
    );
  });

  it("should include P4TICKET in environment when provided", async () => {
    mockExecAsync.mockResolvedValue({ stdout: "", stderr: "" });

    await executeP4Command("login -s", { P4TICKET: "ABC123" });

    expect(mockExecAsync).toHaveBeenCalledWith(
      "p4 -ztag login -s",
      expect.objectContaining({
        env: expect.objectContaining({
          P4TICKET: "ABC123",
        }),
      })
    );
  });
});
