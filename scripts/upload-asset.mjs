#!/usr/bin/env node
/**
 * One-shot video asset uploader for Cloudflare R2.
 *
 * Re-encodes a source mp4 with the mobile-optimized profile we use for
 * every other scene (CRF 28, ~2.5 Mbps cap, faststart), extracts a
 * first-frame poster, and uploads both to R2 under the given key.
 *
 * Usage:
 *   node scripts/upload-asset.mjs <source.mp4> <key>
 *
 * Where <key> is the R2 object name without extension, e.g.
 *   node scripts/upload-asset.mjs "C:/path/in.mp4" scene-03-iron-rod
 *
 * Reads R2_* + NEXT_PUBLIC_VIDEO_BASE from .env.local. Idempotent:
 * overwrites existing keys (matches the immutable cache header strategy
 * — pair with an ASSET_VERSION bump in lib/story-data.ts to bust cache).
 *
 * NOT shipped at runtime: scripts/* is dev-only. ffmpeg-static,
 * @ffprobe-installer/ffprobe, @aws-sdk/client-s3, mime-types, and
 * dotenv are all in devDependencies.
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ffmpegPath from "ffmpeg-static";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env.local") });

const REQUIRED = [
  "R2_S3_ENDPOINT",
  "R2_BUCKET",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
];
for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.error(`Missing ${k} in .env.local`);
    process.exit(1);
  }
}

const [, , sourceArg, keyArg] = process.argv;
if (!sourceArg || !keyArg) {
  console.error("Usage: node scripts/upload-asset.mjs <source.mp4> <key>");
  console.error('  e.g. node scripts/upload-asset.mjs "C:/in.mp4" scene-03-iron-rod');
  process.exit(1);
}

const source = path.resolve(sourceArg);
const key = keyArg.replace(/\.mp4$/i, "");
const tmpDir = path.join(projectRoot, "tmp");
const outMp4 = path.join(tmpDir, `${key}.mp4`);
const outJpg = path.join(tmpDir, `${key}.jpg`);

await fs.mkdir(tmpDir, { recursive: true });

const sourceStat = await fs.stat(source).catch(() => null);
if (!sourceStat) {
  console.error(`Source not found: ${source}`);
  process.exit(1);
}

/** Promisified ffmpeg/ffprobe runner. Streams logs through stderr. */
function run(bin, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ["ignore", "inherit", "inherit"] });
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${path.basename(bin)} exited ${code}`))
    );
  });
}

function fmtBytes(n) {
  if (n > 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  if (n > 1024) return `${(n / 1024).toFixed(2)} KB`;
  return `${n} B`;
}

/* ---- 1. re-encode ---------------------------------------------------- */
console.log(`\n[1/4] Re-encoding ${path.basename(source)} (${fmtBytes(sourceStat.size)}) → ${path.basename(outMp4)}`);
await run(ffmpegPath, [
  "-y",
  "-i", source,
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "28",
  "-maxrate", "2500k",
  "-bufsize", "5000k",
  "-c:a", "aac",
  "-b:a", "96k",
  "-movflags", "+faststart",
  "-pix_fmt", "yuv420p",
  outMp4,
]);
const encStat = await fs.stat(outMp4);
const pct = ((1 - encStat.size / sourceStat.size) * 100).toFixed(1);
console.log(`      Encoded: ${fmtBytes(encStat.size)}  (${pct}% smaller)`);

/* ---- 2. poster ------------------------------------------------------- */
console.log(`\n[2/4] Extracting poster → ${path.basename(outJpg)}`);
await run(ffmpegPath, [
  "-y",
  "-ss", "0.5",
  "-i", outMp4,
  "-vframes", "1",
  "-q:v", "3",
  outJpg,
]);
const jpgStat = await fs.stat(outJpg);
console.log(`      Poster: ${fmtBytes(jpgStat.size)}`);

/* ---- 3. upload ------------------------------------------------------- */
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const bucket = process.env.R2_BUCKET;

async function put(file, r2Key, contentType) {
  const body = createReadStream(file);
  const stat = await fs.stat(file);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: r2Key,
      Body: body,
      ContentType: contentType,
      ContentLength: stat.size,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: r2Key }));
  console.log(`      uploaded s3://${bucket}/${r2Key}  ${fmtBytes(stat.size)}  etag=${head.ETag}`);
}

console.log(`\n[3/4] Uploading to R2 (${bucket})`);
await put(outMp4, `${key}.mp4`, "video/mp4");
await put(outJpg, `posters/${key}.jpg`, "image/jpeg");

/* ---- 4. summary ------------------------------------------------------ */
const publicBase = (process.env.R2_PUBLIC_URL ?? process.env.NEXT_PUBLIC_VIDEO_BASE ?? "").replace(/\/+$/, "");
console.log(`\n[4/4] Done.`);
if (publicBase) {
  console.log(`      video:  ${publicBase}/${key}.mp4`);
  console.log(`      poster: ${publicBase}/posters/${key}.jpg`);
}
console.log(`\n      Bump ASSET_VERSION in lib/story-data.ts to bust the immutable CDN cache.\n`);
