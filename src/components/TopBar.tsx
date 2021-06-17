import React from "react";
import WindowsFrameButton from "./frame/WindowsFrameButton";

import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <div className={styles.container}>
      <WindowsFrameButton type="minimize" />
      <WindowsFrameButton type="maximize" />
      <WindowsFrameButton type="close" />
    </div>
  );
}
