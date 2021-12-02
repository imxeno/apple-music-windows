export function infiniteScrollComponent(orig: string) {
  return orig
    .replace(
      "setupObserver(e){",
      `
  setupObserver(e){
    if(!window.amwInfiniteScrollSpeedUp) window.amwInfiniteScrollSpeedUp = {};
    window.amwInfiniteScrollSpeedUp[e] = setInterval(() => { 
      if(!this.args.hasMore) {
        clearInterval(window.amwInfiniteScrollSpeedUp[e]);
        return;
      }
      this.didEnterViewport(); 
    }, 100);
    return;
  `
    )
    .replace(
      "teardownObserver(e){",
      `
  teardownObserver(e) {
    if(window.amwInfiniteScrollSpeedUp[e]) {
      clearInterval(window.amwInfiniteScrollSpeedUp[e]);
      delete window.amwInfiniteScrollSpeedUp[e];
     }
     return;
  `
    );
}
