/**
 * Jest Global Setup
 * 
 * Runs once before all tests. Used for setting up test databases,
 * external services, or other global test infrastructure.
 */

module.exports = async () => {
  console.log('🚀 Setting up global test environment...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  
  // Initialize test database or external services if needed
  // This is where you would set up test databases, mock services, etc.
  
  console.log('✅ Global test environment setup complete');
};
