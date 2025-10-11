#!/usr/bin/env node

/**
 * Development Configuration Validator
 * 
 * This script validates that the Next.js configuration is properly set up
 * for development mode and will not cause API route redirects or other issues.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating Development Configuration...\n');

// Check if next.config.ts exists
const configPath = path.join(__dirname, '..', 'next.config.ts');
if (!fs.existsSync(configPath)) {
  console.error('❌ next.config.ts not found!');
  process.exit(1);
}

// Read the configuration file
const configContent = fs.readFileSync(configPath, 'utf8');

// Validation rules
const validations = [
  {
    name: 'Static Export Disabled',
    check: () => {
      // Check if output: 'export' is present and not commented out
      const lines = configContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.includes('output:') && trimmed.includes('export') && !trimmed.startsWith('//')) {
          return false;
        }
      }
      return true;
    },
    error: '❌ output: "export" is enabled - this breaks API routes in development',
    fix: 'Comment out or remove the output: "export" line'
  },
  {
    name: 'Trailing Slash Disabled',
    check: () => configContent.includes('trailingSlash: false'),
    error: '❌ trailingSlash is not set to false - this causes API route redirects',
    fix: 'Set trailingSlash: false for development'
  },
  {
    name: 'Image Optimization Enabled',
    check: () => configContent.includes('unoptimized: false') || !configContent.includes('unoptimized: true'),
    error: '❌ Image optimization is disabled - this may cause issues in development',
    fix: 'Set images: { unoptimized: false } for development'
  },
  {
    name: 'TypeScript Errors Enabled',
    check: () => configContent.includes('ignoreBuildErrors: false') || !configContent.includes('ignoreBuildErrors: true'),
    error: '❌ TypeScript errors are being ignored - this may hide issues',
    fix: 'Set typescript: { ignoreBuildErrors: false } for development'
  },
  {
    name: 'ESLint Enabled',
    check: () => configContent.includes('ignoreDuringBuilds: false') || !configContent.includes('ignoreDuringBuilds: true'),
    error: '❌ ESLint is being ignored - this may hide code quality issues',
    fix: 'Set eslint: { ignoreDuringBuilds: false } for development'
  }
];

// Run validations
let allValid = true;
validations.forEach(validation => {
  if (validation.check()) {
    console.log(`✅ ${validation.name}`);
  } else {
    console.log(validation.error);
    console.log(`   Fix: ${validation.fix}\n`);
    allValid = false;
  }
});

// Check environment variables
console.log('\n🔍 Checking Environment Variables...');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const envChecks = [
    {
      name: 'Supabase URL',
      check: () => envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && !envContent.includes('your-project-id'),
      error: '❌ NEXT_PUBLIC_SUPABASE_URL not set or using placeholder'
    },
    {
      name: 'Supabase Anon Key',
      check: () => envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && !envContent.includes('your_supabase_anon_key'),
      error: '❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set or using placeholder'
    },
    {
      name: 'Backend URL',
      check: () => envContent.includes('NEXT_PUBLIC_BACKEND_URL='),
      error: '❌ NEXT_PUBLIC_BACKEND_URL not set'
    }
  ];
  
  envChecks.forEach(check => {
    if (check.check()) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(check.error);
      allValid = false;
    }
  });
} else {
  console.log('❌ .env.local file not found');
  allValid = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 Development configuration is valid!');
  console.log('✅ API routes should work without redirects');
  console.log('✅ All environment variables are configured');
  process.exit(0);
} else {
  console.log('❌ Development configuration has issues!');
  console.log('🔧 Please fix the issues above before starting development');
  process.exit(1);
}
