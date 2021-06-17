import { app, nativeTheme } from "electron";
import { BrowserWindow } from "electron-acrylic-window";
import { registerIpc } from "./ipc/main";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

app.commandLine.appendSwitch("disable-site-isolation-trials");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

console.log(process.versions["chrome"]);

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 650,
    width: 1100,
    minWidth: 1000,
    frame: false,
    transparent: true,
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
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36 Edg/91.0.864.48";
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    { urls: ["*://*/*"] },
    (d, c) => {
      function deleteHeader(header: string) {
        if (d.responseHeaders[header]) delete d.responseHeaders[header];
        if (d.responseHeaders[header.toLowerCase()])
          delete d.responseHeaders[header.toLowerCase()];
      }
      deleteHeader("Access-Control-Allow-Origin");
      d.responseHeaders["access-control-allow-origin"] = ["*"];
      deleteHeader("Content-Security-Policy");
      deleteHeader("X-Frame-Options");

      c({ cancel: false, responseHeaders: d.responseHeaders });
    }
  );

  // Open the DevTools.
  if (!app.isPackaged) mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((app as any).verifyWidevineCdm) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.on("widevine-ready" as any, createWindow);
} else {
  app.on("ready", createWindow);
}

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
