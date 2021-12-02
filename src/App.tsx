import React, { ReactEventHandler, useEffect, useState } from "react";

import TopBar from "./components/TopBar";

import styles from "./App.module.css";
import Spinner from "./components/Spinner";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (loaded && !shown) {
      // Workaround for half-drawn UI
      const timeout = setTimeout(() => {
        setShown(true);
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
    if (!loaded && shown) {
      setShown(false);
    }
  }, [loaded, shown]);

  const onLoad: ReactEventHandler<HTMLIFrameElement> = async (e) => {
    const frame = e.currentTarget;
    frame.contentDocument.head.innerHTML += `<style>${await window.electron.loadCSS()}</style>`;
    setLoaded(true);
  };
  const onLoadStart: ReactEventHandler<HTMLIFrameElement> = (e) => {
    setLoaded(false);
  };
  return (
    <div className={styles.container}>
      <TopBar />
      <iframe
        style={{ display: shown ? "block" : "none" }}
        src="https://music.apple.com/library/recently-added"
        className={styles.webview}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        allow="encrypted-media *;"
      />
      {!shown && <Spinner />}
    </div>
  );
}
