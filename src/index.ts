import { app, nativeTheme, components } from "electron";
import contextMenu from "electron-context-menu";
import { BrowserWindow } from "electron-acrylic-window";
import { registerIpc } from "./ipc/main";

import { HeaderManipulator } from "./utils";

// temporary workaround: https://github.com/castlabs/electron-releases/issues/116
const cus = components;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

app.commandLine.appendSwitch("disable-site-isolation-trials");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

contextMenu();

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 650,
    width: 1100,
    minWidth: 1050,
    frame: false,
    vibrancy: nativeTheme.shouldUseDarkColors ? "dark" : "light",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
    },
  });

  registerIpc(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 Edg/96.0.1054.34";
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    { urls: ["*://*/*"] },
    (details, callback) => {
      const headers = new HeaderManipulator(details.responseHeaders);

      headers.set("Access-Control-Allow-Origin", ["*"]);
      headers.delete("Content-Security-Policy");
      headers.delete("X-Frame-Options");
      headers.modify(
        "Set-Cookie",
        (value: string) => value + "; SameSite=None"
      );

      callback({ cancel: false, responseHeaders: headers.record() });
    }
  );

  // Open the DevTools.
  if (!app.isPackaged) mainWindow.webContents.openDevTools({ mode: "detach" });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Await widevine initialization
  await cus.whenReady();
  createWindow();

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
      createWindow();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
