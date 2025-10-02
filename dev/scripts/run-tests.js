#!/usr/bin/env node

/**
 * Comprehensive Test Runner
 * 
 * Runs all tests with proper configuration, coverage reporting,
 * and performance monitoring for the modern-platform application.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const testConfig = {
  // Test directories
  testDirs: [
    '__tests__/components',
    '__tests__/api',
    '__tests__/lib',
    '__tests__/integration',
  ],
  
  // Coverage thresholds
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Test timeouts
  timeouts: {
    unit: 10000,      // 10 seconds
    integration: 30000, // 30 seconds
    e2e: 60000,      // 60 seconds
  },
  
  // Performance thresholds
  performance: {
    maxResponseTime: 5000,  // 5 seconds
    maxMemoryUsage: 100,    // 100MB
  },
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Utility functions
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const logSection = (title) => {
  log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️  ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️  ${message}`, colors.blue);

// Test runner class
class TestRunner {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, total: 0 },
      integration: { passed: 0, failed: 0, total: 0 },
      e2e: { passed: 0, failed: 0, total: 0 },
      coverage: { percentage: 0, thresholds: {} },
      performance: { responseTime: 0, memoryUsage: 0 },
    };
    this.startTime = Date.now();
  }

  // Run all tests
  async runAllTests() {
    logSection('🧪 MODERN-PLATFORM TEST SUITE');
    logInfo('Starting comprehensive test execution...\n');

    try {
      // 1. Environment setup
      await this.setupTestEnvironment();
      
      // 2. Unit tests
      await this.runUnitTests();
      
      // 3. Integration tests
      await this.runIntegrationTests();
      
      // 4. Coverage analysis
      await this.analyzeCoverage();
      
      // 5. Performance tests
      await this.runPerformanceTests();
      
      // 6. Generate report
      await this.generateReport();
      
      // 7. Cleanup
      await this.cleanup();
      
      this.printSummary();
      
    } catch (error) {
      logError(`Test execution failed: ${error.message}`);
      process.exit(1);
    }
  }

  // Setup test environment
  async setupTestEnvironment() {
    logSection('🔧 Setting up test environment');
    
    try {
      // Check if Jest is installed
      if (!fs.existsSync('node_modules/.bin/jest')) {
        logError('Jest is not installed. Please run: npm install');
        process.exit(1);
      }
      
      // Create test directories if they don't exist
      testConfig.testDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          logInfo(`Created test directory: ${dir}`);
        }
      });
      
      // Set environment variables
      process.env.NODE_ENV = 'test';
      process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
      
      logSuccess('Test environment setup complete');
      
    } catch (error) {
      logError(`Environment setup failed: ${error.message}`);
      throw error;
    }
  }

  // Run unit tests
  async runUnitTests() {
    logSection('🧩 Running Unit Tests');
    
    try {
      const command = 'npx jest __tests__/components __tests__/lib --coverage --verbose';
      logInfo(`Executing: ${command}`);
      
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: testConfig.timeouts.unit,
      });
      
      // Parse Jest output
      const lines = output.split('\n');
      let passed = 0, failed = 0, total = 0;
      
      lines.forEach(line => {
        if (line.includes('Tests:')) {
          const match = line.match(/(\d+) passed|(\d+) failed|(\d+) total/);
          if (match) {
            if (match[1]) passed = parseInt(match[1]);
            if (match[2]) failed = parseInt(match[2]);
            if (match[3]) total = parseInt(match[3]);
          }
        }
      });
      
      this.results.unit = { passed, failed, total };
      
      if (failed === 0) {
        logSuccess(`Unit tests passed: ${passed}/${total}`);
      } else {
        logError(`Unit tests failed: ${failed}/${total}`);
        logWarning('Check the output above for details');
      }
      
    } catch (error) {
      logError(`Unit tests failed: ${error.message}`);
      this.results.unit.failed = 1;
    }
  }

  // Run integration tests
  async runIntegrationTests() {
    logSection('🔗 Running Integration Tests');
    
    try {
      const command = 'npx jest __tests__/api --coverage --verbose';
      logInfo(`Executing: ${command}`);
      
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: testConfig.timeouts.integration,
      });
      
      // Parse Jest output
      const lines = output.split('\n');
      let passed = 0, failed = 0, total = 0;
      
      lines.forEach(line => {
        if (line.includes('Tests:')) {
          const match = line.match(/(\d+) passed|(\d+) failed|(\d+) total/);
          if (match) {
            if (match[1]) passed = parseInt(match[1]);
            if (match[2]) failed = parseInt(match[2]);
            if (match[3]) total = parseInt(match[3]);
          }
        }
      });
      
      this.results.integration = { passed, failed, total };
      
      if (failed === 0) {
        logSuccess(`Integration tests passed: ${passed}/${total}`);
      } else {
        logError(`Integration tests failed: ${failed}/${total}`);
        logWarning('Check the output above for details');
      }
      
    } catch (error) {
      logError(`Integration tests failed: ${error.message}`);
      this.results.integration.failed = 1;
    }
  }

  // Analyze coverage
  async analyzeCoverage() {
    logSection('📊 Analyzing Test Coverage');
    
    try {
      // Check if coverage report exists
      if (!fs.existsSync('coverage/coverage-summary.json')) {
        logWarning('Coverage report not found. Running tests with coverage...');
        execSync('npx jest --coverage --silent', { stdio: 'pipe' });
      }
      
      if (fs.existsSync('coverage/coverage-summary.json')) {
        const coverageData = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
        const globalCoverage = coverageData.total;
        
        this.results.coverage = {
          percentage: globalCoverage.lines.pct,
          thresholds: testConfig.coverageThresholds.global,
          details: globalCoverage,
        };
        
        // Check if coverage meets thresholds
        const meetsThresholds = Object.entries(testConfig.coverageThresholds.global).every(
          ([metric, threshold]) => globalCoverage[metric].pct >= threshold
        );
        
        if (meetsThresholds) {
          logSuccess(`Coverage meets thresholds: ${globalCoverage.lines.pct}%`);
        } else {
          logWarning(`Coverage below thresholds: ${globalCoverage.lines.pct}%`);
          Object.entries(testConfig.coverageThresholds.global).forEach(([metric, threshold]) => {
            if (globalCoverage[metric].pct < threshold) {
              logWarning(`${metric}: ${globalCoverage[metric].pct}% < ${threshold}%`);
            }
          });
        }
      } else {
        logWarning('Could not generate coverage report');
      }
      
    } catch (error) {
      logError(`Coverage analysis failed: ${error.message}`);
    }
  }

  // Run performance tests
  async runPerformanceTests() {
    logSection('⚡ Running Performance Tests');
    
    try {
      // Simple performance test - measure test execution time
      const testStartTime = Date.now();
      
      // Run a subset of tests to measure performance
      execSync('npx jest __tests__/components/ModernCard.test.tsx --silent', { 
        stdio: 'pipe',
        timeout: testConfig.timeouts.unit,
      });
      
      const testEndTime = Date.now();
      const responseTime = testEndTime - testStartTime;
      
      this.results.performance = {
        responseTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      };
      
      if (responseTime <= testConfig.performance.maxResponseTime) {
        logSuccess(`Performance test passed: ${responseTime}ms`);
      } else {
        logWarning(`Performance test slow: ${responseTime}ms > ${testConfig.performance.maxResponseTime}ms`);
      }
      
      if (this.results.performance.memoryUsage <= testConfig.performance.maxMemoryUsage) {
        logSuccess(`Memory usage acceptable: ${this.results.performance.memoryUsage.toFixed(2)}MB`);
      } else {
        logWarning(`Memory usage high: ${this.results.performance.memoryUsage.toFixed(2)}MB > ${testConfig.performance.maxMemoryUsage}MB`);
      }
      
    } catch (error) {
      logError(`Performance tests failed: ${error.message}`);
    }
  }

  // Generate test report
  async generateReport() {
    logSection('📋 Generating Test Report');
    
    try {
      const report = {
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.startTime,
        results: this.results,
        summary: {
          totalTests: this.results.unit.total + this.results.integration.total,
          passedTests: this.results.unit.passed + this.results.integration.passed,
          failedTests: this.results.unit.failed + this.results.integration.failed,
          coveragePercentage: this.results.coverage.percentage,
          performanceScore: this.calculatePerformanceScore(),
        },
      };
      
      // Save report to file
      const reportPath = 'test-results.json';
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      logSuccess(`Test report saved to: ${reportPath}`);
      
    } catch (error) {
      logError(`Report generation failed: ${error.message}`);
    }
  }

  // Calculate performance score
  calculatePerformanceScore() {
    const responseTimeScore = Math.max(0, 100 - (this.results.performance.responseTime / 50));
    const memoryScore = Math.max(0, 100 - (this.results.performance.memoryUsage / 2));
    return Math.round((responseTimeScore + memoryScore) / 2);
  }

  // Cleanup
  async cleanup() {
    logSection('🧹 Cleaning up');
    
    try {
      // Clean up temporary files
      if (fs.existsSync('test-results.json')) {
        // Keep the report file
        logInfo('Test report preserved');
      }
      
      logSuccess('Cleanup complete');
      
    } catch (error) {
      logWarning(`Cleanup warning: ${error.message}`);
    }
  }

  // Print summary
  printSummary() {
    logSection('📊 TEST SUMMARY');
    
    const totalTests = this.results.unit.total + this.results.integration.total;
    const passedTests = this.results.unit.passed + this.results.integration.passed;
    const failedTests = this.results.unit.failed + this.results.integration.failed;
    
    logInfo(`Total Tests: ${totalTests}`);
    logSuccess(`Passed: ${passedTests}`);
    if (failedTests > 0) {
      logError(`Failed: ${failedTests}`);
    } else {
      logSuccess(`Failed: ${failedTests}`);
    }
    
    logInfo(`Coverage: ${this.results.coverage.percentage}%`);
    logInfo(`Performance Score: ${this.calculatePerformanceScore()}/100`);
    logInfo(`Duration: ${((Date.now() - this.startTime) / 1000).toFixed(2)}s`);
    
    if (failedTests === 0 && this.results.coverage.percentage >= 70) {
      logSuccess('\n🎉 All tests passed! The application is ready for production.');
    } else {
      logWarning('\n⚠️  Some tests failed or coverage is below threshold. Please review and fix issues.');
    }
  }
}

// Main execution
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = TestRunner;
