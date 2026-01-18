/**
 * CLI Provider Implementation
 *
 * Uses the P4 CLI (command line interface) to execute Perforce commands.
 * This is the fallback provider when the native API is not available.
 */

import type { P4Provider, ServerInfo, P4LoginResult } from "../../types";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../../../shared/types/p4";
import { executeP4Command, executeP4CommandWithInput } from "./executor";
import { parseChangesOutput, parseUserOutput, parseInfoOutput } from "./parser";

export class CliProvider implements P4Provider {
  async getSubmittedChanges(
    options: GetSubmittedChangesOptions = {}
  ): Promise<P4Result<ChangelistInfo[]>> {
    try {
      let command = "changes -s submitted";

      if (options.maxCount) {
        command += ` -m ${options.maxCount}`;
      }

      if (options.depotPath) {
        command += ` ${options.depotPath}`;
      }

      const { stdout } = await executeP4Command(command);
      const changes = parseChangesOutput(stdout, "submitted");

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

      const command = `changes -s pending -u ${user}`;
      const { stdout } = await executeP4Command(command);
      const changes = parseChangesOutput(stdout, "pending");

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
      const { stdout } = await executeP4Command("user -o");
      const user = parseUserOutput(stdout);

      if (!user) {
        return { success: false, error: "Could not parse user from output" };
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
      const { stdout } = await executeP4Command("info", { P4PORT: p4port });
      const serverInfo = parseInfoOutput(stdout);
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
      // p4 login reads password from stdin and -p prints the ticket
      const { stdout } = await executeP4CommandWithInput(
        "login -p",
        {
          P4PORT: p4port,
          P4USER: username,
        },
        {
          input: password,
        }
      );

      // The ticket is printed to stdout
      const ticket = stdout.trim();

      if (!ticket) {
        return {
          success: false,
          error: "No ticket received from login",
        };
      }

      return {
        success: true,
        data: { ticket },
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
      await executeP4Command("logout", {
        P4PORT: p4port,
        P4USER: username,
      });

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
      // p4 login -s checks ticket status without prompting
      await executeP4Command("login -s", {
        P4PORT: p4port,
        P4USER: username,
        P4TICKET: ticket,
      });

      return true;
    } catch {
      return false;
    }
  }
}
