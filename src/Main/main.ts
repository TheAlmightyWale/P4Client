import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { createStore } from "./store";
import { createBridge } from "./bridge";
import {
  getSubmittedChanges,
  getPendingChanges,
  getCurrentUser,
  getPendingChangesDetailed,
} from "./Features/P4";
import { getWorkspaceRoot, listDirectories } from "./Features/Dir";
import {
  getAllServers,
  getServerById,
  addServer,
  updateServer,
  removeServer,
  testConnection,
  login,
  logout,
  getSessionStatus,
  validateSession,
  discoverServers,
} from "./Features/Server";

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
    show: false,
    backgroundColor: "#0f172a",
    webPreferences: {
      //TODO make True and fix
      sandbox: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  }) as ZubridgeWindow;

  // Show window once the first non-empty paint completes
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

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

/**
 * Runs server discovery and logs results
 * Wrapped in its own function to keep app.whenReady() clean
 */
async function runServerDiscovery(): Promise<void> {
  try {
    const discoveryResult = await discoverServers();
    console.log(`Finished server discovery`);

    if (discoveryResult.serversCreated.length > 0) {
      console.log(
        `Discovered ${discoveryResult.serversCreated.length} new server(s)`,
      );
    }
    if (discoveryResult.sessionsRecovered > 0) {
      console.log(`Recovered ${discoveryResult.sessionsRecovered} session(s)`);
    }
    if (discoveryResult.errors.length > 0) {
      console.warn("Discovery errors:", discoveryResult.errors);
    }
  } catch (error) {
    console.error("Server discovery failed:", error);
    // Continue startup even if discovery fails
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const store = createStore();
  const bridge = createBridge(store);

  // Register IPC handlers before window creation so they're ready when renderer calls them
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

  ipcMain.handle("p4:getPendingChangesDetailed", async () => {
    return getPendingChangesDetailed();
  });

  // Server management handlers
  ipcMain.handle("server:getAll", async () => {
    return getAllServers();
  });

  ipcMain.handle("server:getById", async (_event, id: string) => {
    return getServerById(id);
  });

  ipcMain.handle("server:add", async (_event, input) => {
    const result = addServer(input);
    store.setState({ servers: getAllServers() });
    return result;
  });

  ipcMain.handle("server:update", async (_event, input) => {
    const result = updateServer(input);
    store.setState({ servers: getAllServers() });
    return result;
  });

  ipcMain.handle("server:remove", async (_event, id: string) => {
    const result = removeServer(id);
    store.setState({ servers: getAllServers() });
    return result;
  });

  ipcMain.handle("server:testConnection", async (_event, p4port: string) => {
    return testConnection(p4port);
  });

  // Authentication handlers
  ipcMain.handle("server:login", async (_event, input) => {
    const result = await login(input);
    store.setState({
      servers: getAllServers(),
      sessionStatus: getSessionStatus(),
    });
    return result;
  });

  ipcMain.handle("server:logout", async (_event, serverId: string) => {
    const result = await logout(serverId);
    store.setState({
      servers: getAllServers(),
      sessionStatus: getSessionStatus(),
    });
    return result;
  });

  ipcMain.handle("server:getSessionStatus", async () => {
    return getSessionStatus();
  });

  ipcMain.handle("server:validateSession", async () => {
    return validateSession();
  });

  // Directory explorer handlers
  ipcMain.handle("dir:getWorkspaceRoot", async () => {
    return getWorkspaceRoot();
  });

  ipcMain.handle("dir:listDirectories", async (_event, options) => {
    return listDirectories(options);
  });

  // Create window immediately — user sees skeleton UI right away
  createAndSubscribeWindows(bridge);
  SetupEventHandlers(bridge);

  // Push existing data to store so renderer has it as soon as Zubridge syncs
  store.setState({
    servers: getAllServers(),
    sessionStatus: getSessionStatus(),
  });

  // Discovery runs in background AFTER window is visible — may find new servers
  await runServerDiscovery();

  // Push updated data after discovery (may include newly discovered servers/sessions)
  store.setState({
    servers: getAllServers(),
    sessionStatus: getSessionStatus(),
  });
});
