/**
 * CLI Provider Implementation
 *
 * Uses the P4 CLI (command line interface) to execute Perforce commands.
 * This is the fallback provider when the native API is not available.
 */

import type { P4Provider } from "../../types";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../../../shared/types/p4";
import { executeP4Command } from "./executor";
import { parseChangesOutput, parseUserOutput } from "./parser";

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
}
