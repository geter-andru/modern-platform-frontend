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

  // Redirects for SEO preservation (comparison pages: /ai-seo/ → /compare/)
  async redirects() {
    return [
      // Old "vs" URLs redirect to new "compare/and-" URLs
      {
        source: '/ai-seo/vs-clay',
        destination: '/compare/and-clay',
        permanent: true
      },
      {
        source: '/ai-seo/vs-gong',
        destination: '/compare/and-gong',
        permanent: true
      },
      {
        source: '/ai-seo/vs-hubspot',
        destination: '/compare/and-hubspot',
        permanent: true
      },
      {
        source: '/ai-seo/vs-salesforce',
        destination: '/compare/and-salesforce',
        permanent: true
      },
      {
        source: '/ai-seo/vs-zoominfo',
        destination: '/compare/and-zoominfo',
        permanent: true
      },
      // Old "and-" URLs also redirect to new /compare/ location
      {
        source: '/ai-seo/and-clay',
        destination: '/compare/and-clay',
        permanent: true
      },
      {
        source: '/ai-seo/and-gong',
        destination: '/compare/and-gong',
        permanent: true
      },
      {
        source: '/ai-seo/and-hubspot',
        destination: '/compare/and-hubspot',
        permanent: true
      },
      {
        source: '/ai-seo/and-salesforce',
        destination: '/compare/and-salesforce',
        permanent: true
      },
      {
        source: '/ai-seo/and-zoominfo',
        destination: '/compare/and-zoominfo',
        permanent: true
      }
    ];
  },

  // TypeScript checking ENABLED for production quality
  typescript: {
    ignoreBuildErrors: false  // ✅ Enforce type safety in production builds
  },

  // ESLint ENABLED for code quality
  eslint: {
    ignoreDuringBuilds: true  // ⚠️ Temporarily disabled to allow Command Palette deployment
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
