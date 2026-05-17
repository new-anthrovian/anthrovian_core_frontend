# Video optimization roadmap

This document tracks the remaining mobile/network optimizations for the
`/play` video stage. Tier 1 has shipped — re-encoded all 10 videos at
CRF 28 / 2.5 Mbps cap with `+faststart` (445 MB → 67 MB, **85% smaller**)
and added `Save-Data` / `effectiveType` awareness in `VideoStage` (drop
`preload` to `"metadata"`, skip the next-scene hidden preload). What
follows is what's left, ordered roughly by impact-per-effort.

---

## Tier 2 — Adaptive bitrate streaming (the "3G-safe" answer)

**Why bother:** Tier 1 made every video smaller, but every viewer still
gets the same bitrate. A user on flaky 3G still has to download the
same 2.5 Mbps stream as a user on fibre. Adaptive bitrate (ABR) encodes
each video to multiple resolutions/bitrates (e.g. 240p, 480p, 720p) and
the player switches in real time based on measured bandwidth. This is
the only setup that genuinely delivers on the script's "optimised for
3G" promise without a manual download.

### Options

| Option | Cost | Effort | Lock-in |
|---|---|---|---|
| **Cloudflare Stream** | $1 per 1,000 min stored/mo + $1 per 1,000 min delivered (≈$0–2/mo at our scale) | ~half day | Their player (or `<iframe>` embed); CF-hosted only |
| **Bunny Stream** | ~$5–15/mo at moderate traffic | ~half day | Their player or `<iframe>`; works with hls.js |
| **Mux** | ~$5–20+/mo | ~2 hours | Their player or hls.js; premium analytics included |
| **DIY: ffmpeg HLS + R2 + hls.js** | $0 extra | ~1–2 days | Full control; you maintain the encoder pipeline |

**Recommendation if/when this gets prioritised:** start with
**Cloudflare Stream** — cheapest, already in the Cloudflare ecosystem,
and if it doesn't fit we can swap to DIY later without changing the
data model (just `VIDEO_BASE` + a player swap).

### Implementation sketch (DIY route)

1. ffmpeg pass per video, producing 3 renditions + a master `.m3u8`:
   ```bash
   ffmpeg -i scene-02-mockery.mp4 \
     -filter_complex "[0:v]split=3[v1][v2][v3]; \
       [v1]scale=-2:240[v240]; [v2]scale=-2:480[v480]; [v3]scale=-2:720[v720]" \
     -map "[v240]" -map "[v480]" -map "[v720]" -map 0:a -map 0:a -map 0:a \
     -c:v libx264 -preset slow -crf 28 \
     -b:v:0 400k -b:v:1 1000k -b:v:2 2500k \
     -c:a aac -b:a 96k \
     -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" \
     -hls_segment_filename "scene-02-mockery_%v_%03d.ts" \
     -master_pl_name "scene-02-mockery.m3u8" \
     "scene-02-mockery_%v.m3u8"
   ```
2. Upload all `.m3u8` + `.ts` segments to R2 (use the existing
   `R2_*` env vars in `.env.local`).
3. Swap `<video src={...}>` for an hls.js-driven `<video>`:
   ```ts
   import Hls from "hls.js";
   useEffect(() => {
     if (Hls.isSupported()) {
       const hls = new Hls({ maxBufferLength: 8 });
       hls.loadSource(src); // src now points to .m3u8
       hls.attachMedia(videoRef.current!);
       return () => hls.destroy();
     } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
       videoRef.current.src = src; // native HLS (Safari/iOS)
     }
   }, [src]);
   ```
4. Update `story-data.ts` paths to `.m3u8`. The faststart re-encoded
   MP4s stay in place as a fallback for hls.js failures.

### Acceptance criteria
- Real device on throttled 3G (Chrome DevTools "Slow 3G") plays without
  rebuffering, falling to the 240p rendition automatically.
- Same device on wifi gets 720p.
- Player switches mid-scene when bandwidth changes (test by toggling
  throttle while a video plays).

---

