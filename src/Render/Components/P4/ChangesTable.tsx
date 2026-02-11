import { clsx } from "clsx";
import type React from "react";
import type { ChangelistInfo } from "../../../shared/types/p4";

interface ChangesTableProps {
  changes: ChangelistInfo[];
  className?: string;
}

export const ChangesTable: React.FC<ChangesTableProps> = ({
  changes,
  className = "",
}) => {
  const formatDate = (dateValue: Date | string): string => {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (changes.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-muted)]">
        No changes found
      </div>
    );
  }

  return (
    <div className={clsx("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-3 text-right text-sm font-semibold text-[var(--color-text-secondary)] w-24">
              CL #
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-secondary)]">
              Description
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)] w-32">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change) => (
            <tr
              key={change.id}
              className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <td className="px-4 py-3 text-right font-mono text-[var(--color-accent)]">
                {change.id}
              </td>
              <td className="px-4 py-3 text-[var(--color-text-primary)] truncate max-w-xs">
                {change.description}
              </td>
              <td className="px-4 py-3 text-center text-[var(--color-text-secondary)] text-sm">
                {formatDate(change.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChangesTable;
