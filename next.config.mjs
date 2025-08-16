/** @type {import('next').NextConfig} */

// const url = "ralli.logodesignagency.co";
// const port = "8001";
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

export default nextConfig;
