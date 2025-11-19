// next.config.mjs
import withPWA from 'next-pwa';
import { join } from 'path';
import runtimeCaching from 'next-pwa/cache.js';

const url = "10.10.1.2";
const port = "8000";

const nextConfig = {
  webpack: (config) => {
    config.cache = false; // disable webpack cache
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

// Wrap the Next.js config with PWA settings
export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public', // service worker will be generated here
    register: true, // auto-register service worker
    skipWaiting: true, // immediately activate new service worker
    disable: process.env.NODE_ENV === 'development', // disable in dev
    runtimeCaching,
    fallback: {
      document: "/offline.html", // served when user is offline
    },
  },
});
