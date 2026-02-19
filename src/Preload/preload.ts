import { preloadBridge } from "@zubridge/electron/preload";
import { contextBridge, ipcRenderer } from "electron";
import type { AppState } from "../Main/Features";
import type {
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4API,
} from "../shared/types/p4";
import type {
  ServerAPI,
  CreateServerInput,
  UpdateServerInput,
  LoginInput,
} from "../shared/types/server";
import type { DirAPI } from "../shared/types/dir";

console.log("[Preload] Script initializing");

// Get handlers from the preload bridge
const { handlers } = preloadBridge<AppState>();

// Expose Zubridge handlers directly without wrapping
contextBridge.exposeInMainWorld("zubridge", handlers);

// Expose simple Electron API
contextBridge.exposeInMainWorld("electronAPI", {
  getWindowInfo: () => {
    console.log("[Preload] Invoking get-window-info");
    return ipcRenderer.invoke("get-window-info");
  },
});

// Expose P4 API
const p4API: P4API = {
  getSubmittedChanges: (options?: GetSubmittedChangesOptions) => {
    return ipcRenderer.invoke("p4:getSubmittedChanges", options);
  },
  getPendingChanges: (options?: GetPendingChangesOptions) => {
    return ipcRenderer.invoke("p4:getPendingChanges", options);
  },
  getCurrentUser: () => {
    return ipcRenderer.invoke("p4:getCurrentUser");
  },
  getPendingChangesDetailed: () => {
    return ipcRenderer.invoke("p4:getPendingChangesDetailed");
  },
};
contextBridge.exposeInMainWorld("p4API", p4API);

// Expose Server API
const serverAPI: ServerAPI = {
  // Server management methods
  getServers: () => ipcRenderer.invoke("server:getAll"),
  getServer: (id: string) => ipcRenderer.invoke("server:getById", id),
  addServer: (input: CreateServerInput) =>
    ipcRenderer.invoke("server:add", input),
  updateServer: (input: UpdateServerInput) =>
    ipcRenderer.invoke("server:update", input),
  removeServer: (id: string) => ipcRenderer.invoke("server:remove", id),
  testConnection: (p4port: string) =>
    ipcRenderer.invoke("server:testConnection", p4port),

  // Authentication methods
  login: (input: LoginInput) => ipcRenderer.invoke("server:login", input),
  logout: (serverId: string) => ipcRenderer.invoke("server:logout", serverId),
  getSessionStatus: () => ipcRenderer.invoke("server:getSessionStatus"),
  validateSession: () => ipcRenderer.invoke("server:validateSession"),
};
contextBridge.exposeInMainWorld("serverAPI", serverAPI);

// Expose Directory API
const dirAPI: DirAPI = {
  getWorkspaceRoot: () => ipcRenderer.invoke("dir:getWorkspaceRoot"),
  listDirectories: (options) => ipcRenderer.invoke("dir:listDirectories", options),
};
contextBridge.exposeInMainWorld("dirAPI", dirAPI);

console.log("[Preload] Script initialized successfully");
