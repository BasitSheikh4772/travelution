import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "travelution.com.pk" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // add your headless WP host here if it differs from the public domain
    ],
  },
};

export default nextConfig;
