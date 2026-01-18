import React from "react";
import type { SessionStatus } from "../../../shared/types/server";

interface ConnectionStatusProps {
  status: SessionStatus;
  onLogout?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  onLogout,
}) => {
  if (!status.isLoggedIn) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)]" />
        <span className="text-sm text-[var(--color-text-muted)]">
          Not connected
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/30">
      <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {status.serverName}
        </p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {status.username}
        </p>
      </div>
      {onLogout && (
        <button
          onClick={onLogout}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );
};
