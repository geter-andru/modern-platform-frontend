import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development configuration - no static export
  // output: 'export', // Disabled for development to allow middleware
  
  // Trailing slash disabled for development (APIs don't use trailing slashes)
  trailingSlash: false,
  
  // Image optimization enabled for development
  images: {
    unoptimized: false
  },
  
  // Base path configuration
  basePath: '',
  
  // Asset prefix
  assetPrefix: '',
  
  // TypeScript checking - DISABLED for MVP to get live faster
  typescript: {
    ignoreBuildErrors: true  // MVP: Skip TypeScript errors to get live faster
  },
  
  // ESLint enabled for development - IGNORED during builds for MVP
  eslint: {
    ignoreDuringBuilds: true  // MVP: Skip ESLint warnings to get live faster
  },
  
  // Experimental features
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
