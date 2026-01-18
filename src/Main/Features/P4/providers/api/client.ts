/**
 * P4 API Client Wrapper
 *
 * Wraps the p4api package to provide a consistent interface for P4 operations.
 */

import P4 from "p4api";
import { getP4Config } from "../../config";

export interface P4CommandResult {
  stat?: Record<string, string>[];
  error?: { data: string; severity: number; generic: number }[];
  info?: { data: string; level: number }[];
}

export interface P4LoginCommandResult {
  ticket?: string;
  error?: string;
}

export class P4Error extends Error {
  constructor(
    message: string,
    public readonly errors?: { data: string; severity: number }[]
  ) {
    super(message);
    this.name = "P4Error";
  }
}

export interface P4ClientOptions {
  P4PORT?: string;
  P4USER?: string;
  P4CLIENT?: string;
  P4TICKET?: string;
}

export class P4Client {
  private p4: InstanceType<typeof P4> | null = null;
  private connected = false;
  private options?: P4ClientOptions;

  constructor(options?: P4ClientOptions) {
    this.options = options;
    this.initializeClient();
  }

  private initializeClient(): void {
    const config = getP4Config();

    const p4Options: Record<string, string | undefined> = {
      P4PORT: this.options?.P4PORT || config.port || process.env.P4PORT,
      P4USER: this.options?.P4USER || config.user || process.env.P4USER,
      P4CLIENT: this.options?.P4CLIENT || config.client || process.env.P4CLIENT,
    };

    // Add ticket if provided
    if (this.options?.P4TICKET) {
      p4Options.P4TICKET = this.options.P4TICKET;
    }

    this.p4 = new P4(p4Options);
  }

  async connect(): Promise<void> {
    if (!this.connected && this.p4) {
      // p4api handles connection automatically on first command
      // but we can verify connectivity here
      this.connected = true;
    }
  }

  async runCommand(cmd: string, ...args: string[]): Promise<P4CommandResult> {
    if (!this.p4) {
      throw new P4Error("P4 client not initialized");
    }

    const result = await this.p4.cmd(cmd, ...args);

    if (result.error && result.error.length > 0) {
      const errorMessages = result.error
        .map((e: { data: string }) => e.data)
        .join("; ");
      throw new P4Error(errorMessages, result.error);
    }

    return result;
  }

  /**
   * Run login command with password input
   * The p4api package handles this specially
   */
  async runLoginCommand(password: string): Promise<P4LoginCommandResult> {
    if (!this.p4) {
      throw new P4Error("P4 client not initialized");
    }

    try {
      // p4api login command with -p flag to print ticket
      // Password is passed as input
      const result = await this.p4.cmd("login", "-p", password);

      if (result.error && result.error.length > 0) {
        const errorMessages = result.error
          .map((e: { data: string }) => e.data)
          .join("; ");
        return { error: errorMessages };
      }

      // The ticket is typically in the info or stat output
      if (result.info && result.info.length > 0) {
        // Look for ticket in info messages
        for (const info of result.info) {
          const data = info.data || "";
          // Ticket is usually a hex string
          if (/^[A-F0-9]{32,}$/i.test(data.trim())) {
            return { ticket: data.trim() };
          }
        }
      }

      // Try stat output
      if (result.stat && result.stat.length > 0) {
        const ticket = result.stat[0]?.ticket || result.stat[0]?.Ticket;
        if (ticket) {
          return { ticket };
        }
      }

      return { error: "No ticket received from login" };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.p4 = null;
  }
}
