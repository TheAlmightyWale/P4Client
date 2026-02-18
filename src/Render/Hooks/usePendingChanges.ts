import { useState, useEffect, useCallback } from "react";
import type { PendingChangelistDetail } from "../../shared/types/p4";

interface UsePendingChangesReturn {
  changelists: PendingChangelistDetail[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePendingChanges(
  autoFetch = true
): UsePendingChangesReturn {
  const [changelists, setChangelists] = useState<PendingChangelistDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChangelists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await window.p4API.getPendingChangesDetailed();

      if (result.success && result.data) {
        setChangelists(result.data);
      } else {
        setError(result.error || "Failed to fetch pending changes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchChangelists();
    }
  }, [autoFetch, fetchChangelists]);

  return {
    changelists,
    loading,
    error,
    refresh: fetchChangelists,
  };
}
