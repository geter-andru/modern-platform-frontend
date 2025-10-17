/**
 * costCalculatorService.ts
 *
 * Supabase service for Cost Calculator persistence
 * Integrates with Business Case Builder auto-population
 */

import { createClient } from '@supabase/supabase-js';
import type {
  CostCalculatorResults,
  SaveCostCalculationPayload,
  CostCalculationResponse
} from './CostCalculatorTypes';

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data, error } = await supabase
      .from('cost_calculations')
      .insert({
        user_id: payload.userId,
        customer_id: payload.customerId,
        cost_data: payload.costData,
        timeframe: payload.timeframe,
        total_cost: payload.totalCost,
        savings_opportunity: payload.savingsOpportunity,
        customer_data: payload.customerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
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
    const { data, error } = await supabase
      .from('cost_calculations')
      .update({
        ...payload,
        updated_at: new Date().toISOString()
      })
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
  return {
    id: data.id,
    userId: data.user_id,
    customerId: data.customer_id,
    costData: data.cost_data,
    timeframe: data.timeframe,
    totalCost: data.total_cost,
    savingsOpportunity: data.savings_opportunity,
    customerData: data.customer_data,
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
