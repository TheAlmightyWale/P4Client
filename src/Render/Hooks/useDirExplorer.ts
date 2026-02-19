import { useState, useCallback } from "react";
import type { DirEntry } from "../../shared/types/dir";
import { DIR_FETCH_DEPTH } from "../../shared/types/dir";

interface UseDirExplorerReturn {
  workspaceRoot: string | null;
  rootEntries: DirEntry[];
  expanded: Set<string>;
  loading: Set<string>;
  childrenMap: Map<string, DirEntry[]>;
  rootLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  toggleExpand: (dirPath: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Recursively unpacks a tree-structured DirEntry[] response into the flat
 * childrenMap used by the renderer. For each entry that has pre-fetched
 * `children`, adds a childrenMap entry (parentPath -> children) and recurses.
 */
function unpackChildren(
  entries: DirEntry[],
  map: Map<string, DirEntry[]>,
): void {
  for (const entry of entries) {
    if (entry.children !== undefined) {
      const flatChildren = entry.children.map(({ name, path }) => ({ name, path }));
      map.set(entry.path, flatChildren);
      unpackChildren(entry.children, map);
    }
  }
}

export function useDirExplorer(): UseDirExplorerReturn {
  const [workspaceRoot, setWorkspaceRoot] = useState<string | null>(null);
  const [rootEntries, setRootEntries] = useState<DirEntry[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [childrenMap, setChildrenMap] = useState<Map<string, DirEntry[]>>(new Map());
  const [rootLoading, setRootLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    setRootLoading(true);
    setError(null);
    try {
      const rootResult = await window.dirAPI.getWorkspaceRoot();
      if (!rootResult.success || !rootResult.data) {
        setError(rootResult.error || "Failed to get workspace root");
        return;
      }
      setWorkspaceRoot(rootResult.data);

      const listResult = await window.dirAPI.listDirectories({
        path: rootResult.data,
        depth: DIR_FETCH_DEPTH,
      });
      if (!listResult.success || !listResult.data) {
        setError(listResult.error || "Failed to list directories");
        return;
      }

      const newMap = new Map<string, DirEntry[]>();
      unpackChildren(listResult.data, newMap);
      setChildrenMap(newMap);

      setRootEntries(listResult.data.map(({ name, path }) => ({ name, path })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRootLoading(false);
    }
  }, []);

  const toggleExpand = useCallback(async (dirPath: string) => {
    if (expanded.has(dirPath)) {
      setExpanded((prev) => {
        const next = new Set(prev);
        next.delete(dirPath);
        return next;
      });
      return;
    }

    setExpanded((prev) => new Set(prev).add(dirPath));

    if (childrenMap.has(dirPath)) return;

    setLoading((prev) => new Set(prev).add(dirPath));
    try {
      const result = await window.dirAPI.listDirectories({
        path: dirPath,
        depth: DIR_FETCH_DEPTH,
      });
      if (result.success && result.data) {
        setChildrenMap((prev) => {
          const next = new Map(prev);
          next.set(dirPath, result.data!.map(({ name, path }) => ({ name, path })));
          unpackChildren(result.data!, next);
          return next;
        });
      }
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(dirPath);
        return next;
      });
    }
  }, [expanded, childrenMap]);

  const refresh = useCallback(async () => {
    setExpanded(new Set());
    setChildrenMap(new Map());
    setRootEntries([]);
    setWorkspaceRoot(null);
    await initialize();
  }, [initialize]);

  return {
    workspaceRoot,
    rootEntries,
    expanded,
    loading,
    childrenMap,
    rootLoading,
    error,
    initialize,
    toggleExpand,
    refresh,
  };
}
