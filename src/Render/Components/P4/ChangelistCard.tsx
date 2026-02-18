import type React from "react";
import type { PendingChangelistDetail } from "../../../shared/types/p4";
import { shortenPaths } from "../../../shared/utils/shortenPaths";
import { FileList } from "./FileList";

interface ChangelistCardProps {
  changelist: PendingChangelistDetail;
}

export const ChangelistCard: React.FC<ChangelistCardProps> = ({
  changelist,
}) => {
  const { id, description, openedFiles, shelvedFiles } = changelist;

  const shortenedOpened = shortenPaths(openedFiles);
  const shortenedShelved = shortenPaths(shelvedFiles);

  const title = id === 0 ? "Default Changelist" : `#${id}`;
  const desc = id === 0 ? "" : description;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-[var(--color-accent)]">
          {title}
        </span>
        {desc && (
          <span className="text-sm text-[var(--color-text-primary)] truncate">
            {desc}
          </span>
        )}
      </div>

      <FileList files={shortenedOpened} label="Checked Out" />
      <FileList
        files={shortenedShelved}
        label="Shelved"
        labelClassName="text-xs font-semibold text-[var(--color-warning)] uppercase tracking-wide mb-1"
      />
    </div>
  );
};
