import React from "react";
import { clsx } from "clsx";
import type { ConnectionTestResult as TestResult } from "../../../shared/types/server";

interface ConnectionTestResultProps {
  result: TestResult;
  className?: string;
}

export const ConnectionTestResult: React.FC<ConnectionTestResultProps> = ({
  result,
  className,
}) => {
  if (result.success && result.serverInfo) {
    return (
      <div
        className={clsx(
          "p-3 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/30",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[var(--color-success)]">✓</span>
          <span className="font-medium text-[var(--color-success)]">
            Connection Successful
          </span>
          {result.responseTime && (
            <span className="text-sm text-[var(--color-text-muted)]">
              ({result.responseTime}ms)
            </span>
          )}
        </div>
        <div className="text-sm space-y-1 text-[var(--color-text-secondary)]">
          <p>
            <strong>Server Version:</strong> {result.serverInfo.serverVersion}
          </p>
          <p>
            <strong>Server Address:</strong> {result.serverInfo.serverAddress}
          </p>
          {result.serverInfo.serverUptime && (
            <p>
              <strong>Uptime:</strong> {result.serverInfo.serverUptime}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/30",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[var(--color-error)]">✗</span>
        <span className="font-medium text-[var(--color-error)]">
          Connection Failed
        </span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {result.error || "Unable to connect to server"}
      </p>
    </div>
  );
};
