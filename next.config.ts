import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "etmatyqawktbyaezzcks.supabase.co",
        pathname: "/storage/v1/object/public/sites/**",
      },
    ],



  },
};

export default nextConfig;
