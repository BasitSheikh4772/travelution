import type { NextConfig } from "next";

// GitHub Pages build = fully static export under /<repo>. Normal build (Vercel/Node) is unaffected.
const pages = process.env.GITHUB_PAGES === "true";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(pages ? { output: "export" as const, trailingSlash: true, basePath: base, assetPrefix: base } : {}),
  cacheComponents: !pages,
  partialPrefetching: !pages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    unoptimized: pages,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
