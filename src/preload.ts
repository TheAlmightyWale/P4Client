// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import { preloadBridge } from "@zubridge/electron/preload";

const { handlers } = preloadBridge();

// Expose the handlers to the renderer process
contextBridge.exposeInMainWorld("zubridge", handlers);
