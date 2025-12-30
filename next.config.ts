import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "firebasestorage.googleapis.com" },
      { hostname: "unpkg.com" },
    ],
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "192.168.1.38",
    "http://192.168.1.38:3000",
    "http://192.168.1.38:3000/",
  ],
  // Configuración para mejorar hot reload en Windows
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  /* config options here */
};

export default nextConfig;
