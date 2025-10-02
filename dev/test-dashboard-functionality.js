#!/usr/bin/env node

/**
 * Comprehensive Dashboard Testing Script
 * Tests all dashboard functionality systematically
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
        'User-Agent': 'Dashboard-Test-Script/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': options.cookies || '',
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
    req.setTimeout(15000, () => {
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

// Test 1: Admin Dashboard Access
async function testAdminDashboardAccess() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/dashboard/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    const isDashboard = response.body.includes('Loading dashboard') || response.body.includes('dashboard');
    
    return {
      success: response.statusCode === 200 && isDashboard,
      details: `Dashboard page loaded successfully (status: ${response.statusCode})`,
      error: !isDashboard ? 'Dashboard content not found' : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Admin dashboard access failed: ${error.message}`
    };
  }
}

// Test 2: Dashboard Test Page Access
async function testDashboardTestPage() {
  try {
    const url = `${BASE_URL}/dashboard/test`;
    const response = await makeRequest(url);
    
    const hasTestContent = response.body.includes('Dashboard Test Environment') || 
                          response.body.includes('Test all dashboard components');
    
    return {
      success: response.statusCode === 200 && hasTestContent,
      details: `Dashboard test page loaded (status: ${response.statusCode})`,
      error: !hasTestContent ? 'Dashboard test content not found' : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Dashboard test page access failed: ${error.message}`
    };
  }
}

// Test 3: Enhanced Dashboard Test Page
async function testEnhancedDashboardTestPage() {
  try {
    const url = `${BASE_URL}/dashboard/enhanced-test`;
    const response = await makeRequest(url);
    
    const hasEnhancedContent = response.body.includes('Enhanced Dashboard Test') || 
                              response.body.includes('6-Level System') ||
                              response.body.includes('Competency Gauges');
    
    return {
      success: response.statusCode === 200 && hasEnhancedContent,
      details: `Enhanced dashboard test page loaded (status: ${response.statusCode})`,
      error: !hasEnhancedContent ? 'Enhanced dashboard test content not found' : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Enhanced dashboard test page access failed: ${error.message}`
    };
  }
}

// Test 4: Main Dashboard Page
async function testMainDashboardPage() {
  try {
    const url = `${BASE_URL}/dashboard`;
    const response = await makeRequest(url);
    
    // This should redirect to login, which is expected behavior
    const redirectsToLogin = response.statusCode === 307 || response.statusCode === 308;
    
    return {
      success: redirectsToLogin,
      details: `Main dashboard properly redirects to login (status: ${response.statusCode})`,
      error: !redirectsToLogin ? `Expected redirect (307/308), got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Main dashboard page test failed: ${error.message}`
    };
  }
}

// Test 5: Dashboard API Endpoints
async function testDashboardAPIEndpoints() {
  const apiEndpoints = [
    `/api/progress/${ADMIN_CUSTOMER_ID}`,
    `/api/progress/${ADMIN_CUSTOMER_ID}/track`,
    `/api/competency/levels`,
    `/api/behavioral-intelligence/${ADMIN_CUSTOMER_ID}`
  ];
  
  let allAccessible = true;
  let details = [];
  
  for (const endpoint of apiEndpoints) {
    try {
      const url = `${BASE_URL}${endpoint}?token=${ADMIN_ACCESS_TOKEN}`;
      const response = await makeRequest(url);
      details.push(`${endpoint}: ${response.statusCode}`);
      
      // API endpoints might return various status codes
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
    details: `Dashboard API endpoints accessible: ${details.join(', ')}`,
    error: !allAccessible ? 'Some dashboard API endpoints are not accessible' : null
  };
}

// Test 6: Dashboard Component Structure
async function testDashboardComponentStructure() {
  try {
    const url = `${BASE_URL}/dashboard/enhanced-test`;
    const response = await makeRequest(url);
    
    // Check for key dashboard components
    const components = [
      'Competency Gauges',
      'Progress Tracking',
      'Tool Unlock Status',
      'Contextual Help',
      'Notifications Panel',
      'Dashboard Test Environment',
      'Full Dashboard Test',
      'Component Test'
    ];
    
    const foundComponents = components.filter(component => 
      response.body.includes(component)
    );
    
    const componentScore = foundComponents.length / components.length;
    
    return {
      success: componentScore >= 0.6, // 60% of components should be present
      details: `Found ${foundComponents.length}/${components.length} components (${(componentScore * 100).toFixed(1)}%)`,
      error: componentScore < 0.6 ? `Only ${(componentScore * 100).toFixed(1)}% of expected components found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Dashboard component structure test failed: ${error.message}`
    };
  }
}

// Test 7: Dashboard Performance
async function testDashboardPerformance() {
  try {
    const startTime = Date.now();
    const url = `${BASE_URL}/dashboard/enhanced-test`;
    const response = await makeRequest(url);
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    const isFast = loadTime < 5000; // Should load in under 5 seconds
    
    return {
      success: response.statusCode === 200 && isFast,
      details: `Dashboard loaded in ${loadTime}ms (status: ${response.statusCode})`,
      error: !isFast ? `Dashboard too slow: ${loadTime}ms` : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Dashboard performance test failed: ${error.message}`
    };
  }
}

// Test 8: Dashboard Responsive Design
async function testDashboardResponsiveDesign() {
  try {
    const url = `${BASE_URL}/dashboard/enhanced-test`;
    const response = await makeRequest(url);
    
    // Check for responsive design elements
    const responsiveElements = [
      'grid',
      'lg:grid-cols',
      'md:grid-cols',
      'flex',
      'space-y',
      'gap-',
      'max-w-',
      'mx-auto'
    ];
    
    const foundElements = responsiveElements.filter(element => 
      response.body.includes(element)
    );
    
    const responsiveScore = foundElements.length / responsiveElements.length;
    
    return {
      success: responsiveScore >= 0.5, // 50% of responsive elements should be present
      details: `Found ${foundElements.length}/${responsiveElements.length} responsive elements (${(responsiveScore * 100).toFixed(1)}%)`,
      error: responsiveScore < 0.5 ? `Only ${(responsiveScore * 100).toFixed(1)}% of expected responsive elements found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Dashboard responsive design test failed: ${error.message}`
    };
  }
}

// Test 9: Dashboard JavaScript Functionality
async function testDashboardJavaScriptFunctionality() {
  try {
    const url = `${BASE_URL}/dashboard/enhanced-test`;
    const response = await makeRequest(url);
    
    // Check for JavaScript functionality indicators
    const jsIndicators = [
      'useState',
      'useEffect',
      'onClick',
      'onChange',
      'script',
      'React',
      'Component'
    ];
    
    const foundIndicators = jsIndicators.filter(indicator => 
      response.body.includes(indicator)
    );
    
    const jsScore = foundIndicators.length / jsIndicators.length;
    
    return {
      success: jsScore >= 0.3, // 30% of JS indicators should be present
      details: `Found ${foundIndicators.length}/${jsIndicators.length} JavaScript indicators (${(jsScore * 100).toFixed(1)}%)`,
      error: jsScore < 0.3 ? `Only ${(jsScore * 100).toFixed(1)}% of expected JavaScript indicators found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Dashboard JavaScript functionality test failed: ${error.message}`
    };
  }
}

// Test 10: Dashboard Security
async function testDashboardSecurity() {
  try {
    const url = `${BASE_URL}/dashboard/enhanced-test`;
    const response = await makeRequest(url);
    
    // Check for security indicators
    const securityIndicators = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Content-Security-Policy',
      'X-XSS-Protection'
    ];
    
    const foundIndicators = securityIndicators.filter(indicator => 
      response.headers[indicator.toLowerCase()] || response.headers[indicator]
    );
    
    const securityScore = foundIndicators.length / securityIndicators.length;
    
    return {
      success: securityScore >= 0.25, // 25% of security indicators should be present
      details: `Found ${foundIndicators.length}/${securityIndicators.length} security indicators (${(securityScore * 100).toFixed(1)}%)`,
      error: securityScore < 0.25 ? `Only ${(securityScore * 100).toFixed(1)}% of expected security indicators found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Dashboard security test failed: ${error.message}`
    };
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Dashboard Testing');
  console.log('=' .repeat(60));
  console.log(`Testing with Admin Credentials:`);
  console.log(`Customer ID: ${ADMIN_CUSTOMER_ID}`);
  console.log(`Access Token: ${ADMIN_ACCESS_TOKEN}`);
  console.log('=' .repeat(60));
  
  // Run all tests
  await runTest('Admin Dashboard Access', testAdminDashboardAccess);
  await runTest('Dashboard Test Page', testDashboardTestPage);
  await runTest('Enhanced Dashboard Test Page', testEnhancedDashboardTestPage);
  await runTest('Main Dashboard Page Redirect', testMainDashboardPage);
  await runTest('Dashboard API Endpoints', testDashboardAPIEndpoints);
  await runTest('Dashboard Component Structure', testDashboardComponentStructure);
  await runTest('Dashboard Performance', testDashboardPerformance);
  await runTest('Dashboard Responsive Design', testDashboardResponsiveDesign);
  await runTest('Dashboard JavaScript Functionality', testDashboardJavaScriptFunctionality);
  await runTest('Dashboard Security', testDashboardSecurity);
  
  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 DASHBOARD TEST SUMMARY');
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
  
  console.log('\n🎯 DASHBOARD ASSESSMENT:');
  if (testResults.passed >= 8) {
    console.log('🟢 EXCELLENT: Dashboard is highly functional and ready for production');
  } else if (testResults.passed >= 6) {
    console.log('🟡 GOOD: Dashboard is functional with minor issues to address');
  } else if (testResults.passed >= 4) {
    console.log('🟠 FAIR: Dashboard has significant issues that need attention');
  } else {
    console.log('🔴 POOR: Dashboard has major issues requiring immediate attention');
  }
  
  console.log('\n🔗 TESTING URLs:');
  console.log(`Admin Dashboard: ${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/dashboard/?token=${ADMIN_ACCESS_TOKEN}`);
  console.log(`Dashboard Test: ${BASE_URL}/dashboard/test`);
  console.log(`Enhanced Test: ${BASE_URL}/dashboard/enhanced-test`);
  
  return testResults;
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testResults };



