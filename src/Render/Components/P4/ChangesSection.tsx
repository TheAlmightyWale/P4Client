import type React from "react";
import { useP4Changes } from "../../Hooks/useP4Changes";
import { Button } from "../button";
import { Spinner } from "../common/Spinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { ChangesTable } from "./ChangesTable";

interface ChangesSectionProps {
  maxCount?: number;
  depotPath?: string;
}

export const ChangesSection: React.FC<ChangesSectionProps> = ({
  maxCount = 25,
  depotPath,
}) => {
  const { changes, loading, error, refresh } = useP4Changes({
    maxCount,
    depotPath,
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Historical Changes
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={refresh}
          disabled={loading}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {loading && !changes.length ? (
        <div className="flex flex-col items-center gap-2 py-8">
          <Spinner size="lg" className="text-[var(--color-accent)]" />
          <p className="text-[var(--color-text-muted)]">Loading changes...</p>
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refresh} />
      ) : (
        <ChangesTable changes={changes} />
      )}
    </div>
  );
};

export default ChangesSection;
