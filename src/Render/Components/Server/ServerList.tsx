import React from "react";
import { ServerCard } from "./ServerCard";
import type {
  ServerConfig,
  ConnectionTestResult,
  SessionStatus,
} from "../../../shared/types/server";

interface ServerListProps {
  servers: ServerConfig[];
  sessionStatus: SessionStatus;
  onEdit: (server: ServerConfig) => void;
  onRemove: (id: string) => Promise<boolean>;
  onTestConnection: (p4port: string) => Promise<ConnectionTestResult>;
  onLogin: (server: ServerConfig) => void;
  onLogout: (serverId: string) => Promise<void>;
}

export const ServerList: React.FC<ServerListProps> = ({
  servers,
  sessionStatus,
  onEdit,
  onRemove,
  onTestConnection,
  onLogin,
  onLogout,
}) => {
  if (servers.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-muted)]">
        <p className="mb-2">No servers configured</p>
        <p className="text-sm">
          Click "Add Server" to add your first Perforce server
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {servers.map((server) => {
        const isActiveServer = sessionStatus.serverId === server.id;
        const isLoggedIn = isActiveServer && sessionStatus.isLoggedIn;

        return (
          <ServerCard
            key={server.id}
            server={server}
            isLoggedIn={isLoggedIn}
            isActiveServer={isActiveServer}
            onEdit={() => onEdit(server)}
            onRemove={() => onRemove(server.id)}
            onTestConnection={() => onTestConnection(server.p4port)}
            onLogin={() => onLogin(server)}
            onLogout={() => onLogout(server.id)}
          />
        );
      })}
    </div>
  );
};
