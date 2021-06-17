import { contextBridge } from "electron";
import "./ipc/renderer";

contextBridge.exposeInMainWorld(
  "customAppleMusicCss",
  `

/* iframe background fix */
:root {
    color-scheme: light !important;
}

/* Make body transparent */
body {
    background-color: transparent !important;
}

/* app scrollbars */

::-webkit-scrollbar {
    width: 14px;
    height: 18px;
  }
  
::-webkit-scrollbar-thumb {
    height: 6px;
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    background-color: rgba(0, 0, 0, 0, 0.5);
    -webkit-border-radius: 7px;
    -webkit-box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.20),
        inset 1px 1px 0px rgba(0, 0, 0, 0.20);
}

::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
}

::-webkit-scrollbar-corner {
    background-color: transparent;
}

/* content view scrollbar fix */

@media only screen and (min-width: 484px) {
    body.has-js:not(.no-song-loaded) .web-navigation__navigation-details-view,
    body.has-js:not(.not-authenticated) .web-navigation__navigation-details-view {
        padding-top: 0px;
        margin-top: 55px;
    }
}

/* Add drag zone */

.web-navigation__header, .web-chrome__auth-no-chrome {
    -webkit-app-region: drag;
}

/* Make space for frame buttons */

@media only screen and (min-width: 484px)
{
    .web-chrome {
        padding-right: 130px;
    }
}

/* Fix for signing in */
.web-navigation__auth {
    -webkit-app-region: no-drag;
}

/* Sign in button placement fix */
@media only screen and (min-width: 484px) {
    body.no-song-loaded .web-chrome__auth-no-chrome {
        padding-inline-start: 20px;
        justify-items: start;
    }
}

/* Make page white on light theme */
@media (prefers-color-scheme: light) {
    .page-container {
        background-color: #fff;
    }
}

@media (prefers-color-scheme: dark) {
    
    /* Make page dark on light theme */
    .page-container {
        background-color: #2c2c2c;
    }

    /* Make left nav transparent on dark theme */
    .web-navigation__navigation-container {
        background-color: transparent !important;
    }
    
}

/* Disable oversized box-shadow in media controls */
.web-chrome *:focus, .web-chrome *:active {
    box-shadow: none !important;
}

/* Hide 'Open in iTunes' button */
.web-navigation__native-upsell {
    display: none;
}

/* Hide footer */

.dt-footer {
    display: none;
}

`
);
