import { MutableRefObject, useEffect } from "react";
import { patchModule } from "../patches";

export function usePatchLoader(ref: MutableRefObject<HTMLIFrameElement>) {
  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    const contentWindow: any = frame.contentWindow;
    if (contentWindow.define) return;
    Object.defineProperty(contentWindow, "define", {
      set: function (define) {
        contentWindow.origDefine = define;
        contentWindow.hookedDefine = function (
          id: string,
          deps: string[],
          module: () => void
        ) {
          module = patchModule(contentWindow, id, module);
          contentWindow.origDefine(id, deps, module);
        };
      },
      get: function () {
        return contentWindow.hookedDefine;
      },
    });
  }, [ref.current]);
}
