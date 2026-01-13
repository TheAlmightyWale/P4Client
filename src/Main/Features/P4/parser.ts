import type { ChangelistInfo } from "../../../shared/types/p4";

/**
 * Parses the output of 'p4 changes' command
 * Format: Change <num> on <date> by <user>@<client> *<status>* '<description>'
 * Example: Change 12345 on 2024/01/15 by jsmith@workspace *submitted* 'Fixed bug in login'
 */
export function parseChangesOutput(
  output: string,
  status: "submitted" | "pending"
): ChangelistInfo[] {
  const lines = output
    .trim()
    .split("\n")
    .filter((line) => line.trim());
  const changes: ChangelistInfo[] = [];

  const changeRegex =
    /^Change (\d+) on (\d{4}\/\d{2}\/\d{2}) by ([^@]+)@(\S+) \*(\w+)\* '(.*)'/;

  for (const line of lines) {
    const match = line.match(changeRegex);
    if (match) {
      const [, id, dateStr, user, client, , description] = match;
      changes.push({
        id: parseInt(id, 10),
        user,
        client,
        date: parseP4Date(dateStr),
        description: description.replace(/'$/, ""), // Remove trailing quote if present
        status,
      });
    }
  }

  return changes;
}

/**
 * Parses P4 date format (YYYY/MM/DD) to JavaScript Date
 */
export function parseP4Date(dateStr: string): Date {
  const [year, month, day] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Parses the output of 'p4 user -o' to extract the username
 */
export function parseUserOutput(output: string): string | null {
  const match = output.match(/^User:\s+(\S+)/m);
  return match ? match[1] : null;
}
