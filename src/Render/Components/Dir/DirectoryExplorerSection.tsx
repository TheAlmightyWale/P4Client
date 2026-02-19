import type React from "react";
import { useEffect } from "react";
import { useServers } from "../../Hooks/useServers";
import { useDirExplorer } from "../../Hooks/useDirExplorer";
import { DirectoryTree } from "./DirectoryTree";
import { Spinner } from "../common/Spinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { Button } from "../button";

export const DirectoryExplorerSection: React.FC = () => {
  const { sessionStatus, loading: sessionLoading } = useServers();
  const {
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
  } = useDirExplorer();

  const isLoading = sessionLoading || rootLoading;

  useEffect(() => {
    if (sessionStatus.isLoggedIn && !workspaceRoot && !rootLoading) {
      initialize();
    }
  }, [sessionStatus.isLoggedIn, workspaceRoot, rootLoading, initialize]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" className="text-[var(--color-accent)]" />
          <p className="mt-3 text-[var(--color-text-muted)]">Loading workspace...</p>
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
            tab and login to browse the workspace.
          </p>
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={refresh} />;
    }

    if (rootEntries.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-[var(--color-text-muted)]">
            No directories found in workspace root.
          </p>
        </div>
      );
    }

    return (
      <>
        <p className="text-[var(--color-text-muted)] text-xs font-mono mb-3">
          {workspaceRoot}
        </p>
        <DirectoryTree
          entries={rootEntries}
          expanded={expanded}
          loading={loading}
          childrenMap={childrenMap}
          onToggle={toggleExpand}
        />
      </>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Workspace Explorer
        </h2>
        {sessionStatus.isLoggedIn && (
          <Button
            variant="secondary"
            size="sm"
            onClick={refresh}
            disabled={rootLoading}
            loading={rootLoading}
          >
            Refresh
          </Button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};
