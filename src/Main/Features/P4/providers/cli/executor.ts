import { exec, spawn } from "child_process";
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
  /** Override P4TICKET for this command */
  P4TICKET?: string;
}

export interface P4CommandExecOptions {
  /** Additional command line arguments */
  args?: string[];
  /** Input to pass to stdin */
  input?: string;
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

  // Build environment with optional ticket
  const env = { ...process.env };
  if (options?.P4TICKET) {
    env.P4TICKET = options.P4TICKET;
  }

  try {
    const { stdout, stderr } = await execAsync(fullCommand, { env });
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

/**
 * Executes a P4 command with stdin input (for login)
 * @param command - The p4 command (e.g., 'login')
 * @param options - Environment overrides
 * @param execOptions - Execution options including stdin input
 * @returns Promise with stdout and stderr
 */
export async function executeP4CommandWithInput(
  command: string,
  options?: P4CommandOptions,
  execOptions?: P4CommandExecOptions
): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    // Build command arguments
    const args: string[] = ["-ztag"];

    if (options?.P4PORT) {
      args.push("-p", options.P4PORT);
    }
    if (options?.P4USER) {
      args.push("-u", options.P4USER);
    }
    if (options?.P4CLIENT) {
      args.push("-c", options.P4CLIENT);
    }

    // Add the command
    args.push(...command.split(" "));

    // Add any additional args
    if (execOptions?.args) {
      args.push(...execOptions.args);
    }

    // Build environment
    const env = { ...process.env };
    if (options?.P4TICKET) {
      env.P4TICKET = options.P4TICKET;
    }

    const p4Process = spawn("p4", args, { env });

    let stdout = "";
    let stderr = "";

    p4Process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    p4Process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    p4Process.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(stderr || `p4 command failed with code ${code}`));
      }
    });

    p4Process.on("error", (error) => {
      reject(error);
    });

    // Write input to stdin if provided
    if (execOptions?.input) {
      p4Process.stdin.write(execOptions.input);
      p4Process.stdin.end();
    }
  });
}
