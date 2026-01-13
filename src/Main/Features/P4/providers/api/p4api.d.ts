/**
 * Type declarations for p4api package
 */

declare module "p4api" {
  interface P4Options {
    P4PORT?: string;
    P4USER?: string;
    P4CLIENT?: string;
    P4PASSWD?: string;
    P4CHARSET?: string;
    P4HOST?: string;
    P4LANGUAGE?: string;
    P4TICKETS?: string;
    P4TRUST?: string;
  }

  interface P4Error {
    data: string;
    severity: number;
    generic: number;
  }

  interface P4Info {
    data: string;
    level: number;
  }

  interface P4Result {
    stat?: Record<string, string>[];
    error?: P4Error[];
    info?: P4Info[];
  }

  class P4 {
    constructor(options?: P4Options);
    cmd(command: string, ...args: string[]): Promise<P4Result>;
  }

  export default P4;
}
