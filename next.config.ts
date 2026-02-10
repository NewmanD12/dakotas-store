// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",        // ← THIS LINE IS THE FIX
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com", // fallback, just in case
        pathname: "/f/**",
      },
    ],
  },
};

module.exports = nextConfig;