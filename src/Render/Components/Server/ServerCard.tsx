import React, { useState } from "react";
import { Button } from "../button";
import { ConnectionTestResult } from "./ConnectionTestResult";
import type {
  ServerConfig,
  ConnectionTestResult as TestResult,
} from "../../../shared/types/server";

interface ServerCardProps {
  server: ServerConfig;
  onEdit: () => void;
  onRemove: () => Promise<boolean>;
  onTestConnection: () => Promise<TestResult>;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  onEdit,
  onRemove,
  onTestConnection,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [removing, setRemoving] = useState(false);

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

  return (
    <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border)]">
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
            disabled={removing}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleTest}
          loading={testing}
          disabled={testing}
        >
          Test Connection
        </Button>

        {testResult && (
          <ConnectionTestResult result={testResult} className="mt-3" />
        )}
      </div>
    </div>
  );
};
