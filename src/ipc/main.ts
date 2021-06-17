import { BrowserWindow, ipcMain } from "electron";
import {
  CLOSE,
  IS_FOCUSED,
  IS_MAXIMIZED,
  MAXIMIZE,
  MINIMIZE,
  UNMAXIMIZE
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
  window.on("focus", () => window.webContents.send("focus"));
  window.on("blur", () => window.webContents.send("blur"));
  window.on("maximize", () => window.webContents.send("maximize"));
  window.on("unmaximize", () => window.webContents.send("unmaximize"));
}
