import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack workspace root to THIS project. A stray empty
  // package-lock.json sits in the parent directory (an accidental npm
  // init artifact) and was confusing Next.js's lockfile-based root
  // detection — it would resolve modules from the parent dir's missing
  // node_modules and the build would fail with "Can't resolve
  // 'tailwindcss'". This pin makes the dev server resilient to that.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
