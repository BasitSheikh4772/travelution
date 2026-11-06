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
      { protocol: "https", hostname: "travelution.com.pk" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // add your headless WP host here if it differs from the public domain
    ],
  },
};

export default nextConfig;
