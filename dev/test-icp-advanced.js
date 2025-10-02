#!/usr/bin/env node

/**
 * Advanced ICP Tool Testing Script
 * Tests actual ICP functionality with admin credentials
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
        'User-Agent': 'ICP-Advanced-Test-Script/1.0',
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

// Test 1: Admin ICP Page Access
async function testAdminICPAccess() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    const hasICPTitle = response.body.includes('Ideal Customer Profile Analysis');
    const hasAIFeatures = response.body.includes('AI Customer Intelligence');
    const hasQuickStart = response.body.includes('Start Analysis');
    const hasNavigation = response.body.includes('Overview') && response.body.includes('Analysis');
    
    return {
      success: response.statusCode === 200 && hasICPTitle && hasAIFeatures && hasQuickStart && hasNavigation,
      details: `ICP page loaded with all key features (status: ${response.statusCode})`,
      error: !hasICPTitle ? 'ICP title not found' : 
             !hasAIFeatures ? 'AI features not found' : 
             !hasQuickStart ? 'Quick start button not found' : 
             !hasNavigation ? 'Navigation tabs not found' : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `Admin ICP access failed: ${error.message}`
    };
  }
}

// Test 2: Admin Dashboard Access
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

// Test 3: ICP API Endpoints with Admin Credentials
async function testICPAPIEndpoints() {
  const apiEndpoints = [
    `/api/icp-analysis/${ADMIN_CUSTOMER_ID}`,
    `/api/research`,
    `/api/progress/${ADMIN_CUSTOMER_ID}`,
    `/api/competency/levels`
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
    details: `API endpoints accessible: ${details.join(', ')}`,
    error: !allAccessible ? 'Some API endpoints are not accessible' : null
  };
}

// Test 4: ICP Component Structure Analysis
async function testICPComponentStructure() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    // Check for key ICP components
    const components = [
      'AI Customer Intelligence',
      'Market Segmentation', 
      'Competitive Analysis',
      'Quick Start',
      'Recent Analysis',
      'Overview',
      'Analysis',
      'Insights',
      'Reports'
    ];
    
    const foundComponents = components.filter(component => 
      response.body.includes(component)
    );
    
    const componentScore = foundComponents.length / components.length;
    
    return {
      success: componentScore >= 0.8, // 80% of components should be present
      details: `Found ${foundComponents.length}/${components.length} components (${(componentScore * 100).toFixed(1)}%)`,
      error: componentScore < 0.8 ? `Only ${(componentScore * 100).toFixed(1)}% of expected components found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP component structure test failed: ${error.message}`
    };
  }
}

// Test 5: ICP Page Performance
async function testICPPagePerformance() {
  try {
    const startTime = Date.now();
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    const isFast = loadTime < 3000; // Should load in under 3 seconds
    
    return {
      success: response.statusCode === 200 && isFast,
      details: `Page loaded in ${loadTime}ms (status: ${response.statusCode})`,
      error: !isFast ? `Page too slow: ${loadTime}ms` : 
             response.statusCode !== 200 ? `Expected 200, got ${response.statusCode}` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP page performance test failed: ${error.message}`
    };
  }
}

// Test 6: ICP Navigation Structure
async function testICPNavigationStructure() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    // Check for navigation elements
    const navElements = [
      'Overview',
      'Analysis', 
      'Insights',
      'Reports'
    ];
    
    const foundNavElements = navElements.filter(nav => 
      response.body.includes(nav)
    );
    
    const navScore = foundNavElements.length / navElements.length;
    
    return {
      success: navScore >= 0.75, // 75% of nav elements should be present
      details: `Found ${foundNavElements.length}/${navElements.length} navigation elements (${(navScore * 100).toFixed(1)}%)`,
      error: navScore < 0.75 ? `Only ${(navScore * 100).toFixed(1)}% of expected navigation elements found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP navigation structure test failed: ${error.message}`
    };
  }
}

// Test 7: ICP Content Quality
async function testICPContentQuality() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    // Check for quality content indicators
    const qualityIndicators = [
      'AI-powered',
      'customer intelligence',
      'market research',
      'profiling',
      'segmentation',
      'analysis',
      'insights'
    ];
    
    const foundIndicators = qualityIndicators.filter(indicator => 
      response.body.toLowerCase().includes(indicator.toLowerCase())
    );
    
    const qualityScore = foundIndicators.length / qualityIndicators.length;
    
    return {
      success: qualityScore >= 0.6, // 60% of quality indicators should be present
      details: `Found ${foundIndicators.length}/${qualityIndicators.length} quality indicators (${(qualityScore * 100).toFixed(1)}%)`,
      error: qualityScore < 0.6 ? `Only ${(qualityScore * 100).toFixed(1)}% of expected quality indicators found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP content quality test failed: ${error.message}`
    };
  }
}

// Test 8: ICP Responsive Design Elements
async function testICPResponsiveDesign() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    // Check for responsive design elements
    const responsiveElements = [
      'grid',
      'md:grid-cols',
      'lg:grid-cols',
      'flex',
      'space-y',
      'gap-'
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
      error: `ICP responsive design test failed: ${error.message}`
    };
  }
}

// Test 9: ICP JavaScript Functionality
async function testICPJavaScriptFunctionality() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    // Check for JavaScript functionality indicators
    const jsIndicators = [
      'script',
      'onClick',
      'onChange',
      'useState',
      'useEffect',
      'framer-motion',
      'lucide-react'
    ];
    
    const foundIndicators = jsIndicators.filter(indicator => 
      response.body.includes(indicator)
    );
    
    const jsScore = foundIndicators.length / jsIndicators.length;
    
    return {
      success: jsScore >= 0.4, // 40% of JS indicators should be present
      details: `Found ${foundIndicators.length}/${jsIndicators.length} JavaScript indicators (${(jsScore * 100).toFixed(1)}%)`,
      error: jsScore < 0.4 ? `Only ${(jsScore * 100).toFixed(1)}% of expected JavaScript indicators found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP JavaScript functionality test failed: ${error.message}`
    };
  }
}

// Test 10: ICP Security Headers
async function testICPSecurityHeaders() {
  try {
    const url = `${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`;
    const response = await makeRequest(url);
    
    // Check for security headers
    const securityHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Content-Security-Policy'
    ];
    
    const foundHeaders = securityHeaders.filter(header => 
      response.headers[header.toLowerCase()] || response.headers[header]
    );
    
    const securityScore = foundHeaders.length / securityHeaders.length;
    
    return {
      success: securityScore >= 0.25, // 25% of security headers should be present
      details: `Found ${foundHeaders.length}/${securityHeaders.length} security headers (${(securityScore * 100).toFixed(1)}%)`,
      error: securityScore < 0.25 ? `Only ${(securityScore * 100).toFixed(1)}% of expected security headers found` : null
    };
  } catch (error) {
    return {
      success: false,
      error: `ICP security headers test failed: ${error.message}`
    };
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting Advanced ICP Tool Testing');
  console.log('=' .repeat(60));
  console.log(`Testing with Admin Credentials:`);
  console.log(`Customer ID: ${ADMIN_CUSTOMER_ID}`);
  console.log(`Access Token: ${ADMIN_ACCESS_TOKEN}`);
  console.log('=' .repeat(60));
  
  // Run all tests
  await runTest('Admin ICP Page Access', testAdminICPAccess);
  await runTest('Admin Dashboard Access', testAdminDashboardAccess);
  await runTest('ICP API Endpoints', testICPAPIEndpoints);
  await runTest('ICP Component Structure', testICPComponentStructure);
  await runTest('ICP Page Performance', testICPPagePerformance);
  await runTest('ICP Navigation Structure', testICPNavigationStructure);
  await runTest('ICP Content Quality', testICPContentQuality);
  await runTest('ICP Responsive Design', testICPResponsiveDesign);
  await runTest('ICP JavaScript Functionality', testICPJavaScriptFunctionality);
  await runTest('ICP Security Headers', testICPSecurityHeaders);
  
  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 ADVANCED TEST SUMMARY');
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
  
  console.log('\n🎯 ICP TOOL ASSESSMENT:');
  if (testResults.passed >= 8) {
    console.log('🟢 EXCELLENT: ICP tool is highly functional and ready for production');
  } else if (testResults.passed >= 6) {
    console.log('🟡 GOOD: ICP tool is functional with minor issues to address');
  } else if (testResults.passed >= 4) {
    console.log('🟠 FAIR: ICP tool has significant issues that need attention');
  } else {
    console.log('🔴 POOR: ICP tool has major issues requiring immediate attention');
  }
  
  console.log('\n🔗 TESTING URLs:');
  console.log(`ICP Tool: ${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/icp/?token=${ADMIN_ACCESS_TOKEN}`);
  console.log(`Dashboard: ${BASE_URL}/customer/${ADMIN_CUSTOMER_ID}/simplified/dashboard/?token=${ADMIN_ACCESS_TOKEN}`);
  
  return testResults;
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testResults };



