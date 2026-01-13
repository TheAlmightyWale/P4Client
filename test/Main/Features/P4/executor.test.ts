import { executeP4Command } from "../../../../src/Main/Features/P4/providers/cli/executor";
import { exec } from "child_process";

// Mock child_process
jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

const mockExec = exec as jest.MockedFunction<typeof exec>;

describe("P4 CLI Executor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should execute p4 command with -ztag flag and return output", async () => {
    const mockOutput = "... change 12345\n... user jsmith\n... desc Test";

    mockExec.mockImplementation((cmd, callback: unknown) => {
      (
        callback as (
          error: null,
          result: { stdout: string; stderr: string }
        ) => void
      )(null, { stdout: mockOutput, stderr: "" });
      return {} as ReturnType<typeof exec>;
    });

    const result = await executeP4Command("changes -s submitted -m 1");

    expect(mockExec).toHaveBeenCalledWith(
      "p4 -ztag changes -s submitted -m 1",
      expect.any(Function)
    );
    expect(result.stdout).toBe(mockOutput);
    expect(result.stderr).toBe("");
  });

  it("should include stderr in result when present", async () => {
    const mockStderr = "Warning: some warning message";

    mockExec.mockImplementation((cmd, callback: unknown) => {
      (
        callback as (
          error: null,
          result: { stdout: string; stderr: string }
        ) => void
      )(null, { stdout: "", stderr: mockStderr });
      return {} as ReturnType<typeof exec>;
    });

    const result = await executeP4Command("changes");

    expect(result.stderr).toBe(mockStderr);
  });

  it("should throw error on command failure", async () => {
    const errorMessage = "P4 error: Connection refused";

    mockExec.mockImplementation((cmd, callback: unknown) => {
      const error = new Error("Command failed") as Error & { stderr: string };
      error.stderr = errorMessage;
      (callback as (error: Error, result: null) => void)(error, null);
      return {} as ReturnType<typeof exec>;
    });

    await expect(executeP4Command("invalid")).rejects.toThrow(errorMessage);
  });

  it("should use error message when stderr is not available", async () => {
    const errorMessage = "Command not found";

    mockExec.mockImplementation((cmd, callback: unknown) => {
      const error = new Error(errorMessage);
      (callback as (error: Error, result: null) => void)(error, null);
      return {} as ReturnType<typeof exec>;
    });

    await expect(executeP4Command("invalid")).rejects.toThrow(errorMessage);
  });

  it("should prepend p4 -ztag to the command", async () => {
    mockExec.mockImplementation((cmd, callback: unknown) => {
      (
        callback as (
          error: null,
          result: { stdout: string; stderr: string }
        ) => void
      )(null, { stdout: "", stderr: "" });
      return {} as ReturnType<typeof exec>;
    });

    await executeP4Command("user -o");

    expect(mockExec).toHaveBeenCalledWith(
      "p4 -ztag user -o",
      expect.any(Function)
    );
  });
});
