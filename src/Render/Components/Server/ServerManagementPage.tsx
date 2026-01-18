import React, { useState } from "react";
import { useServers } from "../../Hooks/useServers";
import { ServerList } from "./ServerList";
import { ServerFormModal } from "./ServerFormModal";
import { LoginModal } from "./LoginModal";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import { ConnectionStatus } from "./ConnectionStatus";
import { Button } from "../button";
import { Spinner } from "../common/Spinner";
import { ErrorMessage } from "../common/ErrorMessage";
import type { ServerConfig } from "../../../shared/types/server";

export const ServerManagementPage: React.FC = () => {
  const {
    servers,
    loading,
    error,
    sessionStatus,
    refresh,
    addServer,
    updateServer,
    removeServer,
    testConnection,
    login,
    logout,
  } = useServers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerConfig | null>(null);
  const [loginServer, setLoginServer] = useState<ServerConfig | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState<{
    currentServer: ServerConfig;
    newServer: ServerConfig;
  } | null>(null);

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

  const handleLoginClick = (server: ServerConfig) => {
    // Check if another server is logged in
    if (sessionStatus.isLoggedIn && sessionStatus.serverId !== server.id) {
      const currentServer = servers.find(
        (s) => s.id === sessionStatus.serverId
      );
      if (currentServer) {
        setLogoutConfirm({ currentServer, newServer: server });
        return;
      }
    }
    setLoginServer(server);
  };

  const handleLogin = async (username: string, password: string) => {
    if (!loginServer) return;

    const result = await login(loginServer.id, username, password);

    if (result.success) {
      setLoginServer(null);
    } else if (result.error) {
      throw new Error(result.error);
    }
  };

  const handleLogout = async (serverId: string) => {
    await logout(serverId);
  };

  const handleLogoutConfirm = async () => {
    if (!logoutConfirm) return;

    // Logout from current server
    await logout(logoutConfirm.currentServer.id);

    // Open login modal for new server
    setLoginServer(logoutConfirm.newServer);
    setLogoutConfirm(null);
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
        <div className="flex items-center gap-4">
          <ConnectionStatus
            status={sessionStatus}
            onLogout={
              sessionStatus.isLoggedIn && sessionStatus.serverId
                ? () => handleLogout(sessionStatus.serverId!)
                : undefined
            }
          />
          <Button variant="primary" size="sm" onClick={handleAddClick}>
            Add Server
          </Button>
        </div>
      </div>

      <ServerList
        servers={servers}
        sessionStatus={sessionStatus}
        onEdit={handleEditClick}
        onRemove={removeServer}
        onTestConnection={testConnection}
        onLogin={handleLoginClick}
        onLogout={handleLogout}
      />

      {isModalOpen && (
        <ServerFormModal
          server={editingServer}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}

      {loginServer && (
        <LoginModal
          server={loginServer}
          onLogin={handleLogin}
          onClose={() => setLoginServer(null)}
        />
      )}

      {logoutConfirm && (
        <LogoutConfirmDialog
          currentServerName={logoutConfirm.currentServer.name}
          newServerName={logoutConfirm.newServer.name}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setLogoutConfirm(null)}
        />
      )}
    </div>
  );
};
