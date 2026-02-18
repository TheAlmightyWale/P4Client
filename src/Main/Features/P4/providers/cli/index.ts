/**
 * CLI Provider Implementation
 *
 * Uses the P4 CLI (command line interface) to execute Perforce commands.
 * This is the fallback provider when the native API is not available.
 */

import type {
  P4Provider,
  ServerInfo,
  P4LoginResult,
  P4TicketInfo,
} from "../../types";
import type {
  ChangelistInfo,
  PendingChangelistDetail,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../../../shared/types/p4";
import { executeP4Command, executeP4CommandWithInput } from "./executor";
import {
  parseChangesOutput,
  parseUserOutput,
  parseInfoOutput,
  parseSetOutput,
  parseTicketsOutput,
  parseZtagOutput,
  parseOpenedOutput,
  parseShelvedFiles,
} from "./parser";

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

  async getPendingChangesDetailed(): Promise<
    P4Result<PendingChangelistDetail[]>
  > {
    try {
      // 1. Get current user
      const userResult = await this.getCurrentUser();
      if (!userResult.success || !userResult.data) {
        return { success: false, error: "Could not determine current user" };
      }
      const user = userResult.data;

      // 2. Fetch pending CLs
      const { stdout: changesOut } = await executeP4Command(
        `changes -s pending -u ${user}`
      );
      const changeRecords = parseZtagOutput(changesOut);

      // 3. Fetch all opened files
      const { stdout: openedOut } = await executeP4Command(`opened -u ${user}`);
      const openedFiles = parseOpenedOutput(openedOut);

      // 4. Group opened files by CL number
      const openedByChange = new Map<string, string[]>();
      for (const file of openedFiles) {
        const key = file.change;
        if (!openedByChange.has(key)) {
          openedByChange.set(key, []);
        }
        openedByChange.get(key)!.push(file.depotFile);
      }

      // 5. Fetch shelved files for numbered CLs
      const shelvedByChange = new Map<string, string[]>();
      const numberedCLs = changeRecords.map((r) => r.change).filter(Boolean);
      if (numberedCLs.length > 0) {
        try {
          const { stdout: describeOut } = await executeP4Command(
            `describe -S ${numberedCLs.join(" ")}`
          );
          const describeRecords = parseZtagOutput(describeOut);
          for (const record of describeRecords) {
            if (record.change) {
              shelvedByChange.set(
                record.change,
                parseShelvedFiles(record)
              );
            }
          }
        } catch {
          // Shelved file fetch is best-effort
        }
      }

      // 6. Build result — numbered CLs first
      const changelists: PendingChangelistDetail[] = changeRecords.map((r) => ({
        id: parseInt(r.change, 10),
        description: r.desc || "",
        date: r.time
          ? new Date(parseInt(r.time, 10) * 1000)
          : undefined,
        status: "pending" as const,
        openedFiles: openedByChange.get(r.change) || [],
        shelvedFiles: shelvedByChange.get(r.change) || [],
      }));

      // 7. Add default CL if it has files
      const defaultFiles = openedByChange.get("default");
      if (defaultFiles && defaultFiles.length > 0) {
        changelists.push({
          id: 0,
          description: "Default Changelist",
          status: "pending",
          openedFiles: defaultFiles,
          shelvedFiles: [],
        });
      }

      return { success: true, data: changelists };
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
      // p4 login reads password from stdin
      // Remove -p flag - let p4 store ticket in ticket file
      await executeP4CommandWithInput(
        "login",
        {
          P4PORT: p4port,
          P4USER: username,
        },
        {
          input: password,
        }
      );

      return {
        success: true,
        data: { success: true },
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

  async getSet(): Promise<P4Result<Record<string, string>>> {
    try {
      const { stdout } = await executeP4Command("set");
      const variables = parseSetOutput(stdout);
      return { success: true, data: variables };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get p4 set variables",
      };
    }
  }

  async getTickets(): Promise<P4Result<P4TicketInfo[]>> {
    try {
      const { stdout } = await executeP4Command("tickets");
      const tickets = parseTicketsOutput(stdout);
      return { success: true, data: tickets };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get tickets",
      };
    }
  }

  async hasValidTicket(p4port: string, username: string): Promise<boolean> {
    const result = await this.getTickets();
    if (!result.success || !result.data) {
      return false;
    }

    return result.data.some(
      (ticket) => ticket.host === p4port && ticket.user === username
    );
  }
}
