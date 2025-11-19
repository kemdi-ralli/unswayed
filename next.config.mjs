// next.config.mjs
import withPWA from 'next-pwa';
import { join } from 'path';
import runtimeCaching from 'next-pwa/cache.js';

const url = "10.10.1.2";
const port = "8000";

const nextConfig = {
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

export default withPWA({
  ...nextConfig,

  pwa: {
    dest: "public",            // keeps your /sw.js at root
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
    runtimeCaching,
    fallbacks: {
      document: "/offline.html",   // correct key
    },
  },
});
