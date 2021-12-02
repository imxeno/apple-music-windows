import { infiniteScroll } from "./infiniteScroll";

const patchMap: Record<string, (module: any) => any> = {
  "desktop-music-app/components/infinite-scroll": infiniteScroll,
};

export function patchModule(contentWindow: Window, id: string, module: any) {
  if (patchMap[id]) {
    console.log(`loading patch for ${id}`);
    module = (contentWindow as any).eval(
      "() => " + patchMap[id](module.toString())
    )();
  }
  return module;
}
