#!/usr/bin/env node
/**
 * One-shot R2 uploader for already-encoded mp4 + jpg pairs.
 *
 * Used when we've ffmpeg-split a multi-beat source clip into multiple
 * already-optimized outputs and want to upload them without going
 * through the full re-encode pass in upload-asset.mjs.
 *
 * Usage:
 *   node scripts/upload-prebuilt.mjs <mp4-path> <jpg-path> <key>
 *
 * Same cache headers and content-types as upload-asset.mjs.
 */

import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(projectRoot, ".env.local") });

const [, , mp4Path, jpgPath, keyArg] = process.argv;
if (!mp4Path || !jpgPath || !keyArg) {
  console.error("Usage: node scripts/upload-prebuilt.mjs <mp4> <jpg> <key>");
  process.exit(1);
}

const key = keyArg.replace(/\.mp4$/i, "");

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
  const mb = (stat.size / 1024 / 1024).toFixed(2);
  console.log(`  uploaded s3://${bucket}/${r2Key}  ${mb} MB  etag=${head.ETag}`);
}

console.log(`Uploading ${key} (mp4 + poster)`);
await put(mp4Path, `${key}.mp4`, "video/mp4");
await put(jpgPath, `posters/${key}.jpg`, "image/jpeg");
console.log("Done.");
