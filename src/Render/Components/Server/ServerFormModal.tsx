import React, { useState } from "react";
import { Button } from "../button";
import type { ServerConfig } from "../../../shared/types/server";

interface ServerFormModalProps {
  server: ServerConfig | null;
  onSave: (data: {
    name: string;
    p4port: string;
    description?: string;
  }) => Promise<void>;
  onClose: () => void;
}

export const ServerFormModal: React.FC<ServerFormModalProps> = ({
  server,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(server?.name || "");
  const [p4port, setP4port] = useState(server?.p4port || "");
  const [description, setDescription] = useState(server?.description || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Server name is required");
      return;
    }

    if (!p4port.trim()) {
      setError("P4PORT is required");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        p4port: p4port.trim(),
        description: description.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 w-full max-w-md border border-[var(--color-border)]">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          {server ? "Edit Server" : "Add Server"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Server Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Production Server"
                className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                P4PORT *
              </label>
              <input
                type="text"
                value={p4port}
                onChange={(e) => setP4port(e.target.value)}
                placeholder="e.g., ssl:perforce.example.com:1666"
                className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {server ? "Save Changes" : "Add Server"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
