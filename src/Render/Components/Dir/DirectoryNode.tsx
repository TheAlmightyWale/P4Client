import type React from "react";
import type { DirEntry } from "../../../shared/types/dir";
import { Spinner } from "../common/Spinner";

interface DirectoryNodeProps {
  entry: DirEntry;
  depth: number;
  expanded: Set<string>;
  loading: Set<string>;
  childrenMap: Map<string, DirEntry[]>;
  onToggle: (path: string) => void;
}

export const DirectoryNode: React.FC<DirectoryNodeProps> = ({
  entry,
  depth,
  expanded,
  loading,
  childrenMap,
  onToggle,
}) => {
  const isExpanded = expanded.has(entry.path);
  const isLoading = loading.has(entry.path);
  const children = childrenMap.get(entry.path);

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 cursor-pointer rounded
                   hover:bg-[var(--color-bg-tertiary)] transition-colors"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => onToggle(entry.path)}
      >
        <span className="w-4 mr-1 text-[var(--color-accent)] text-xs flex-shrink-0 flex items-center justify-center">
          {isLoading ? (
            <Spinner size="sm" />
          ) : isExpanded ? (
            "\u25BE"
          ) : (
            "\u25B8"
          )}
        </span>
        <span className="text-[var(--color-text-primary)] text-sm truncate">
          {entry.name}
        </span>
      </div>

      {isExpanded && children && children.map((child) => (
        <DirectoryNode
          key={child.path}
          entry={child}
          depth={depth + 1}
          expanded={expanded}
          loading={loading}
          childrenMap={childrenMap}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};
