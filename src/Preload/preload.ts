import { preloadBridge } from "@zubridge/electron/preload";
import { contextBridge, ipcRenderer } from "electron";
import type { AppState } from "../Main/Features";
import type {
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4API,
} from "../shared/types/p4";

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
};
contextBridge.exposeInMainWorld("p4API", p4API);

console.log("[Preload] Script initialized successfully");
