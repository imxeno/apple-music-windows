import React, { ReactEventHandler, useEffect, useRef } from "react";

import TopBar from "./components/TopBar";

import styles from "./App.module.css";

export default function App() {
  const onLoad: ReactEventHandler<HTMLIFrameElement> = (e) => {
    const frame = e.currentTarget;
    setTimeout(() => {
      frame.contentDocument.head.innerHTML += `<style>${window.customAppleMusicCss}</style>`;
    }, 1000);
  };
  return (
    <div className={styles.container}>
      <TopBar />
      <iframe
        src="https://music.apple.com"
        className={styles.webview}
        onLoad={onLoad}
        allow="encrypted-media *;"
      />
    </div>
  );
}
