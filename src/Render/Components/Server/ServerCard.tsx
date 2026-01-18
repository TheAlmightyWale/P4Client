import React, { useState } from "react";
import { Button } from "../button";
import { ConnectionTestResult } from "./ConnectionTestResult";
import type {
  ServerConfig,
  ConnectionTestResult as TestResult,
} from "../../../shared/types/server";

interface ServerCardProps {
  server: ServerConfig;
  isLoggedIn: boolean;
  isActiveServer: boolean;
  onEdit: () => void;
  onRemove: () => Promise<boolean>;
  onTestConnection: () => Promise<TestResult>;
  onLogin: () => void;
  onLogout: () => Promise<void>;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  isLoggedIn,
  isActiveServer,
  onEdit,
  onRemove,
  onTestConnection,
  onLogin,
  onLogout,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [removing, setRemoving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await onTestConnection();
      setTestResult(result);
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove "${server.name}"?`)) {
      setRemoving(true);
      await onRemove();
      setRemoving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="relative p-4 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border)]">
      {/* Connected indicator */}
      {isActiveServer && (
        <div className="absolute top-2 right-2">
          <span className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            Connected
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">
            {server.name}
          </h3>
          <p className="text-sm font-mono text-[var(--color-accent)]">
            {server.p4port}
          </p>
          {server.description && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {server.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            loading={removing}
            disabled={removing || isActiveServer}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTest}
            loading={testing}
            disabled={testing}
          >
            Test Connection
          </Button>
        </div>

        <div>
          {isLoggedIn ? (
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              loading={loggingOut}
              disabled={loggingOut}
            >
              Logout
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={onLogin}>
              Login
            </Button>
          )}
        </div>
      </div>

      {testResult && (
        <ConnectionTestResult result={testResult} className="mt-3" />
      )}
    </div>
  );
};
