import type { ExposedAPI } from "./ipc/renderer";

declare global {
  interface Window {
    electron: ExposedAPI;
    customAppleMusicCss: string;
  }
}
