import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-supabase-project.supabase.co",
      },
      {
        protocol: "https",
        hostname: "meals28.com",
      },
    ],
  },
};

export default config;
