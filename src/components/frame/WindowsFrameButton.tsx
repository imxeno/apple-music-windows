import React, { useEffect, useState } from "react";

import WindowsMinimizeIcon from "./WindowsMinimizeIcon";
import WindowsCloseIcon from "./WindowsCloseIcon";
import WindowsMaximizeIcon from "./WindowsMaximizeIcon";
import WindowsRestoreIcon from "./WindowsRestoreIcon";

import "./WindowsFrameButton.css";

interface Props {
  type: "close" | "maximize" | "minimize";
}

export default function WindowsFrameButton({ type }: Props): JSX.Element {
  const [maximized, setMaximized] = useState(false);

  const renderIcon = () => {
    switch (type) {
      case "minimize":
        return <WindowsMinimizeIcon />;
      case "maximize":
        return maximized ? <WindowsRestoreIcon /> : <WindowsMaximizeIcon />;
      default:
        return <WindowsCloseIcon />;
    }
  };

  useEffect(() => {
    const onMaximize = () => setMaximized(true);
    const onUnMaximize = () => setMaximized(false);
    window.electron.on("maximize", onMaximize);
    window.electron.on("unmaximize", onUnMaximize);
    return () => {
      window.electron.off("maximize", onMaximize);
      window.electron.off("unmaximize", onUnMaximize);
    };
  });

  const onClick = async () => {
    const isMaximized = await window.electron.isMaximized();
    switch (type) {
      case "maximize":
        return isMaximized
          ? window.electron.unmaximize()
          : window.electron.maximize();
      case "minimize":
        return window.electron.minimize();
      default:
        return window.electron.close();
    }
  };

  return (
    <div className={"WindowsFrameButton " + type} onClick={onClick}>
      {renderIcon()}
    </div>
  );
}
