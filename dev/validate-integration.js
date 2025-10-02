#!/usr/bin/env node

/**
 * Integration Validation Script
 * Tests system integration without requiring running servers
 */

console.log('🔗 System Integration Validation\n');

// Test imports and module loading
console.log('📦 Module Loading Tests:');

async function testModuleImports() {
  try {
    // Test rate limiter
    const rateLimiter = await import('./lib/middleware/rate-limiter.ts');
    console.log('✅ Rate limiter module loads successfully');
    
    // Test cache
    const cache = await import('./lib/cache/memory-cache.ts');  
    console.log('✅ Cache module loads successfully');
    
    // Test error handler
    const errorHandler = await import('./lib/middleware/error-handler.ts');
    console.log('✅ Error handler module loads successfully');
    
    // Test job queue
    const jobQueue = await import('./lib/queue/job-queue.ts');
    console.log('✅ Job queue module loads successfully');
    
    // Test job service
    const jobService = await import('./lib/services/job-service.ts');
    console.log('✅ Job service module loads successfully');
    
    return true;
  } catch (error) {
    console.log('❌ Module import failed:', error.message);
    return false;
  }
}

// Test configuration integration
console.log('\n⚙️  Configuration Integration:');

function testConfigurationIntegration() {
  const fs = require('fs');
  const path = require('path');
  
  // Check if configurations are compatible
  const rateLimiterContent = fs.readFileSync(path.join(process.cwd(), 'lib/middleware/rate-limiter.ts'), 'utf8');
  const cacheContent = fs.readFileSync(path.join(process.cwd(), 'lib/cache/memory-cache.ts'), 'utf8');
  const queueContent = fs.readFileSync(path.join(process.cwd(), 'lib/queue/job-queue.ts'), 'utf8');
  
  let configValid = true;
  
  // Check 10-user capacity alignment
  if (rateLimiterContent.includes('100 requests per minute') && 
      cacheContent.includes('maxSize: 1000') &&
      queueContent.includes('concurrency = 2')) {
    console.log('✅ All systems configured for 10-user capacity');
  } else {
    console.log('❌ Capacity configuration mismatch');
    configValid = false;
  }
  
  // Check error handling integration
  if (rateLimiterContent.includes('createAPIError') &&
      cacheContent.includes('ErrorType') &&
      queueContent.includes('createAPIError')) {
    console.log('✅ Error handling integrated across all systems');
  } else {
    console.log('❌ Error handling integration incomplete');
    configValid = false;
  }
  
  return configValid;
}

// Test API endpoint structure
console.log('\n🌐 API Endpoint Validation:');

function testAPIEndpoints() {
  const fs = require('fs');
  const path = require('path');
  
  const endpoints = [
    { path: 'app/api/health/route.ts', name: 'Health Check' },
    { path: 'app/api/jobs/route.ts', name: 'Job Management' },
    { path: 'app/api/jobs/[jobId]/route.ts', name: 'Individual Jobs' }
  ];
  
  let endpointsValid = true;
  
  endpoints.forEach(endpoint => {
    const filePath = path.join(process.cwd(), endpoint.path);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for proper error handling
      if (content.includes('withErrorHandling') && content.includes('createAPIError')) {
        console.log(`✅ ${endpoint.name} - Proper error handling`);
      } else {
        console.log(`❌ ${endpoint.name} - Missing error handling`);
        endpointsValid = false;
      }
      
      // Check for rate limiting
      if (content.includes('rateLimiter') || content.includes('createRateLimiter')) {
        console.log(`✅ ${endpoint.name} - Rate limiting implemented`);
      } else {
        console.log(`❌ ${endpoint.name} - Missing rate limiting`);
        endpointsValid = false;
      }
    } else {
      console.log(`❌ ${endpoint.name} - File missing`);
      endpointsValid = false;
    }
  });
  
  return endpointsValid;
}

// Test system dependencies
console.log('\n🔧 Dependency Validation:');

function testDependencies() {
  const fs = require('fs');
  const path = require('path');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json not found');
    return false;
  }
  
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = { ...packageContent.dependencies, ...packageContent.devDependencies };
  
  const requiredDeps = ['axios', 'cheerio'];
  let depsValid = true;
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} - Available`);
    } else {
      console.log(`❌ ${dep} - Missing`);
      depsValid = false;
    }
  });
  
  return depsValid;
}

// Main validation
async function runValidation() {
  console.log('🔍 Starting comprehensive integration validation...\n');
  
  const moduleTest = await testModuleImports();
  const configTest = testConfigurationIntegration();
  const endpointTest = testAPIEndpoints();
  const depTest = testDependencies();
  
  console.log('\n📊 Integration Validation Summary:');
  console.log('═'.repeat(50));
  
  if (moduleTest && configTest && endpointTest && depTest) {
    console.log('✅ ALL INTEGRATION TESTS PASSED');
    console.log('\nSystem Status:');
    console.log('• ✅ Module imports working');
    console.log('• ✅ Configuration aligned for 10 users');
    console.log('• ✅ API endpoints properly structured');
    console.log('• ✅ Dependencies available');
    console.log('\n🚀 System ready for Phase 4 implementation');
    return true;
  } else {
    console.log('❌ INTEGRATION ISSUES DETECTED');
    if (!moduleTest) console.log('• ❌ Module import problems');
    if (!configTest) console.log('• ❌ Configuration misalignment');
    if (!endpointTest) console.log('• ❌ API endpoint issues');
    if (!depTest) console.log('• ❌ Missing dependencies');
    console.log('\n⚠️  Fix issues before proceeding to Phase 4');
    return false;
  }
}

// Run validation
runValidation().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Validation failed with error:', error.message);
  process.exit(1);
});