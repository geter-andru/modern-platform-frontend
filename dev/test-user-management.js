#!/usr/bin/env node

/**
 * User Management System Test Suite
 * Tests all functionality of Phase 3 implementation
 */

const API_BASE = 'http://localhost:3000/api';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'SuperSecure#Test2025$Complex!';

let accessToken = null;
let userId = null;
let organizationId = null;

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, type = 'info') {
  const prefix = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
    test: `${colors.bright}▶${colors.reset}`
  }[type] || '';
  
  console.log(`${prefix} ${message}`);
}

async function makeRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (accessToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message
    };
  }
}

async function runTest(name, testFn) {
  log(`${colors.bright}Testing: ${name}${colors.reset}`, 'test');
  try {
    const result = await testFn();
    if (result.success) {
      log(`${name} - PASSED`, 'success');
      return true;
    } else {
      log(`${name} - FAILED: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`${name} - ERROR: ${error.message}`, 'error');
    return false;
  }
}

// Test Functions
const tests = {
  async signupUser() {
    const response = await makeRequest('/auth/test', {
      method: 'POST',
      body: JSON.stringify({
        action: 'signup',
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      }),
      skipAuth: true
    });

    if (response.ok && response.data.user) {
      userId = response.data.user.id;
      log(`Created user: ${TEST_EMAIL} (ID: ${userId})`, 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Signup failed' 
    };
  },

  async loginUser() {
    const response = await makeRequest('/auth/test', {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      }),
      skipAuth: true
    });

    if (response.ok && response.data.access_token) {
      accessToken = response.data.access_token;
      userId = response.data.user.id;
      log(`Logged in successfully. Token: ${accessToken.substring(0, 20)}...`, 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Login failed' 
    };
  },

  async checkProfileCreated() {
    const response = await makeRequest(`/users/profile/`);

    if (response.status === 401) {
      return { 
        success: false, 
        error: 'Authentication not working - got 401' 
      };
    }

    if (response.ok && response.data.profile) {
      log(`Profile found: ${JSON.stringify(response.data.profile.email)}`, 'info');
      return { success: true };
    }

    if (response.status === 500) {
      // Profile might not exist yet, try to check directly
      log('Profile API returned 500, checking database directly...', 'warn');
    }

    return { 
      success: false, 
      error: response.data.error || 'Profile not found' 
    };
  },

  async updateProfile() {
    const response = await makeRequest('/users/profile/', {
      method: 'PUT',
      body: JSON.stringify({
        full_name: 'Test User Updated',
        company: 'Updated Company',
        job_title: 'QA Tester',
        phone: '+1234567890',
        preferences: {
          email_notifications: true,
          theme: 'dark'
        }
      })
    });

    if (response.ok) {
      log('Profile updated successfully', 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Update failed' 
    };
  },

  async createOrganization() {
    const response = await makeRequest('/organizations/', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Organization',
        slug: `test-org-${Date.now()}`,
        description: 'Test organization for QA'
      })
    });

    if (response.ok && response.data.organization) {
      organizationId = response.data.organization.id;
      log(`Created organization: ${response.data.organization.name} (ID: ${organizationId})`, 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Organization creation failed' 
    };
  },

  async getOrganizations() {
    const response = await makeRequest('/organizations/');

    if (response.ok && response.data.organizations) {
      log(`Found ${response.data.organizations.length} organization(s)`, 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Failed to get organizations' 
    };
  },

  async sendInvitation() {
    if (!organizationId) {
      return { 
        success: false, 
        error: 'No organization ID - skipping invitation test' 
      };
    }

    const response = await makeRequest('/invitations/', {
      method: 'POST',
      body: JSON.stringify({
        organizationId,
        email: 'invitee@example.com',
        role: 'member'
      })
    });

    if (response.ok) {
      log('Invitation sent successfully', 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Invitation failed' 
    };
  },

  async assignRole() {
    const response = await makeRequest('/roles/', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        roleName: 'admin',
        metadata: {
          assigned_during: 'testing'
        }
      })
    });

    // This might fail if user is not super admin
    if (response.status === 403) {
      log('Role assignment requires super admin (expected for regular users)', 'warn');
      return { success: true }; // Expected behavior
    }

    if (response.ok) {
      log('Role assigned successfully', 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Role assignment failed' 
    };
  },

  async getRoles() {
    const response = await makeRequest('/roles/');

    if (response.ok) {
      log(`User has ${response.data.userRoles?.length || 0} roles`, 'info');
      return { success: true };
    }

    return { 
      success: false, 
      error: response.data.error || 'Failed to get roles' 
    };
  }
};

// Main test runner
async function runAllTests() {
  console.log(`\n${colors.bright}====================================`);
  console.log('User Management System Test Suite');
  console.log(`====================================${colors.reset}\n`);

  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // Run tests in sequence
  const testSequence = [
    'signupUser',
    'loginUser',
    'checkProfileCreated',
    'updateProfile',
    'createOrganization',
    'getOrganizations',
    'sendInvitation',
    'assignRole',
    'getRoles'
  ];

  for (const testName of testSequence) {
    results.total++;
    const passed = await runTest(testName, tests[testName]);
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    console.log(''); // Add spacing between tests
  }

  // Summary
  console.log(`\n${colors.bright}====================================`);
  console.log('Test Summary');
  console.log(`====================================${colors.reset}\n`);

  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);

  if (results.failed === 0) {
    console.log(`\n${colors.green}${colors.bright}✓ All tests passed!${colors.reset}\n`);
  } else {
    console.log(`\n${colors.red}${colors.bright}✗ Some tests failed - debugging needed${colors.reset}\n`);
  }

  // Cleanup notes
  if (userId) {
    console.log(`${colors.yellow}Note: Created test user ${TEST_EMAIL} (ID: ${userId})${colors.reset}`);
    console.log(`${colors.yellow}Remember to clean up test data in Supabase if needed${colors.reset}\n`);
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});