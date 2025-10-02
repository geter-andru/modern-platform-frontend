/**
 * Jest Results Processor
 * 
 * Processes test results for custom reporting and analysis.
 */

module.exports = (results) => {
  // Process test results here
  // This is where you could add custom reporting, notifications, etc.
  
  const { numTotalTests, numPassedTests, numFailedTests, numPendingTests } = results;
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Total Tests: ${numTotalTests}`);
  console.log(`✅ Passed: ${numPassedTests}`);
  console.log(`❌ Failed: ${numFailedTests}`);
  console.log(`⏸️  Pending: ${numPendingTests}`);
  
  if (numFailedTests > 0) {
    console.log('\n❌ Some tests failed. Please review the output above.');
  } else {
    console.log('\n🎉 All tests passed!');
  }
  
  return results;
};
