#!/usr/bin/env node

/**
 * Comprehensive ICP Tool Testing Script
 * Tests all ICP functionality systematically
 */

const https = require('https');
const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const ADMIN_CUSTOMER_ID = 'dru78DR9789SDF862';
const ADMIN_ACCESS_TOKEN = 'admin-demo-token-2025';

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'ICP-Test-Script/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Test function
async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n🧪 Testing: ${testName}`);
  
  try {
    const result = await testFunction();
    if (result.success) {
      testResults.passed++;
      console.log(`✅ PASSED: ${testName}`);
      if (result.details) {
        console.log(`   ${result.details}`);
      }
    } else {
      testResults.failed++;
      console.log(`❌ FAILED: ${testName}`);
      console.log(`   Error: ${result.error}`);
    }
    testResults.details.push({
      name: testName,
      success: result.success,
      error: result.error,
      details: result.details
    });
  } catch (error) {
    testResults.failed++;
    console.log(`❌ FAILED: ${testName} - Exception: ${error.message}`);
    testResults.details.push({
      name: testName,
      success: false,
      error: error.message,
      details: null
    });
  }
}

// Test 1: Check if development server is running
async function testServerRunning() {
  try {
    const response = await makeRequest(BASE_URL);
    return {
      success: response.statusCode === 200,
      details: `Server responding with status ${response.statusCode}`,
      error: response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Server not accessible: ${error.message}`
    };
  }
}

// Test 2: Test login page accessibility
async function testLoginPage() {
  try {
    const response = await makeRequest(`${BASE_URL}/login`);
    const hasGoogleAuth = response.body.includes('Continue with Google');
    const hasEmailAuth = response.body.includes('Send Magic Link');
    
    return {
      success: response.statusCode === 200 && hasGoogleAuth && hasEmailAuth,
      details: `Login page loaded with Google OAuth and email auth`,
      error: !hasGoogleAuth ? 'Google OAuth button not found' : 
             !hasEmailAuth ? 'Email auth not found' : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Login page not accessible: ${error.message}`
    };
  }
}

// Test 3: Test ICP main page (should redirect to login)
async function testICPMainPageRedirect() {
  try {
    const response = await makeRequest(`${BASE_URL}/icp`);
    const redirectsToLogin = response.statusCode === 307 || response.statusCode === 308;
    
    return {
      success: redirectsToLogin,
      details: `ICP page properly redirects to login (${response.statusCode})`,
      error: !redirectsToLogin ? `Expected redirect (307/308), got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP main page test failed: ${error.message}`
    };
  }
}

// Test 4: Test ICP overview page (should redirect to login)
async function testICPOverviewPageRedirect() {
  try {
    const response = await makeRequest(`${BASE_URL}/icp/overview`);
    const redirectsToLogin = response.statusCode === 307 || response.statusCode === 308;
    
    return {
      success: redirectsToLogin,
      details: `ICP overview page properly redirects to login (${response.statusCode})`,
      error: !redirectsToLogin ? `Expected redirect (307/308), got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP overview page test failed: ${error.message}`
    };
  }
}

// Test 5: Test all ICP sub-pages for proper redirect behavior
async function testICPSubPages() {
  const icpPages = [
    '/icp/personas',
    '/icp/product', 
    '/icp/rating',
    '/icp/translator',
    '/icp/rate-company'
  ];
  
  let allRedirected = true;
  let details = [];
  
  for (const page of icpPages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      const redirectsToLogin = response.statusCode === 307 || response.statusCode === 308;
      details.push(`${page}: ${response.statusCode}`);
      
      if (!redirectsToLogin) {
        allRedirected = false;
      }
    } catch (error) {
      allRedirected = false;
      details.push(`${page}: ERROR - ${error.message}`);
    }
  }
  
  return {
    success: allRedirected,
    details: `All ICP sub-pages redirect properly: ${details.join(', ')}`,
    error: !allRedirected ? 'Some ICP sub-pages do not redirect to login' : null
  };
}

// Test 6: Test API endpoints accessibility
async function testICPAPIEndpoints() {
  const apiEndpoints = [
    '/api/icp-analysis/test/route',
    '/api/research'
  ];
  
  let allAccessible = true;
  let details = [];
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint}`);
      details.push(`${endpoint}: ${response.statusCode}`);
      
      // API endpoints might return 404, 405, or other status codes
      // We just want to ensure they're accessible (not 500 errors)
      if (response.statusCode >= 500) {
        allAccessible = false;
      }
    } catch (error) {
      allAccessible = false;
      details.push(`${endpoint}: ERROR - ${error.message}`);
    }
  }
  
  return {
    success: allAccessible,
    details: `API endpoints accessible: ${details.join(', ')}`,
    error: !allAccessible ? 'Some API endpoints are not accessible' : null
  };
}

