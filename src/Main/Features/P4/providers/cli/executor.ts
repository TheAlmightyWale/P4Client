import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface ExecResult {
  stdout: string;
  stderr: string;
}

export interface P4CommandOptions {
  /** Override P4PORT for this command */
  P4PORT?: string;
  /** Override P4USER for this command */
  P4USER?: string;
  /** Override P4CLIENT for this command */
  P4CLIENT?: string;
}

/**
 * Executes a P4 command and returns the output
 * @param command - The p4 command arguments, e.g. 'changes -s submitted -m 10'
 * @param options - Optional environment overrides for P4PORT, P4USER, P4CLIENT
 * @returns Promise with stdout and stderr
 */
export async function executeP4Command(
  command: string,
  options?: P4CommandOptions
): Promise<ExecResult> {
  // Build command with optional port override
  let fullCommand = "p4 -ztag";

  if (options?.P4PORT) {
    fullCommand += ` -p ${options.P4PORT}`;
  }
  if (options?.P4USER) {
    fullCommand += ` -u ${options.P4USER}`;
  }
  if (options?.P4CLIENT) {
    fullCommand += ` -c ${options.P4CLIENT}`;
  }

  fullCommand += ` ${command}`;

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
