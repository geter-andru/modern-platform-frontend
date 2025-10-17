// Auto-Population Service Test Runner
// Tests the auto-population logic with mock ICP and Cost Calculator data

import {
  autoPopulateBusinessCase,
  calculateCompletionPercentage,
  calculateConfidence,
  type AutoPopulationInput
} from '../services/autoPopulationService';

import { AutoPopulationSource } from '../BusinessCaseTypes';

import {
  mockICPData,
  mockCostCalculatorResults,
  mockUserContext,
  expectedAutoPopulationResults,
  expectedConfidenceScores
} from './mockData';

// import { BusinessCaseTypes } from "../types/BusinessCaseTypes"; // TODO: Create types file

// ============================================================================
// TEST UTILITIES
// ============================================================================

interface TestResult {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  message?: string;
}

const testResults: TestResult[] = [];

function assertEquals(testName: string, expected: any, actual: any, message?: string): void {
  const passed = JSON.stringify(expected) === JSON.stringify(actual);
  testResults.push({
    testName,
    passed,
    expected,
    actual,
    message: message || (passed ? 'Pass' : 'Values do not match')
  });
}

function assertExists(testName: string, value: any, message?: string): void {
  const passed = value !== null && value !== undefined && value !== '';
  testResults.push({
    testName,
    passed,
    expected: 'truthy value',
    actual: value,
    message: message || (passed ? 'Pass' : 'Value is null/undefined/empty')
  });
}

function assertInRange(testName: string, value: number, min: number, max: number, message?: string): void {
  const passed = value >= min && value <= max;
  testResults.push({
    testName,
    passed,
    expected: `${min} - ${max}`,
    actual: value,
    message: message || (passed ? 'Pass' : 'Value out of range')
  });
}

// ============================================================================
// TEST SUITE
// ============================================================================

