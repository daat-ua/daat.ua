// The video testimonials' player (the ATLAS page's testimonials, the contact page): HLS from Cloudflare R2, the
// Studio's "Video folder". A <video data-src="…/playlist.m3u8"> is attached once and kept: hls.js (loaded only
// then, capped to the player's size), or the browser's own HLS where hls.js can't run (iOS). Before play only the
// first seconds are fetched (two 4 s segments); `startPlaying` raises it to hls.js's usual 30 s ahead.

const HLS_TYPE = "application/vnd.apple.mpegurl";
const PRELOAD_BUFFER = 8;
const PLAY_BUFFER = 30;

const attached = new WeakMap<HTMLVideoElement, Promise<void>>();
const raiseBuffer = new WeakMap<HTMLVideoElement, () => void>();

/** Attach the video's HLS source (once); resolves when the player can take play(). A failed attachment (the
 * player didn't load, say offline) isn't kept: the next call tries again. */
export function attach(video: HTMLVideoElement) {
  let ready = attached.get(video);
  if (!ready) {
    ready = (async () => {
      const src = video.dataset.src!;
      const { default: Hls } = await import("hls.js");
      if (Hls.isSupported()) {
        const hls = new Hls({ capLevelToPlayerSize: true, maxBufferLength: PRELOAD_BUFFER });
        raiseBuffer.set(video, () => (hls.config.maxBufferLength = PLAY_BUFFER));
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (!data.fatal) return;
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else hls.destroy();
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType(HLS_TYPE)) {
        video.preload = "auto";
        video.src = src;
      }
    })();
    ready.catch(() => attached.delete(video));
    attached.set(video, ready);
  }
  return ready;
}

/** Once playing, buffer as far ahead as hls.js usually does */
export const startPlaying = (video: HTMLVideoElement) => raiseBuffer.get(video)?.();
