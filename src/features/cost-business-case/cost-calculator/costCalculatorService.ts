/**
 * costCalculatorService.ts
 *
 * Supabase service for Cost Calculator persistence
 * Integrates with Business Case Builder auto-population
 */

// Import singleton Supabase client (DO NOT create new instances - causes session conflicts)
import { supabase } from '@/app/lib/supabase/client';
import type {
  CostCalculatorResults,
  SaveCostCalculationPayload,
  CostCalculationResponse
} from './CostCalculatorTypes';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse ARR string to numeric value
 * Examples: "$2M" -> 2000000, "$500K" -> 500000
 */
function parseARR(arr: string): number {
  const numStr = arr.replace(/[$,]/g, '').toUpperCase();
  if (numStr.endsWith('M')) {
    return parseFloat(numStr) * 1000000;
  } else if (numStr.endsWith('K')) {
    return parseFloat(numStr) * 1000;
  }
  return parseFloat(numStr) || 0;
}

// ============================================================================
// COST CALCULATION CRUD OPERATIONS
// ============================================================================

/**
 * Save a new cost calculation
 */
export async function saveCostCalculation(
  payload: SaveCostCalculationPayload
): Promise<CostCalculationResponse> {
  try {
    // Transform payload to match database schema
    const currentRevenue = parseARR(payload.customerData.currentARR);
    const targetRevenue = parseARR(payload.customerData.targetARR);

    // Calculate derived metrics
    const monthlyCost = payload.totalCost / payload.timeframe;
    const averageDealSize = currentRevenue > 0 ? currentRevenue / 12 : 50000; // Default to 50K if unknown
    const conversionRate = 20.0; // Default 20% conversion rate

    const { data, error } = await supabase
      .from('cost_calculations')
      .insert({
        user_id: payload.userId,
        current_revenue: currentRevenue,
        average_deal_size: averageDealSize,
        conversion_rate: conversionRate,
        total_cost: payload.totalCost,
        calculation: {
          // Store the simplified cost data in the calculation JSONB field
          costData: payload.costData,
          timeframe: payload.timeframe,
          savingsOpportunity: payload.savingsOpportunity,
          monthlyCost,
          // Also include target for tracking
          targetRevenue,
          growthStage: payload.customerData.growthStage
        },
        insights: {
          // Store customer context in insights JSONB field
          customerData: payload.customerData,
          customerId: payload.customerId
        },
        calculation_method: 'systematic_analysis',
        status: 'completed'
      } as any) // Type assertion - Database types are correct but TS inference has issues
      .select()
      .single();

    if (error) {
      console.error('Error saving cost calculation:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: transformSupabaseToResults(data)
    };
  } catch (error) {
    console.error('Unexpected error saving cost calculation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch a cost calculation by ID
 */
export async function fetchCostCalculation(
  calculationId: string
): Promise<CostCalculatorResults | null> {
  try {
    const { data, error } = await supabase
      .from('cost_calculations')
      .select('*')
      .eq('id', calculationId)
      .single();

    if (error) {
      console.error('Error fetching cost calculation:', error);
      return null;
    }

    return transformSupabaseToResults(data);
  } catch (error) {
    console.error('Unexpected error fetching cost calculation:', error);
    return null;
  }
}

/**
 * Fetch all cost calculations for a user
 */
export async function fetchUserCostCalculations(
  userId: string,
  limit: number = 10
): Promise<CostCalculatorResults[]> {
  try {
    const { data, error } = await supabase
      .from('cost_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user cost calculations:', error);
      return [];
    }

    return data.map(transformSupabaseToResults);
  } catch (error) {
    console.error('Unexpected error fetching user cost calculations:', error);
    return [];
  }
}

/**
 * Fetch cost calculations for a customer
 */
export async function fetchCustomerCostCalculations(
  customerId: string
): Promise<CostCalculatorResults[]> {
  try {
    const { data, error} = await supabase
      .from('cost_calculations')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer cost calculations:', error);
      return [];
    }

    return data.map(transformSupabaseToResults);
  } catch (error) {
    console.error('Unexpected error fetching customer cost calculations:', error);
    return [];
  }
}

/**
 * Update an existing cost calculation
 */
export async function updateCostCalculation(
  calculationId: string,
  payload: Partial<SaveCostCalculationPayload>
): Promise<CostCalculationResponse> {
  try {
    // Build update object with proper field mapping
    const updateData: any = {};

    if (payload.userId) {
      updateData.user_id = payload.userId;
    }

    if (payload.customerData) {
      const currentRevenue = parseARR(payload.customerData.currentARR);
      updateData.current_revenue = currentRevenue;

      if (currentRevenue > 0) {
        updateData.average_deal_size = currentRevenue / 12;
      }
    }

    if (payload.totalCost !== undefined) {
      updateData.total_cost = payload.totalCost;
    }

    // Update calculation JSONB if any of these fields are provided
    if (payload.costData || payload.timeframe || payload.savingsOpportunity) {
      // Fetch existing record to merge with new data
      const { data: existingData } = await supabase
        .from('cost_calculations')
        .select('calculation')
        .eq('id', calculationId)
        .single() as any; // Type assertion for TS inference issue

      const existingCalculation = existingData?.calculation || {};

      updateData.calculation = {
        ...existingCalculation,
        ...(payload.costData && { costData: payload.costData }),
        ...(payload.timeframe && { timeframe: payload.timeframe }),
        ...(payload.savingsOpportunity && { savingsOpportunity: payload.savingsOpportunity }),
        ...(payload.totalCost && payload.timeframe && { monthlyCost: payload.totalCost / payload.timeframe })
      };
    }

    // Update insights JSONB if customerData provided
    if (payload.customerData || payload.customerId) {
      const { data: existingData } = await supabase
        .from('cost_calculations')
        .select('insights')
        .eq('id', calculationId)
        .single() as any; // Type assertion for TS inference issue

      const existingInsights = existingData?.insights || {};

      updateData.insights = {
        ...existingInsights,
        ...(payload.customerData && { customerData: payload.customerData }),
        ...(payload.customerId && { customerId: payload.customerId })
      };
    }

    const { data, error } = await (supabase
      .from('cost_calculations') as any)
      .update(updateData) // Type assertion on from() to fix TS inference issue
      .eq('id', calculationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating cost calculation:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: transformSupabaseToResults(data)
    };
  } catch (error) {
    console.error('Unexpected error updating cost calculation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Delete a cost calculation
 */
export async function deleteCostCalculation(
  calculationId: string
): Promise<CostCalculationResponse> {
  try {
    const { error } = await supabase
      .from('cost_calculations')
      .delete()
      .eq('id', calculationId);

    if (error) {
      console.error('Error deleting cost calculation:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Unexpected error deleting cost calculation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Transform Supabase row to CostCalculatorResults
 */
function transformSupabaseToResults(data: any): CostCalculatorResults {
  // Extract data from JSONB fields
  const calculation = data.calculation || {};
  const insights = data.insights || {};

  return {
    id: data.id,
    userId: data.user_id,
    customerId: insights.customerId,
    costData: calculation.costData || {
      delayedRevenue: 0,
      competitorAdvantage: 0,
      teamEfficiency: 0,
      marketOpportunity: 0
    },
    timeframe: calculation.timeframe || 12,
    totalCost: data.total_cost,
    savingsOpportunity: calculation.savingsOpportunity || 0,
    customerData: insights.customerData || {
      currentARR: '$0',
      targetARR: '$0',
      growthStage: 'early' as const
    },
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

/**
 * Get the most recent cost calculation for a customer
 * Used by Business Case Builder auto-population
 */
export async function getLatestCostCalculation(
  customerId: string
): Promise<CostCalculatorResults | null> {
  const calculations = await fetchCustomerCostCalculations(customerId);
  return calculations.length > 0 ? calculations[0] : null;
}

export default {
  saveCostCalculation,
  fetchCostCalculation,
  fetchUserCostCalculations,
  fetchCustomerCostCalculations,
  updateCostCalculation,
  deleteCostCalculation,
  getLatestCostCalculation
};
