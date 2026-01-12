import { executeP4Command } from "./executor";
import { parseChangesOutput, parseUserOutput } from "./parser";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "./types";

// Re-export types for external use
export * from "./types";

/**
 * Fetches submitted changelists from Perforce
 */
export async function getSubmittedChanges(
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

/**
 * Fetches pending changelists for a user
 */
export async function getPendingChanges(
  options: GetPendingChangesOptions = {}
): Promise<P4Result<ChangelistInfo[]>> {
  try {
    let user = options.user;

    // If no user specified, get current user
    if (!user) {
      const currentUser = await getCurrentUser();
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

/**
 * Gets the current Perforce user
 */
export async function getCurrentUser(): Promise<P4Result<string>> {
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
