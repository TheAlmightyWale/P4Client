import { preloadBridge } from "@zubridge/electron/preload";
import { contextBridge, ipcRenderer } from "electron";
import type { AppState } from "../Main/Features";

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
contextBridge.exposeInMainWorld("p4API", {
  getSubmittedChanges: (options?: {
    maxCount?: number;
    depotPath?: string;
  }) => {
    return ipcRenderer.invoke("p4:getSubmittedChanges", options);
  },
  getPendingChanges: (options?: { user?: string }) => {
    return ipcRenderer.invoke("p4:getPendingChanges", options);
  },
  getCurrentUser: () => {
    return ipcRenderer.invoke("p4:getCurrentUser");
  },
});

console.log("[Preload] Script initialized successfully");
