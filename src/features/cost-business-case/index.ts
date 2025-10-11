// Cost-Business-Case Feature - Barrel Exports
// Preserves all original functionality and dependencies

// Cost Calculator Components - MVP: Use named exports
export { CostCalculatorForm } from './cost-calculator/CostCalculatorForm';
export { CostHistory } from './cost-calculator/CostHistory';
export { CostResults } from './cost-calculator/CostResults';
export { default as SimplifiedCostCalculator } from './cost-calculator/SimplifiedCostCalculator';

// Business Case Components - MVP: Use named exports
export { default as SimplifiedBusinessCaseBuilder } from './business-case/SimplifiedBusinessCaseBuilder';

// Re-export types if any are defined in the components
export type * from './cost-calculator/CostCalculatorForm';
export type * from './cost-calculator/CostResults';
export type * from './business-case/SimplifiedBusinessCaseBuilder';