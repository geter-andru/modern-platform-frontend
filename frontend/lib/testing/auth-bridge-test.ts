/**
 * Authentication Bridge Test
 * 
 * Tests the Supabase → Express backend authentication flow.
 * This script validates that the auth bridge service works correctly.
 * 
 * FUNCTIONALITY STATUS: REAL
 * - Real Supabase authentication testing
 * - Real backend API communication testing
 * - Real error handling validation
 * - Production-ready test suite
 */

import { authBridge } from '@/app/lib/services/auth-bridge';
import { modernApiClient } from '@/lib/api/modern-client';

export interface TestResult {
  testName: string;
  success: boolean;
  error?: string;
  details?: any;
  duration: number;
}

export class AuthBridgeTester {
  private results: TestResult[] = [];

  /**
   * Run a single test and record results
   */
  private async runTest(
    testName: string,
    testFunction: () => Promise<any>
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Running test: ${testName}`);
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        testName,
        success: true,
        details: result,
        duration
      };
      
      this.results.push(testResult);
      console.log(`✅ Test passed: ${testName} (${duration}ms)`);
      return testResult;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        testName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
      
      this.results.push(testResult);
      console.log(`❌ Test failed: ${testName} (${duration}ms) - ${testResult.error}`);
      return testResult;
    }
  }

  /**
   * Test 1: Check if user is authenticated
   */
  private async testAuthenticationStatus(): Promise<boolean> {
    const isAuth = await authBridge.isAuthenticated();
    if (!isAuth) {
      throw new Error('User is not authenticated - please log in first');
    }
    return isAuth;
  }

  /**
   * Test 2: Get current user information
   */
  private async testGetCurrentUser(): Promise<any> {
    const user = await authBridge.getCurrentUser();
    if (!user) {
      throw new Error('Could not get current user information');
    }
    return user;
  }

  /**
   * Test 3: Get authentication headers
   */
  private async testGetAuthHeaders(): Promise<any> {
    const headers = await authBridge.getAuthHeaders();
    if (!headers.Authorization || !headers.Authorization.startsWith('Bearer ')) {
      throw new Error('Invalid authentication headers');
    }
    return headers;
  }

  /**
   * Test 4: Test backend health check
   */
  private async testBackendHealthCheck(): Promise<any> {
    const response = await modernApiClient.checkHealth();
    if (!response.success) {
      throw new Error(`Health check failed: ${response.error}`);
    }
    return response;
  }

  /**
   * Test 5: Test authenticated backend request
   */
  private async testAuthenticatedBackendRequest(): Promise<any> {
    // Try to get user's own data (this should work if auth is working)
    const user = await authBridge.getCurrentUser();
    if (!user?.id) {
      throw new Error('No user ID available for testing');
    }

    // Test a simple authenticated request
    const response = await authBridge.get('/api/docs');
    if (!response.success) {
      throw new Error(`Authenticated request failed: ${response.error}`);
    }
    return response;
  }

  /**
   * Test 6: Test error handling
   */
  private async testErrorHandling(): Promise<any> {
    // Try to access a non-existent endpoint
    const response = await authBridge.get('/api/non-existent-endpoint');
    
    // This should fail gracefully, not throw an error
    if (response.success) {
      throw new Error('Expected request to fail, but it succeeded');
    }
    
    return response;
  }

  /**
   * Run all authentication bridge tests
   */
  async runAllTests(): Promise<TestResult[]> {
    console.log('🚀 Starting Authentication Bridge Tests...\n');

    // Test 1: Authentication Status
    await this.runTest('Authentication Status', () => this.testAuthenticationStatus());

    // Test 2: Get Current User
    await this.runTest('Get Current User', () => this.testGetCurrentUser());

    // Test 3: Get Auth Headers
    await this.runTest('Get Auth Headers', () => this.testGetAuthHeaders());

    // Test 4: Backend Health Check
    await this.runTest('Backend Health Check', () => this.testBackendHealthCheck());

    // Test 5: Authenticated Backend Request
    await this.runTest('Authenticated Backend Request', () => this.testAuthenticatedBackendRequest());

    // Test 6: Error Handling
    await this.runTest('Error Handling', () => this.testErrorHandling());

    // Print summary
    this.printSummary();

    return this.results;
  }

  /**
   * Print test summary
   */
  private printSummary(): void {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`📈 Success Rate: ${Math.round((passed / this.results.length) * 100)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`   - ${r.testName}: ${r.error}`));
    }
    
    console.log('\n🎯 Authentication Bridge Test Complete!');
  }

  /**
   * Get test results
   */
  getResults(): TestResult[] {
    return this.results;
  }

  /**
   * Check if all tests passed
   */
  allTestsPassed(): boolean {
    return this.results.every(r => r.success);
  }
}

/**
 * Convenience function to run all tests
 */
export async function runAuthBridgeTests(): Promise<TestResult[]> {
  const tester = new AuthBridgeTester();
  return await tester.runAllTests();
}

/**
 * Quick test function for development
 */
export async function quickAuthTest(): Promise<boolean> {
  try {
    console.log('🔍 Quick Authentication Test...');
    
    // Check if authenticated
    const isAuth = await authBridge.isAuthenticated();
    if (!isAuth) {
      console.log('❌ User not authenticated');
      return false;
    }
    
    // Get user
    const user = await authBridge.getCurrentUser();
    if (!user) {
      console.log('❌ Could not get user');
      return false;
    }
    
    // Test backend connection
    const health = await modernApiClient.checkHealth();
    if (!health.success) {
      console.log('❌ Backend health check failed');
      return false;
    }
    
    console.log('✅ Quick authentication test passed!');
    console.log(`   User: ${user.email}`);
    console.log(`   Backend: ${health.success ? 'Connected' : 'Failed'}`);
    
    return true;
  } catch (error) {
    console.log('❌ Quick authentication test failed:', error);
    return false;
  }
}

export default AuthBridgeTester;
