// next.config.mjs
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const url = "10.10.1.2";
const port = "8000";

const nextConfig = {
  // Next.js webpack customizations belong here (NOT inside withPWA options).
  webpack: (config) => {
    config.cache = false;
    return config;
  },

  transpilePackages: ["mui-tel-input"],

  images: {
    domains: [url],
    remotePatterns: [
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

// Export the wrapped config
export default withPWA(pwaOptions)(nextConfig);
