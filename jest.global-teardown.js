/**
 * Jest Global Teardown
 * 
 * Runs once after all tests. Used for cleaning up test databases,
 * external services, or other global test infrastructure.
 */

module.exports = async () => {
  console.log('🧹 Cleaning up global test environment...');
  
  // Clean up test database or external services if needed
  // This is where you would tear down test databases, mock services, etc.
  
  console.log('✅ Global test environment cleanup complete');
};
