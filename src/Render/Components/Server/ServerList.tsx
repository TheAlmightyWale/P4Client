import React from "react";
import { ServerCard } from "./ServerCard";
import type {
  ServerConfig,
  ConnectionTestResult,
} from "../../../shared/types/server";

interface ServerListProps {
  servers: ServerConfig[];
  onEdit: (server: ServerConfig) => void;
  onRemove: (id: string) => Promise<boolean>;
  onTestConnection: (p4port: string) => Promise<ConnectionTestResult>;
}

export const ServerList: React.FC<ServerListProps> = ({
  servers,
  onEdit,
  onRemove,
  onTestConnection,
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
      {servers.map((server) => (
        <ServerCard
          key={server.id}
          server={server}
          onEdit={() => onEdit(server)}
          onRemove={() => onRemove(server.id)}
          onTestConnection={() => onTestConnection(server.p4port)}
        />
      ))}
    </div>
  );
};
