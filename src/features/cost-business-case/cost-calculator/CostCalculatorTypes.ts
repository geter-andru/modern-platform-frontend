/**
 * CostCalculatorTypes.ts
 *
 * Type definitions for Simplified Cost Calculator
 * Integrates with Business Case Builder via autoPopulationService
 */

// ============================================================================
// COST DATA INTERFACES
// ============================================================================

export interface CostData {
  delayedRevenue: number;        // Monthly cost of delayed revenue
  competitorAdvantage: number;   // Monthly cost of competitive disadvantage
  teamEfficiency: number;         // Monthly cost of team inefficiency
  marketOpportunity: number;      // Monthly cost of missed opportunities
}

export interface CustomerScalingData {
  currentARR: string;             // e.g., "$2M"
  targetARR: string;              // e.g., "$10M"
  growthStage: 'early' | 'rapid_scaling' | 'mature';
  industry?: string;
  companySize?: string;
}

export interface CostCalculatorResults {
  id: string;                     // Unique calculation ID
  userId: string;                 // User who created the calculation
  customerId?: string;            // Optional customer association
  costData: CostData;             // Monthly cost breakdown
  timeframe: number;              // Months (3, 6, 12, 18)
  totalCost: number;              // Total cost over timeframe
  savingsOpportunity: number;     // Potential savings (75% of total cost)
  customerData: CustomerScalingData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostFactor {
  title: string;
  value: number;
  color: 'red' | 'orange' | 'purple' | 'blue' | 'green';
  description: string;
  percentage?: number;            // Percentage of total monthly cost
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface SimplifiedCostCalculatorProps {
  customerId?: string;
  customerData?: CustomerScalingData;
  onCalculationComplete?: (results: CostCalculatorResults) => void;
  onSave?: (results: CostCalculatorResults) => void;
}

// ============================================================================
// API INTERFACES
// ============================================================================

export interface SaveCostCalculationPayload {
  userId: string;
  customerId?: string;
  costData: CostData;
  timeframe: number;
  totalCost: number;
  savingsOpportunity: number;
  customerData: CustomerScalingData;
}

export interface CostCalculationResponse {
  success: boolean;
  data?: CostCalculatorResults;
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_COST_DATA: CostData = {
  delayedRevenue: 45000,
  competitorAdvantage: 23000,
  teamEfficiency: 12000,
  marketOpportunity: 38000
};

export const DEFAULT_CUSTOMER_DATA: CustomerScalingData = {
  currentARR: '$2M',
  targetARR: '$10M',
  growthStage: 'rapid_scaling'
};

export const TIMEFRAME_OPTIONS = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '12 months' },
  { value: 18, label: '18 months' }
] as const;

export const COST_FACTOR_CONFIGS: Omit<CostFactor, 'value' | 'percentage'>[] = [
  {
    title: 'Delayed Revenue',
    color: 'red',
    description: 'Revenue lost due to slow decision making'
  },
  {
    title: 'Competitive Disadvantage',
    color: 'orange',
    description: 'Market share lost to competitors'
  },
  {
    title: 'Team Inefficiency',
    color: 'orange',
    description: 'Productivity costs of manual processes'
  },
  {
    title: 'Missed Opportunities',
    color: 'purple',
    description: 'Potential deals not pursued'
  }
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function calculateTotalCost(costData: CostData, timeframe: number): number {
  const monthlyCost = Object.values(costData).reduce((sum, cost) => sum + cost, 0);
  return monthlyCost * timeframe;
}

export function calculateSavingsOpportunity(totalCost: number): number {
  return Math.round(totalCost * 0.75); // 75% of total cost as potential savings
}

export function calculateCostPercentages(costData: CostData): Record<keyof CostData, number> {
  const totalMonthlyCost = Object.values(costData).reduce((sum, cost) => sum + cost, 0);

  return {
    delayedRevenue: (costData.delayedRevenue / totalMonthlyCost) * 100,
    competitorAdvantage: (costData.competitorAdvantage / totalMonthlyCost) * 100,
    teamEfficiency: (costData.teamEfficiency / totalMonthlyCost) * 100,
    marketOpportunity: (costData.marketOpportunity / totalMonthlyCost) * 100
  };
}

export function formatCostDisplay(cost: number): string {
  return `$${(cost / 1000).toFixed(0)}K`;
}

export default {
  DEFAULT_COST_DATA,
  DEFAULT_CUSTOMER_DATA,
  TIMEFRAME_OPTIONS,
  COST_FACTOR_CONFIGS,
  calculateTotalCost,
  calculateSavingsOpportunity,
  calculateCostPercentages,
  formatCostDisplay
};
