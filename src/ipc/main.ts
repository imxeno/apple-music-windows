import { BrowserWindow, ipcMain } from "electron";
import { readFile } from "fs/promises";
import { resolve as resolvePath } from "path";
import {
  CLOSE,
  IS_FOCUSED,
  IS_MAXIMIZED,
  LOAD_CSS,
  MAXIMIZE,
  MINIMIZE,
  UNMAXIMIZE,
} from "./channels";

export function registerIpc(window: BrowserWindow): void {
  ipcMain.handle(CLOSE, () => {
    window.destroy();
  });
  ipcMain.handle(IS_FOCUSED, () => {
    return window.isFocused();
  });
  ipcMain.handle(IS_MAXIMIZED, () => {
    return window.isMaximized();
  });
  ipcMain.handle(MAXIMIZE, () => {
    window.maximize();
  });
  ipcMain.handle(MINIMIZE, () => {
    window.minimize();
  });
  ipcMain.handle(UNMAXIMIZE, () => {
    window.unmaximize();
  });
  ipcMain.handle(LOAD_CSS, async () => {
    return await readFile(resolvePath(__dirname + "/inject.css"), "utf-8");
  });
  window.on("focus", () => window.webContents.send("focus"));
  window.on("blur", () => window.webContents.send("blur"));
  window.on("maximize", () => window.webContents.send("maximize"));
  window.on("unmaximize", () => window.webContents.send("unmaximize"));
}
