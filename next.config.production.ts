import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output configuration for Netlify
  output: 'export', // Enable static export for Netlify
  
  // Trailing slash for static hosting
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Base path configuration (empty for root deployment)
  basePath: '',
  
  // Asset prefix for CDN
  assetPrefix: '',
  
  // Disable TypeScript checking during build for staging
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Disable ESLint during build for staging
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // Experimental features for better Netlify compatibility
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
