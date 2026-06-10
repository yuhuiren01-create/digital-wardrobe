import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zctcrpqbkdtdmldhsdph.supabase.co",
        pathname: "/storage/v1/object/public/wardrobe-images/**",
      },
    ],
  },
};

export default nextConfig;
