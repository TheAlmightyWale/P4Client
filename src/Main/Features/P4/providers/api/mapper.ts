/**
 * P4 API Response Mapper
 *
 * Maps p4api response records to our internal types.
 */

import type { ChangelistInfo } from "../../../../../shared/types/p4";

interface P4ChangeRecord {
  change: string;
  user: string;
  client: string;
  time: string;
  desc: string;
  status?: string;
}

interface P4UserRecord {
  User: string;
  Email?: string;
  FullName?: string;
}

/**
 * Maps a p4api change record to our ChangelistInfo type
 */
export function mapChangeRecord(
  record: P4ChangeRecord,
  status: "submitted" | "pending"
): ChangelistInfo {
  return {
    id: parseInt(record.change, 10),
    user: record.user,
    client: record.client,
    date: new Date(parseInt(record.time, 10) * 1000), // Unix timestamp to Date
    description: record.desc || "",
    status: (record.status as "submitted" | "pending") || status,
  };
}

/**
 * Maps an array of p4api change records
 */
export function mapChangeRecords(
  records: P4ChangeRecord[],
  status: "submitted" | "pending"
): ChangelistInfo[] {
  return records.map((record) => mapChangeRecord(record, status));
}

/**
 * Extracts username from p4api user record
 */
export function mapUserRecord(record?: P4UserRecord): string | null {
  return record?.User || null;
}
