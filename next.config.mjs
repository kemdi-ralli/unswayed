// next.config.mjs
import { createRequire } from "node:module";
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const require = createRequire(import.meta.url);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const url = "10.10.1.2";
const port = "8000";

const nextConfig = {
  // Re-enable webpack cache for faster rebuilds (was disabled with cache: false).
  webpack: (config) => {
    return config;
  },

  transpilePackages: ["mui-tel-input"],

  images: {
    domains: [url, "unswayed.onrender.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unswayed.onrender.com",
        pathname: "/storage/assets/posts/media/**",
      },
      {
        protocol: "https",
        hostname: "unswayed.onrender.com",
        pathname: "/storage/assets/images/profiles/**",
      },
      {
        protocol: "http",
        hostname: url,
        port: port,
        pathname: "/assets/images/profiles/**",
      },
      {
        protocol: "http",
        hostname: url,
        port: port,
        pathname: "/assets/posts/media/**",
      },
      {
        protocol: "http",
        hostname: url,
        port: port,
        pathname: "/storage/assets/posts/media/**",
      },
    ],
  },
};

// PWA options must be passed directly to withPWA(...)
const pwaOptions = {
  dest: "public", // keeps /sw.js at project root
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/], // recommended on Vercel
  fallbacks: {
    document: "/offline.html", // ensure this file exists in /public
  },
};

// Export: PWA wrap first, then optional bundle analyzer (ANALYZE=true npm run build)
export default withBundleAnalyzer(withPWA(pwaOptions)(nextConfig));
