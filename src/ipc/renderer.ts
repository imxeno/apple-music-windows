import { contextBridge, ipcRenderer } from "electron";
import {
  CLOSE,
  IS_FOCUSED,
  IS_MAXIMIZED,
  MAXIMIZE,
  MINIMIZE,
  UNMAXIMIZE
} from "./channels";

export interface ExposedAPI {
  on: typeof ipcRenderer.on;
  off: typeof ipcRenderer.off;
  close: () => void;
  isFocused: () => Promise<boolean>;
  isMaximized: () => Promise<boolean>;
  maximize: () => void;
  unmaximize: () => void;
  minimize: () => void;
}

const api: ExposedAPI = {
  on: ipcRenderer.on.bind(ipcRenderer),
  off: ipcRenderer.off.bind(ipcRenderer),
  close: () => ipcRenderer.invoke(CLOSE),
  isFocused: () => ipcRenderer.invoke(IS_FOCUSED),
  isMaximized: () => ipcRenderer.invoke(IS_MAXIMIZED),
  maximize: () => ipcRenderer.invoke(MAXIMIZE),
  unmaximize: () => ipcRenderer.invoke(UNMAXIMIZE),
  minimize: () => ipcRenderer.invoke(MINIMIZE)
};

contextBridge.exposeInMainWorld("electron", api);
