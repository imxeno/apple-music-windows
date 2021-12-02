import React, { ReactEventHandler, useEffect, useRef, useState } from "react";

import TopBar from "./components/TopBar";

import styles from "./App.module.css";
import Spinner from "./components/Spinner";
import { usePatchLoader } from "./hooks";

export default function App() {
  const ref = useRef<HTMLIFrameElement>();
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

  usePatchLoader(ref);

  return (
    <div className={styles.container}>
      <TopBar />
      <iframe
        ref={ref}
        style={{ display: shown ? "block" : "none" }}
        src="https://music.apple.com/library/recently-added"
        className={styles.webview}
        onLoad={onLoad}
        allow="encrypted-media *;"
      />
      {!shown && (
        <>
          <div className={styles.frameButtonBackgroundContainer}>
            <div className={styles.frameButtonBackground} />
          </div>
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        </>
      )}
    </div>
  );
}
