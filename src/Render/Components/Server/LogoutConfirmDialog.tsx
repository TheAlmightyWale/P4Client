import React from "react";
import { Button } from "../button";

interface LogoutConfirmDialogProps {
  currentServerName: string;
  newServerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
  currentServerName,
  newServerName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 w-full max-w-md border border-[var(--color-border)]">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          Switch Server?
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-4">
          You are currently logged into <strong>{currentServerName}</strong>.
          To login to <strong>{newServerName}</strong>, you must first logout
          from the current server.
        </p>
        <p className="text-sm text-[var(--color-warning)] mb-6">
          Only one server can be logged in at a time.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Logout & Switch
          </Button>
        </div>
      </div>
    </div>
  );
};