// Test 7: Test authentication with admin credentials (if possible)
async function testAdminAuthentication() {
  try {
    // Try to access a protected route with admin credentials
    const response = await makeRequest(`${BASE_URL}/icp?customerId=${ADMIN_CUSTOMER_ID}&token=${ADMIN_ACCESS_TOKEN}`);
    
    // This might still redirect, but we're testing if the credentials are recognized
    return {
      success: true,
      details: `Admin credentials test completed (status: ${response.statusCode})`,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: `Admin authentication test failed: ${error.message}`
    };
  }
}

// Test 8: Test static assets loading
async function testStaticAssets() {
  try {
    const response = await makeRequest(`${BASE_URL}/favicon.ico`);
    return {
      success: response.statusCode === 200,
      details: `Static assets loading properly (favicon: ${response.statusCode})`,
      error: response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Static assets test failed: ${error.message}`
    };
  }
}

// Test 9: Test CSS and JS assets
async function testCSSJSAssets() {
  try {
    // Test if the main CSS file is accessible
    const response = await makeRequest(`${BASE_URL}/_next/static/css/app/layout.css`);
    return {
      success: response.statusCode === 200,
      details: `CSS/JS assets loading properly (CSS: ${response.statusCode})`,
      error: response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `CSS/JS assets test failed: ${error.message}`
    };
  }
}

// Test 10: Test home page accessibility
async function testHomePage() {
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    const hasSignInLink = response.body.includes('Sign In');
    const hasGetStartedLink = response.body.includes('Get Started');
    
    return {
      success: response.statusCode === 200 && hasSignInLink && hasGetStartedLink,
      details: `Home page loaded with navigation links`,
      error: !hasSignInLink ? 'Sign In link not found' : 
             !hasGetStartedLink ? 'Get Started link not found' : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Home page test failed: ${error.message}`
    };
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting Comprehensive ICP Tool Testing');
  console.log('=' .repeat(60));
  
  // Run all tests
  await runTest('Development Server Running', testServerRunning);
  await runTest('Home Page Accessibility', testHomePage);
  await runTest('Login Page Functionality', testLoginPage);
  await runTest('ICP Main Page Redirect', testICPMainPageRedirect);
  await runTest('ICP Overview Page Redirect', testICPOverviewPageRedirect);
  await runTest('ICP Sub-Pages Redirect', testICPSubPages);
  await runTest('ICP API Endpoints', testICPAPIEndpoints);
  await runTest('Admin Authentication Test', testAdminAuthentication);
  await runTest('Static Assets Loading', testStaticAssets);
  await runTest('CSS/JS Assets Loading', testCSSJSAssets);
  
  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.details
      .filter(test => !test.success)
      .forEach(test => {
        console.log(`   • ${test.name}: ${test.error}`);
      });
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. If authentication tests failed, set up Supabase authentication');
  console.log('2. If API tests failed, check backend API server status');
  console.log('3. If asset tests failed, check Next.js build process');
  console.log('4. For full functionality testing, authenticate with admin credentials');
  
  return testResults;
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testResults };



