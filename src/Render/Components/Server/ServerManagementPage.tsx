import React, { useState } from "react";
import { useServers } from "../../Hooks/useServers";
import { ServerList } from "./ServerList";
import { ServerFormModal } from "./ServerFormModal";
import { Button } from "../button";
import { Spinner } from "../common/Spinner";
import { ErrorMessage } from "../common/ErrorMessage";
import type { ServerConfig } from "../../../shared/types/server";

export const ServerManagementPage: React.FC = () => {
  const {
    servers,
    loading,
    error,
    refresh,
    addServer,
    updateServer,
    removeServer,
    testConnection,
  } = useServers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerConfig | null>(null);

  const handleAddClick = () => {
    setEditingServer(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (server: ServerConfig) => {
    setEditingServer(server);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingServer(null);
  };

  const handleSave = async (data: {
    name: string;
    p4port: string;
    description?: string;
  }) => {
    if (editingServer) {
      await updateServer({ id: editingServer.id, ...data });
    } else {
      await addServer(data);
    }
    handleModalClose();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <Spinner size="lg" className="text-[var(--color-accent)]" />
        <p className="text-[var(--color-text-muted)]">Loading servers...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Server Management
        </h2>
        <Button variant="primary" size="sm" onClick={handleAddClick}>
          Add Server
        </Button>
      </div>

      <ServerList
        servers={servers}
        onEdit={handleEditClick}
        onRemove={removeServer}
        onTestConnection={testConnection}
      />

      {isModalOpen && (
        <ServerFormModal
          server={editingServer}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
