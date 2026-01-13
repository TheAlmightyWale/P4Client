import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface ExecResult {
  stdout: string;
  stderr: string;
}

/**
 * Executes a P4 command and returns the output
 * @param command - The p4 command arguments, e.g. 'changes -s submitted -m 10'
 * @returns Promise with stdout and stderr
 */
export async function executeP4Command(command: string): Promise<ExecResult> {
  // Add -ztag as a global option for tagged output format
  const fullCommand = `p4 -ztag ${command}`;

  try {
    const { stdout, stderr } = await execAsync(fullCommand);
    return { stdout, stderr };
  } catch (error) {
    // exec throws on non-zero exit codes
    const execError = error as {
      stdout?: string;
      stderr?: string;
      message: string;
    };
    throw new Error(execError.stderr || execError.message);
  }
}
