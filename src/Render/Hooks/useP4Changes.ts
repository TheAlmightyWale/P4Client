import { useState, useEffect, useCallback } from "react";
import type { ChangelistInfo } from "../../shared/types/p4";

interface UseP4ChangesOptions {
  maxCount?: number;
  depotPath?: string;
  autoFetch?: boolean;
}

interface UseP4ChangesReturn {
  changes: ChangelistInfo[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useP4Changes(
  options: UseP4ChangesOptions = {}
): UseP4ChangesReturn {
  const { maxCount = 50, depotPath, autoFetch = true } = options;

  const [changes, setChanges] = useState<ChangelistInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChanges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await window.p4API.getSubmittedChanges({
        maxCount,
        depotPath,
      });

      if (result.success && result.data) {
        setChanges(result.data);
      } else {
        setError(result.error || "Failed to fetch changes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [maxCount, depotPath]);

  useEffect(() => {
    if (autoFetch) {
      fetchChanges();
    }
  }, [autoFetch, fetchChanges]);

  return {
    changes,
    loading,
    error,
    refresh: fetchChanges,
  };
}
