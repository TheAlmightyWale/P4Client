import type React from "react";
import type { DirEntry } from "../../../shared/types/dir";
import { DirectoryNode } from "./DirectoryNode";

interface DirectoryTreeProps {
  entries: DirEntry[];
  expanded: Set<string>;
  loading: Set<string>;
  childrenMap: Map<string, DirEntry[]>;
  onToggle: (path: string) => void;
}

export const DirectoryTree: React.FC<DirectoryTreeProps> = ({
  entries,
  expanded,
  loading,
  childrenMap,
  onToggle,
}) => {
  return (
    <div className="font-mono text-sm">
      {entries.map((entry) => (
        <DirectoryNode
          key={entry.path}
          entry={entry}
          depth={0}
          expanded={expanded}
          loading={loading}
          childrenMap={childrenMap}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};
