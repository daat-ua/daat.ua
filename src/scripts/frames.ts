// Shared helpers for the canvas frame sequences (public/frames/<name>/<width>/f001.webp …).

const SET_WIDTHS = [800, 1440, 2042];

/** URL builder for the smallest frame set that covers `cssWidth` at the device's pixel density (capped at 2×) */
export function frameSet(name: string, cssWidth: number) {
  const needed = cssWidth * Math.min(devicePixelRatio || 1, 2);
  const width = SET_WIDTHS.find((w) => w >= needed) ?? SET_WIDTHS.at(-1)!;
  return (i: number) => `/frames/${name}/${width}/f${String(i + 1).padStart(3, "0")}.webp`;
}

/** Coarse-to-fine order (every 32nd frame, then 16th, …): the whole range is usable early, detail fills in */
export function loadOrder(count: number) {
  const order: number[] = [];
  const seen = new Set<number>();
  for (const step of [32, 16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (seen.has(i)) continue;
      seen.add(i);
      order.push(i);
    }
  }
  return order;
}

/** The nearest frame to `i` that has finished loading (-1 if none), so the canvas is never blank */
export function nearestLoaded(frames: (HTMLImageElement | undefined)[], i: number) {
  const loaded = (k: number) => frames[k]?.complete && frames[k]!.naturalWidth;
  for (let d = 0; d < frames.length; d++) {
    if (loaded(i - d)) return i - d;
    if (loaded(i + d)) return i + d;
  }
  return -1;
}
