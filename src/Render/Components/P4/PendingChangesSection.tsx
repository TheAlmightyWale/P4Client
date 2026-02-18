import type React from "react";
import { usePendingChanges } from "../../Hooks/usePendingChanges";
import { useServers } from "../../Hooks/useServers";
import { Button } from "../button";
import { Spinner } from "../common/Spinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { ChangelistCard } from "./ChangelistCard";

export const PendingChangesSection: React.FC = () => {
  const { sessionStatus, loading: sessionLoading } = useServers();
  const { changelists, loading, error, refresh } = usePendingChanges();

  const isLoading = sessionLoading || (loading && !changelists.length);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <Spinner size="lg" className="text-[var(--color-accent)]" />
          <p className="text-[var(--color-text-muted)]">
            Loading pending changes...
          </p>
        </div>
      );
    }

    if (!sessionStatus.isLoggedIn) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-[var(--color-text-muted)]">
            No active session. Please go to the{" "}
            <span className="font-semibold text-[var(--color-text-primary)]">
              Servers
            </span>{" "}
            tab and login to a server to view pending changes.
          </p>
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={refresh} />;
    }

    if (changelists.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-[var(--color-text-muted)]">
            No pending changelists.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {changelists.map((cl) => (
          <ChangelistCard key={cl.id} changelist={cl} />
        ))}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Pending Changes
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

export default PendingChangesSection;
