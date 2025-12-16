// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

console.log("Running Preload");

import { contextBridge } from "electron";
import { preloadBridge } from "@zubridge/electron/preload";
import { AppState } from "../Main/Features/Workspace";

const { handlers } = preloadBridge<AppState>();

// Expose the handlers to the renderer process
contextBridge.exposeInMainWorld("zubridge", handlers);
