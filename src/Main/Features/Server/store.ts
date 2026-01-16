import Store from "electron-store";
import type { ServerConfig } from "../../../shared/types/server";

interface ServerStoreSchema {
  servers: ServerConfig[];
}

const serverStore = new Store<ServerStoreSchema>({
  name: "servers",
  defaults: {
    servers: [],
  },
  schema: {
    servers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          p4port: { type: "string" },
          description: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: ["id", "name", "p4port", "createdAt", "updatedAt"],
      },
    },
  },
});

export function getAllServers(): ServerConfig[] {
  return serverStore.get("servers");
}

export function getServerById(id: string): ServerConfig | null {
  const servers = serverStore.get("servers");
  return servers.find((s) => s.id === id) || null;
}

export function saveServer(server: ServerConfig): void {
  const servers = serverStore.get("servers");
  const existingIndex = servers.findIndex((s) => s.id === server.id);

  if (existingIndex >= 0) {
    servers[existingIndex] = server;
  } else {
    servers.push(server);
  }

  serverStore.set("servers", servers);
}

export function deleteServer(id: string): boolean {
  const servers = serverStore.get("servers");
  const filteredServers = servers.filter((s) => s.id !== id);

  if (filteredServers.length === servers.length) {
    return false; // Server not found
  }

  serverStore.set("servers", filteredServers);
  return true;
}
