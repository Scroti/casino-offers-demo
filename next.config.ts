import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint config moved to separate file
  // Suppress all linting errors during build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Note: cacheComponents is not compatible with dynamic = 'force-dynamic'
  // We need dynamic rendering for pages using useSearchParams via layout
  images: {
    // Allow images from any domain by disabling optimization
    // This allows Next.js Image component to load images from any hostname
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
