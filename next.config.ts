import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  // output: "export", // 👈 generates static HTML
  // images: {
  //   unoptimized: true, // 👈 important for GitHub Pages
  // },
  // basePath: "/casino-offers-demo", // 👈 change this to match your repo name
  // assetPrefix: "/casino-offers-demo/",
};

export default nextConfig;
