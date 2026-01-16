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

    this.p4 = new P4({
      P4PORT: this.options?.P4PORT || config.port || process.env.P4PORT,
      P4USER: this.options?.P4USER || config.user || process.env.P4USER,
      P4CLIENT: this.options?.P4CLIENT || config.client || process.env.P4CLIENT,
    });
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

  async disconnect(): Promise<void> {
    this.connected = false;
    this.p4 = null;
  }
}