## Tier 3 — Polish / advanced

### 3a. AV1 codec fallback chain

**What:** Add an AV1-encoded version of each video. AV1 is ~30–50%
smaller than H.264 at equivalent quality. Browsers that support it
(Chrome 90+, Firefox 113+, Safari 17+) pick it; everything else
falls back to the H.264 file we already have.

**Effort:** ~2–3 hours encoding (AV1 is *slow* — `libaom-av1` or
`libsvtav1` preset 8, expect 0.1× realtime) + a `<source>` switch in
`VideoStage`.

**Catch:** decode-side support is fine, but **AV1 hardware decoders
are still uncommon on older mobile chips** — software decode burns
battery. Worth adding only after Tier 2 (adaptive) is in place so the
player can pick AV1 *and* the lowest viable resolution.

### 3b. PWA service-worker caching

**What:** First time a user plays a scene, the service worker caches
the video. Replay / Begin Again on the same device hits the cache,
zero network. Combined with the existing `Cache-Control: immutable`
headers, this gets us close to instant scene transitions on repeat
sessions.

**Effort:** ~half day. The project doesn't currently have a service
worker — would need to add `next-pwa` or hand-roll one. Cache strategy:
videos = `cache-first` with `cache.add()` on first request; story-data
= `stale-while-revalidate`.

**Catch:** browser cache budgets vary (~50 MB on iOS Safari). At 67 MB
total we might be close to the limit; should evict oldest scenes
intelligently. Not a problem on Android Chrome (more headroom).

### 3c. Connection-aware text-only fallback

**What:** On `effectiveType === "slow-2g"` (or if the video errors
twice), bypass the video entirely and render the scene as
`GriotTextOverlay` with the scene's poster as backdrop + a hand-written
narration. Requires populating `setupNarration` for every scene
(currently only Scene 3 Iron Rod has one).

**Effort:** ~3 hours to transcribe scene narration into `story-data.ts`
(text is already in `Sundiata_Rise_Full_Script_v1.docx`); ~30 min of
`VideoStage` / `PlayClient` logic to choose the fallback.

**Value:** This is the "graceful degradation" path for the worst
connections. Combined with Tier 2 adaptive, very few users would
actually hit this — but it's a nice safety net and it makes
`<video>`-disabled environments (some embedded browsers) playable.

### 3d. Audio compression

Current audio: AAC 96 kbps stereo (already dropped from the source's
156 kbps in the Tier 1 re-encode). For mostly-spoken content, dropping
to **AAC 64 kbps mono** for griot-narration scenes is fine and shaves
another ~2–3 MB across the set. Marginal.

### 3e. Per-region CDN

R2's edge is global, but if mobile users in specific African markets
report slow load times, consider mirroring assets via Bunny CDN (which
has stronger African edge presence). Decision should be data-driven —
wait for actual analytics from a deployed Tier 1 build before chasing
this.

---

## When to pick this back up

| Trigger | What to revisit |
|---|---|
| "Mobile rebuffers on 3G" complaints | Tier 2 (adaptive streaming) |
| Bandwidth bills creeping up | Tier 3a (AV1) |
| Users complain about repeat-play wait times | Tier 3b (PWA caching) |
| GLOMOS / press feedback about offline / very-slow markets | Tier 3c (text-only fallback) |
| Reports of slow loads from a specific country | Tier 3e (per-region CDN) |

## What's already done (Tier 1)

- ✅ Re-encoded all 10 videos: CRF 28, max 2.5 Mbps, faststart, AAC 96k
  — total set went from 445 MB → 67 MB (-85%)
- ✅ Cache-busting query string (`ASSET_VERSION` in `story-data.ts`)
  so re-uploads invalidate the year-long `immutable` CDN cache
- ✅ `VideoStage` respects `navigator.connection.saveData` /
  `effectiveType` — drops `preload` to `"metadata"` and skips the
  next-scene hidden preload when constrained
- ✅ Existing `onError` + 14s stall-watchdog converts broken or
  uncached videos to a recoverable "tap to continue" skip