async function runAutoPopulationTests(): Promise<void> {
  console.log('\n🧪 AUTO-POPULATION SERVICE TEST SUITE\n');
  console.log('=' .repeat(80));
  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 1: Confidence Score Calculation
  // -------------------------------------------------------------------------
  console.log('📊 TEST 1: Confidence Score Calculation\n');

  const costCalcConfidence = calculateConfidence(AutoPopulationSource.COST_CALCULATOR, true, 'high');
  assertEquals('Cost Calculator confidence (high quality)', 0.95, costCalcConfidence);

  const icpConfidence = calculateConfidence(AutoPopulationSource.ICP, true, 'high');
  assertEquals('ICP confidence (high quality)', 0.85, icpConfidence);

  const userProvidedConfidence = calculateConfidence(AutoPopulationSource.USER_PROVIDED, true, 'high');
  assertEquals('User-provided confidence', 1.0, userProvidedConfidence);

  const aiGeneratedConfidence = calculateConfidence(AutoPopulationSource.AI_GENERATED, true, 'high');
  assertEquals('AI-generated confidence', 0.75, aiGeneratedConfidence);

  const mediumQualityConfidence = calculateConfidence(AutoPopulationSource.ICP, true, 'medium');
  assertInRange('Medium quality ICP confidence', mediumQualityConfidence, 0.6, 0.75);

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 2: Full Auto-Population
  // -------------------------------------------------------------------------
  console.log('🔄 TEST 2: Full Auto-Population with Mock Data\n');

  const autoPopInput: AutoPopulationInput = {
    icpData: mockICPData,
    costCalculatorResults: mockCostCalculatorResults,
    userContext: mockUserContext
  };

  const populatedCase = await autoPopulateBusinessCase(autoPopInput);

  console.log('Auto-population completed. Validating results...\n');

  // -------------------------------------------------------------------------
  // TEST 3: Header Field Mapping
  // -------------------------------------------------------------------------
  console.log('📋 TEST 3: Header Field Mapping\n');

  assertEquals(
    'Company name from ICP',
    expectedAutoPopulationResults.header.companyName,
    populatedCase.header.companyName
  );

  assertEquals(
    'Champion name from user context',
    expectedAutoPopulationResults.header.championName,
    populatedCase.header.championName
  );

  assertEquals(
    'Champion title from user context',
    expectedAutoPopulationResults.header.championTitle,
    populatedCase.header.championTitle
  );

  assertEquals(
    'Partner name from user context',
    expectedAutoPopulationResults.header.partnerName,
    populatedCase.header.partnerName
  );

  assertEquals(
    'Partner company from user context',
    expectedAutoPopulationResults.header.partnerCompany,
    populatedCase.header.partnerCompany
  );

  assertExists('Priority headline generated', populatedCase.header.priorityHeadline);

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 4: Executive Summary Field Mapping
  // -------------------------------------------------------------------------
  console.log('📝 TEST 4: Executive Summary Field Mapping\n');

  assertEquals(
    'Business change from ICP pain point',
    expectedAutoPopulationResults.executiveSummary.businessChange,
    populatedCase.executiveSummary.businessChange
  );

  assertEquals(
    'Recommended solution from user context',
    expectedAutoPopulationResults.executiveSummary.recommendedSolution,
    populatedCase.executiveSummary.recommendedSolution
  );

  assertEquals(
    'Implementation timeline from user context',
    expectedAutoPopulationResults.executiveSummary.implementationTimeline,
    populatedCase.executiveSummary.implementationTimeline
  );

  assertEquals(
    'Current cost pain from cost calculator',
    expectedAutoPopulationResults.executiveSummary.currentCostPain,
    populatedCase.executiveSummary.currentCostPain
  );

  assertEquals(
    'Executive goal from ICP',
    expectedAutoPopulationResults.executiveSummary.executiveGoal,
    populatedCase.executiveSummary.executiveGoal
  );

  assertExists('Full executive summary generated', populatedCase.executiveSummary.fullSummary);

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 5: Business Challenge Field Mapping
  // -------------------------------------------------------------------------
  console.log('💼 TEST 5: Business Challenge Field Mapping\n');

  assertEquals(
    'Current reality from ICP pain point',
    expectedAutoPopulationResults.businessChallenge.currentRealityDescription,
    populatedCase.businessChallenge.currentRealityDescription
  );

  assertEquals(
    'Frequency from cost calculator',
    expectedAutoPopulationResults.businessChallenge.frequency,
    populatedCase.businessChallenge.frequency
  );

  assertInRange(
    'Affected count parsed from company size',
    populatedCase.businessChallenge.affectedCount || 0,
    40,
    60,
    'Should parse "50-100 employees" to ~50'
  );

  assertExists('Affected stakeholders from ICP', populatedCase.businessChallenge.affectedStakeholders);

  assertEquals(
    'Dollar cost from cost calculator',
    expectedAutoPopulationResults.businessChallenge.dollarCost,
    populatedCase.businessChallenge.dollarCost
  );

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 6: Business Impact & ROI Field Mapping
  // -------------------------------------------------------------------------
  console.log('💰 TEST 6: Business Impact & ROI Field Mapping\n');

  assertEquals(
    'Vision from (pain point)',
    expectedAutoPopulationResults.businessImpactROI.visionFrom,
    populatedCase.businessImpactROI.visionFrom
  );

  assertEquals(
    'Vision to (goal)',
    expectedAutoPopulationResults.businessImpactROI.visionTo,
    populatedCase.businessImpactROI.visionTo
  );

  assertEquals(
    'Financial ROI calculated',
    expectedAutoPopulationResults.businessImpactROI.financialROI,
    populatedCase.businessImpactROI.financialROI
  );

  assertEquals(
    'Executive KPI - Impact Area',
    expectedAutoPopulationResults.businessImpactROI.executiveKPI.impactArea,
    populatedCase.businessImpactROI.executiveKPI.impactArea
  );

  assertEquals(
    'Executive KPI - Current State',
    expectedAutoPopulationResults.businessImpactROI.executiveKPI.currentState,
    populatedCase.businessImpactROI.executiveKPI.currentState
  );

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 7: Investment & Implementation Field Mapping
  // -------------------------------------------------------------------------
  console.log('💵 TEST 7: Investment & Implementation Field Mapping\n');

  assertEquals(
    'Total investment from user context',
    expectedAutoPopulationResults.investmentImplementation.totalInvestment,
    populatedCase.investmentImplementation.totalInvestment
  );

  assertEquals(
    'ROI ratio calculated',
    expectedAutoPopulationResults.investmentImplementation.roiRatio,
    populatedCase.investmentImplementation.roiRatio
  );

  assertEquals(
    'ROI timeframe calculated',
    expectedAutoPopulationResults.investmentImplementation.roiTimeframe,
    populatedCase.investmentImplementation.roiTimeframe
  );

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 8: Strategy & Next Steps Field Mapping
  // -------------------------------------------------------------------------
  console.log('🎯 TEST 8: Strategy & Next Steps Field Mapping\n');

  assertEquals(
    'Value alignment 1 from ICP',
    expectedAutoPopulationResults.strategyNextSteps.valueAlignment1,
    populatedCase.strategyNextSteps.valueAlignment1
  );

  assertEquals(
    'Value alignment 2 from ICP',
    expectedAutoPopulationResults.strategyNextSteps.valueAlignment2,
    populatedCase.strategyNextSteps.valueAlignment2
  );

  assertEquals(
    'Value alignment 3 from ICP',
    expectedAutoPopulationResults.strategyNextSteps.valueAlignment3,
    populatedCase.strategyNextSteps.valueAlignment3
  );

  assertEquals(
    'Alternatives considered from user context',
    expectedAutoPopulationResults.strategyNextSteps.alternativesConsidered,
    populatedCase.strategyNextSteps.alternativesConsidered
  );

  assertEquals(
    'Unique deliverable from user context',
    expectedAutoPopulationResults.strategyNextSteps.uniqueDeliverable,
    populatedCase.strategyNextSteps.uniqueDeliverable
  );

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 9: Approach Differentiation Field Mapping
  // -------------------------------------------------------------------------
  console.log('🔍 TEST 9: Approach Differentiation Field Mapping\n');

  assertEquals(
    'Discovery stakeholders from ICP',
    expectedAutoPopulationResults.approachDifferentiation.discoveryStakeholders,
    populatedCase.approachDifferentiation.discoveryStakeholders
  );

  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST 10: Completion Percentage Calculation
  // -------------------------------------------------------------------------
  console.log('📊 TEST 10: Completion Percentage Calculation\n');

  const completionPercentage = calculateCompletionPercentage(populatedCase);

  assertInRange(
    'Completion percentage after auto-population',
    completionPercentage,
    60,
    100,
    'Should be 60%+ after full auto-population'
  );

  console.log(`Completion: ${completionPercentage}%\n`);
  console.log('\n');

  // -------------------------------------------------------------------------
  // TEST RESULTS SUMMARY
  // -------------------------------------------------------------------------
  console.log('=' .repeat(80));
  console.log('\n📊 TEST RESULTS SUMMARY\n');
  console.log('=' .repeat(80));
  console.log('\n');

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);

  console.log(`✅ Passed: ${passedTests}/${totalTests} (${passRate}%)\n`);

  if (passedTests < totalTests) {
    console.log(`❌ Failed Tests:\n`);
    testResults
      .filter(r => !r.passed)
      .forEach(result => {
        console.log(`  • ${result.testName}`);
        console.log(`    Expected: ${JSON.stringify(result.expected)}`);
        console.log(`    Actual:   ${JSON.stringify(result.actual)}`);
        console.log(`    Message:  ${result.message}\n`);
      });
  } else {
    console.log('🎉 All tests passed!\n');
  }

  console.log('=' .repeat(80));
  console.log('\n✅ AUTO-POPULATION SERVICE TEST SUITE COMPLETE\n');

  // -------------------------------------------------------------------------
  // DETAILED AUTO-POPULATION RESULT LOG
  // -------------------------------------------------------------------------
  console.log('\n📋 DETAILED AUTO-POPULATION RESULTS:\n');
  console.log(JSON.stringify(populatedCase, null, 2));
  console.log('\n');
}

// ============================================================================
// RUN TESTS
// ============================================================================

runAutoPopulationTests()
  .then(() => {
    console.log('✅ Test suite execution completed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test suite execution failed:', error);
    process.exit(1);
  });
