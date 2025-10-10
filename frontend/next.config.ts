import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration optimized for Netlify deployment
  // No explicit output mode - let Netlify handle the deployment type
  
  // Trailing slash disabled for API compatibility
  trailingSlash: false,
  
  // Image optimization enabled for hybrid mode
  images: {
    unoptimized: false
  },
  
  // Base path configuration
  basePath: '',
  
  // Asset prefix
  assetPrefix: '',
  
  // TypeScript checking enabled for development
  typescript: {
    ignoreBuildErrors: false  // Enable TypeScript error checking for code quality
  },
  
  // ESLint enabled for development
  eslint: {
    ignoreDuringBuilds: false  // Enable ESLint checking for code quality
  },
  
  // Server external packages (moved from experimental)
  serverExternalPackages: [
    '@supabase/supabase-js',
    '@supabase/ssr'
  ],
  
  // Experimental features
  experimental: {
    esmExternals: true
  },
  
  // Webpack configuration to reduce bundle size
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize large dependencies for server
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'canvas',
        'bufferutil': 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
      });
    }
    
    return config;
  }
};

export default nextConfig;
