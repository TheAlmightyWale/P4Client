import type { ChangelistInfo } from "../../../../../shared/types/p4";

/**
 * Represents a parsed ztag record as key-value pairs
 */
export interface ZtagRecord {
  [key: string]: string;
}

/**
 * Parses P4 -ztag output into an array of records
 * Each record is a dictionary of field names to values
 *
 * Ztag format example:
 * ... change 12345
 * ... time 1705334400
 * ... user jsmith
 * ... client workspace
 * ... status submitted
 * ... desc Fixed login bug
 */
export function parseZtagOutput(output: string): ZtagRecord[] {
  const records: ZtagRecord[] = [];
  let currentRecord: ZtagRecord | null = null;

  const lines = output.split("\n");

  for (const line of lines) {
    // Ztag lines start with "... "
    if (line.startsWith("... ")) {
      const content = line.substring(4); // Remove "... " prefix
      const spaceIndex = content.indexOf(" ");

      if (spaceIndex === -1) {
        // Field with no value - skip
        continue;
      }

      const fieldName = content.substring(0, spaceIndex);
      const fieldValue = content.substring(spaceIndex + 1);

      // "change" field indicates start of new record for changes output
      if (fieldName === "change") {
        if (currentRecord) {
          records.push(currentRecord);
        }
        currentRecord = {};
      }

      // Handle first record if it doesn't start with "change" (e.g., user -o output)
      if (!currentRecord && fieldName !== "change") {
        currentRecord = {};
      }

      if (currentRecord) {
        currentRecord[fieldName] = fieldValue;
      }
    }
  }

  // Push the last record
  if (currentRecord && Object.keys(currentRecord).length > 0) {
    records.push(currentRecord);
  }

  return records;
}

/**
 * Converts ztag records to ChangelistInfo objects
 */
export function ztagToChangelistInfo(
  records: ZtagRecord[],
  status: "submitted" | "pending"
): ChangelistInfo[] {
  return records.map((record) => ({
    id: parseInt(record.change, 10),
    user: record.user,
    client: record.client,
    date: new Date(parseInt(record.time, 10) * 1000), // Unix timestamp to Date
    description: record.desc || "",
    status,
  }));
}

/**
 * Parses p4 -ztag changes output directly to ChangelistInfo
 * Format: ... change <num>, ... time <unix>, ... user <user>, ... client <client>, ... desc <desc>
 */
export function parseChangesOutput(
  output: string,
  status: "submitted" | "pending"
): ChangelistInfo[] {
  const records = parseZtagOutput(output);
  return ztagToChangelistInfo(records, status);
}

/**
 * Parses p4 -ztag user -o output to extract username
 * Format: ... User <username>
 */
export function parseUserOutput(output: string): string | null {
  const records = parseZtagOutput(output);
  if (records.length > 0 && records[0].User) {
    return records[0].User;
  }
  return null;
}

/**
 * Parses Unix timestamp or P4 date format to Date
 * Supports both Unix timestamps (from ztag) and YYYY/MM/DD format (legacy)
 */
export function parseP4Date(dateStr: string): Date {
  // If it's a Unix timestamp (all digits)
  if (/^\d+$/.test(dateStr)) {
    return new Date(parseInt(dateStr, 10) * 1000);
  }
  // Fallback for YYYY/MM/DD format (legacy support)
  const [year, month, day] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}
