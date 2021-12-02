export function infiniteScroll(orig: string) {
  return orig.replace(
    "fetchMore(){",
    "fetchMore(){console.log('Fetching more!');"
  );
}
