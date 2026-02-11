import type React from "react";
import { useP4Changes } from "../../Hooks/useP4Changes";
import { useServers } from "../../Hooks/useServers";
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
  const { sessionStatus, loading: sessionLoading } = useServers();
  const { changes, loading, error, refresh } = useP4Changes({
    maxCount,
    depotPath,
  });

  const isLoading = sessionLoading || (loading && !changes.length);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <Spinner size="lg" className="text-[var(--color-accent)]" />
          <p className="text-[var(--color-text-muted)]">Loading changes...</p>
        </div>
      );
    }

    if (!sessionStatus.isLoggedIn) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-[var(--color-text-muted)]">
            No active session. Please go to the{" "}
            <span className="font-semibold text-[var(--color-text-primary)]">Servers</span>{" "}
            tab and login to a server to view changes.
          </p>
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={refresh} />;
    }

    if (changes.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-[var(--color-text-muted)]">No changes to display.</p>
        </div>
      );
    }

    return <ChangesTable changes={changes} />;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Historical Changes
        </h2>
        {sessionStatus.isLoggedIn && (
          <Button
            variant="secondary"
            size="sm"
            onClick={refresh}
            disabled={loading}
            loading={loading}
          >
            Refresh
          </Button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default ChangesSection;
