/**
 * API Provider Implementation
 *
 * Uses the p4api package (native bindings to Helix Core C++ API)
 * for Perforce operations.
 */

import type { P4Provider, ServerInfo, P4LoginResult } from "../../types";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../../../shared/types/p4";
import { P4Client } from "./client";
import { mapChangeRecords, mapUserRecord, mapInfoRecord } from "./mapper";

export class ApiProvider implements P4Provider {
  private client: P4Client;

  constructor() {
    this.client = new P4Client();
  }

  async initialize(): Promise<void> {
    await this.client.connect();
  }

  async dispose(): Promise<void> {
    await this.client.disconnect();
  }

  async getSubmittedChanges(
    options: GetSubmittedChangesOptions = {}
  ): Promise<P4Result<ChangelistInfo[]>> {
    try {
      const args = ["-s", "submitted"];

      if (options.maxCount) {
        args.push("-m", options.maxCount.toString());
      }

      if (options.depotPath) {
        args.push(options.depotPath);
      }

      const result = await this.client.runCommand("changes", ...args);
      const changes = mapChangeRecords(
        (result.stat as unknown as Parameters<typeof mapChangeRecords>[0]) ||
          [],
        "submitted"
      );

      return { success: true, data: changes };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getPendingChanges(
    options: GetPendingChangesOptions = {}
  ): Promise<P4Result<ChangelistInfo[]>> {
    try {
      let user = options.user;

      if (!user) {
        const currentUser = await this.getCurrentUser();
        if (!currentUser.success || !currentUser.data) {
          return { success: false, error: "Could not determine current user" };
        }
        user = currentUser.data;
      }

      const args = ["-s", "pending", "-u", user];
      const result = await this.client.runCommand("changes", ...args);
      const changes = mapChangeRecords(
        (result.stat as unknown as Parameters<typeof mapChangeRecords>[0]) ||
          [],
        "pending"
      );

      return { success: true, data: changes };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getCurrentUser(): Promise<P4Result<string>> {
    try {
      const result = await this.client.runCommand("user", "-o");
      const user = mapUserRecord(
        result.stat?.[0] as unknown as Parameters<typeof mapUserRecord>[0]
      );

      if (!user) {
        return { success: false, error: "Could not get user from response" };
      }

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async runInfoCommand(p4port: string): Promise<P4Result<ServerInfo>> {
    try {
      // Create a temporary client with the specified P4PORT
      const tempClient = new P4Client({ P4PORT: p4port });
      await tempClient.connect();
      const result = await tempClient.runCommand("info");
      await tempClient.disconnect();

      const serverInfo = mapInfoRecord(
        result.stat?.[0] as unknown as Parameters<typeof mapInfoRecord>[0]
      );
      return { success: true, data: serverInfo };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get server info",
      };
    }
  }

  async login(
    p4port: string,
    username: string,
    password: string
  ): Promise<P4Result<P4LoginResult>> {
    try {
      // Create a temporary client with the specified P4PORT and P4USER
      const tempClient = new P4Client({ P4PORT: p4port, P4USER: username });
      await tempClient.connect();

      // Run login command with password
      // The p4api package handles password input differently
      const result = await tempClient.runLoginCommand(password);
      await tempClient.disconnect();

      if (result.ticket) {
        return {
          success: true,
          data: { ticket: result.ticket },
        };
      }

      return {
        success: false,
        error: "No ticket received from login",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  async logout(p4port: string, username: string): Promise<P4Result<void>> {
    try {
      const tempClient = new P4Client({ P4PORT: p4port, P4USER: username });
      await tempClient.connect();
      await tempClient.runCommand("logout");
      await tempClient.disconnect();

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  }

  async validateTicket(
    p4port: string,
    username: string,
    ticket: string
  ): Promise<boolean> {
    try {
      const tempClient = new P4Client({
        P4PORT: p4port,
        P4USER: username,
        P4TICKET: ticket,
      });
      await tempClient.connect();

      // p4 login -s checks ticket status
      await tempClient.runCommand("login", "-s");
      await tempClient.disconnect();

      return true;
    } catch {
      return false;
    }
  }
}
