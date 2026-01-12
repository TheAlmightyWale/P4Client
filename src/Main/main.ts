import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { createStore } from "./store";
import { createBridge } from "./bridge";
import {
  getSubmittedChanges,
  getPendingChanges,
  getCurrentUser,
} from "./Features/P4";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

type ZubridgeWindow = BrowserWindow & {
  windowId?: number;
  windowType?: string;
};

const createMainWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //TODO make True and fix
      sandbox: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  }) as ZubridgeWindow;

  // and load the index.html of the app.
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    const url = "http://localhost:5173";
    console.log("loading Dev at: ", url);
    mainWindow.loadURL(url);
    mainWindow.webContents.openDevTools();
  } else {
    console.log("loading index.html at: ", __dirname);
    mainWindow.loadFile(path.join(__dirname, `../../render/index.html`));
  }

  return [mainWindow];
};

const createAndSubscribeWindows = (bridge: ReturnType<typeof createBridge>) => {
  const [mainWindow] = createMainWindow();
  bridge.subscribe([mainWindow]);
  return [mainWindow];
};

const SetupEventHandlers = (bridge: ReturnType<typeof createBridge>) => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createAndSubscribeWindows(bridge);
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const store = createStore();
  const bridge = createBridge(store);

  // Handle window info requests
  ipcMain.handle("get-window-info", (event) => {
    const sender = event.sender;
    const window = BrowserWindow.fromWebContents(sender) as ZubridgeWindow;

    return {
      type: window?.windowType || "main",
      id: window?.windowId || 1,
    };
  });

  // P4 API handlers
  ipcMain.handle("p4:getSubmittedChanges", async (_event, options) => {
    return getSubmittedChanges(options);
  });

  ipcMain.handle("p4:getPendingChanges", async (_event, options) => {
    return getPendingChanges(options);
  });

  ipcMain.handle("p4:getCurrentUser", async () => {
    return getCurrentUser();
  });

  // Create all windows
  createAndSubscribeWindows(bridge);

  SetupEventHandlers(bridge);
});
