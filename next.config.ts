import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-supabase-project.supabase.co", // Swap this with where your images are hosted!
      },
      // You can add more domains here if needed
    ],
  },
};

export default config;
