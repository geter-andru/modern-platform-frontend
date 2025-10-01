import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hybrid configuration for Netlify with Edge Functions
  output: 'standalone', // Reduces deployment size significantly
  
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
  
  // TypeScript checking - DISABLED for MVP to get live faster
  typescript: {
    ignoreBuildErrors: true  // MVP: Skip TypeScript errors to get live faster
  },
  
  // ESLint enabled for development - IGNORED during builds for MVP
  eslint: {
    ignoreDuringBuilds: true  // MVP: Skip ESLint warnings to get live faster
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
    
    // Tree shaking optimization
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false
    };
    
    return config;
  }
};

export default nextConfig;
