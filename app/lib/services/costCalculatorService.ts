import { backendService } from './backendService';

interface CostCalculationInput {
  currentRevenue: number;
  averageDealSize: number;
  conversionRate: number;
  salesCycleLength?: number;
  customerLifetimeValue?: number;
  churnRate?: number;
  marketSize?: number;
  competitivePressure?: number;
  [key: string]: string | number | boolean | undefined;
}

interface CostCalculationResult {
  currentRevenue: number;
  averageDealSize: number;
  conversionRate: number;
  calculation: {
    lostRevenue: number;
    inefficiencyLoss: number;
    opportunityCost: number;
    competitiveDisadvantage: number;
    totalAnnualCost: number;
    monthlyCost: number;
    dailyCost: number;
    costPerLead: number;
    costPerOpportunity: number;
    roiProjection: number;
    paybackPeriod: string;
  };
  insights: {
    primaryDrivers: string[];
    recommendations: string[];
    riskFactors: string[];
    opportunityAreas: string[];
  };
  totalCost: number;
  generatedAt: string;
  metadata: {
    calculationMethod: string;
    confidence: number;
    processingTime: number;
  };
}

interface CostComparisonResult {
  scenarios: Array<{
    name: string;
    input: CostCalculationInput;
    result: CostCalculationResult;
  }>;
  comparison: {
    bestScenario: string;
    worstScenario: string;
    savingsPotential: number;
    recommendations: string[];
  };
  generatedAt: string;
}

class CostCalculatorService {
  
  async calculateCost(
    input: CostCalculationInput
  ): Promise<{ success: boolean; data?: CostCalculationResult; error?: string }> {
    try {
      console.log('💰 Calculating cost of inaction');

      // Validate input data
      const validation = this.validateInput(input);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Call backend calculation API
      const response = await backendService.calculateCost(input);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to calculate cost'
        };
      }

      console.log('✅ Cost calculation completed successfully');
      return {
        success: true,
        data: {
          ...(response.data as any),
          insights: {
            primaryDrivers: ['Revenue inefficiency', 'Conversion optimization'],
            recommendations: ['Implement systematic sales process', 'Optimize lead qualification'],
            riskFactors: ['Market competition', 'Customer churn'],
            opportunityAreas: ['Sales automation', 'Customer retention']
          },
          metadata: {
            calculationMethod: 'systematic_analysis',
            confidence: 0.85,
            processingTime: Date.now()
          }
        } as CostCalculationResult
      };

    } catch (error: unknown) {
      console.error('❌ Cost calculation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async calculateCostWithAI(
    input: CostCalculationInput,
    customerId: string
  ): Promise<{ success: boolean; data?: CostCalculationResult; error?: string }> {
    try {
      console.log('🤖 Running AI-enhanced cost calculation');

      // Validate input data
      const validation = this.validateInput(input);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Call backend AI calculation API
      const response = await backendService.calculateCostWithAI(input);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to calculate cost with AI'
        };
      }

      // Track progress
      await backendService.trackProgress(customerId, 'cost_calculated_ai', {
        totalCost: response.data.totalCost,
        timestamp: new Date().toISOString()
      });

      console.log('✅ AI-enhanced cost calculation completed');
      return {
        success: true,
        data: {
          ...(response.data as any),
          insights: {
            primaryDrivers: ['AI-analyzed revenue inefficiency', 'Advanced conversion optimization'],
            recommendations: ['Implement AI-driven sales process', 'Optimize with machine learning'],
            riskFactors: ['AI model accuracy', 'Data quality'],
            opportunityAreas: ['Predictive analytics', 'Automated optimization']
          },
          metadata: {
            calculationMethod: 'ai_enhanced_analysis',
            confidence: 0.90,
            processingTime: Date.now()
          }
        } as CostCalculationResult
      };

    } catch (error: unknown) {
      console.error('❌ AI cost calculation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async saveCostCalculation(
    customerId: string,
    calculation: CostCalculationResult
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('💾 Saving cost calculation for customer:', customerId);

      const response = await backendService.saveCostCalculation(calculation);

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to save cost calculation'
        };
      }

      // Track progress
      await backendService.trackProgress(customerId, 'cost_calculation_saved', {
        totalCost: calculation.totalCost,
        timestamp: new Date().toISOString()
      });

      return { success: true };

    } catch (error: unknown) {
      console.error('❌ Failed to save cost calculation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getCostCalculationHistory(
    customerId: string
  ): Promise<{ success: boolean; data?: CostCalculationResult[]; error?: string }> {
    try {
      console.log('📊 Fetching cost calculation history for customer:', customerId);

      const response = await backendService.getCostCalculationHistory(customerId);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to fetch cost calculation history'
        };
      }

      return {
        success: true,
        data: (response.data as any).map((item: any) => ({
          ...item,
          insights: {
            primaryDrivers: ['Historical analysis'],
            recommendations: ['Review past calculations'],
            riskFactors: ['Data accuracy'],
            opportunityAreas: ['Trend analysis']
          },
          metadata: {
            calculationMethod: 'historical_data',
            confidence: 0.80,
            processingTime: Date.now()
          }
        }))
      };

    } catch (error: unknown) {
      console.error('❌ Failed to fetch cost calculation history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async compareCostScenarios(
    scenarios: Array<{ name: string; input: CostCalculationInput }>
  ): Promise<{ success: boolean; data?: CostComparisonResult; error?: string }> {
    try {
      console.log('📈 Comparing cost scenarios');

      if (scenarios.length < 2) {
        return {
          success: false,
          error: 'At least 2 scenarios are required for comparison'
        };
      }

      // Calculate each scenario
      const scenarioResults = await Promise.all(
        scenarios.map(async (scenario) => {
          const result = await this.calculateCost(scenario.input);
          return {
            name: scenario.name,
            input: scenario.input,
            result: result.data
          };
        })
      );

      // Check if all calculations were successful
      const failedScenarios = scenarioResults.filter(s => !s.result);
      if (failedScenarios.length > 0) {
        return {
          success: false,
          error: `Failed to calculate ${failedScenarios.length} scenarios`
        };
      }

      // Generate comparison analysis
      const comparison = this.generateComparison(scenarioResults);

      const comparisonResult: CostComparisonResult = {
        scenarios: scenarioResults as Array<{ name: string; input: CostCalculationInput; result: CostCalculationResult }>,
        comparison,
        generatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: comparisonResult
      };

    } catch (error: unknown) {
      console.error('❌ Failed to compare cost scenarios:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  validateInput(input: CostCalculationInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.currentRevenue || input.currentRevenue <= 0) {
      errors.push('Current revenue must be greater than 0');
    }

    if (!input.averageDealSize || input.averageDealSize <= 0) {
      errors.push('Average deal size must be greater than 0');
    }

    if (!input.conversionRate || input.conversionRate <= 0 || input.conversionRate > 100) {
      errors.push('Conversion rate must be between 0 and 100');
    }

    if (input.salesCycleLength && input.salesCycleLength <= 0) {
      errors.push('Sales cycle length must be greater than 0');
    }

    if (input.customerLifetimeValue && input.customerLifetimeValue <= 0) {
      errors.push('Customer lifetime value must be greater than 0');
    }

    if (input.churnRate && (input.churnRate < 0 || input.churnRate > 100)) {
      errors.push('Churn rate must be between 0 and 100');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private generateComparison(scenarios: Array<{ name: string; input: CostCalculationInput; result: CostCalculationResult | undefined }>): {
    bestScenario: string;
    worstScenario: string;
    savingsPotential: number;
    recommendations: string[];
  } {
    const validScenarios = scenarios.filter(s => s.result);
    
    if (validScenarios.length === 0) {
      return {
        bestScenario: '',
        worstScenario: '',
        savingsPotential: 0,
        recommendations: ['No valid scenarios to compare']
      };
    }

    // Sort by total cost (ascending - lower cost is better)
    const sortedScenarios = validScenarios.sort((a, b) => 
      (a.result?.totalCost || 0) - (b.result?.totalCost || 0)
    );

    const bestScenario = sortedScenarios[0];
    const worstScenario = sortedScenarios[sortedScenarios.length - 1];
    const savingsPotential = (worstScenario.result?.totalCost || 0) - (bestScenario.result?.totalCost || 0);

    const recommendations: string[] = [];
    
    if (savingsPotential > 0) {
      recommendations.push(`Implementing ${bestScenario.name} could save $${savingsPotential.toLocaleString()} annually`);
    }

    if (validScenarios.length > 2) {
      const middleScenarios = sortedScenarios.slice(1, -1);
      recommendations.push(`Consider ${middleScenarios.map(s => s.name).join(', ')} as alternative approaches`);
    }

    recommendations.push('Monitor key metrics regularly to validate assumptions');
    recommendations.push('Review and update calculations quarterly');

    return {
      bestScenario: bestScenario.name,
      worstScenario: worstScenario.name,
      savingsPotential,
      recommendations
    };
  }

  async exportCostCalculation(
    customerId: string,
    calculation: CostCalculationResult,
    format: 'pdf' | 'docx' | 'csv' = 'pdf'
  ): Promise<{ success: boolean; data?: { exportId: string; downloadUrl?: string }; error?: string }> {
    try {
      console.log('📤 Exporting cost calculation as:', format);

      const response = await backendService.exportCostCalculator({
        customerId,
        format,
        calculation,
        timestamp: new Date().toISOString()
      });

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to export cost calculation'
        };
      }

      // Track export action
      await backendService.trackProgress(customerId, 'cost_calculation_exported', {
        format,
        exportId: response.data.exportId,
        totalCost: calculation.totalCost,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };

    } catch (error: unknown) {
      console.error('❌ Failed to export cost calculation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  getCalculationTemplates(): Array<{ name: string; description: string; input: Partial<CostCalculationInput> }> {
    return [
      {
        name: 'SaaS Startup',
        description: 'Template for early-stage SaaS companies',
        input: {
          currentRevenue: 100000,
          averageDealSize: 5000,
          conversionRate: 15,
          salesCycleLength: 90,
          churnRate: 5
        }
      },
      {
        name: 'Enterprise B2B',
        description: 'Template for enterprise B2B companies',
        input: {
          currentRevenue: 1000000,
          averageDealSize: 50000,
          conversionRate: 25,
          salesCycleLength: 180,
          churnRate: 2
        }
      },
      {
        name: 'E-commerce',
        description: 'Template for e-commerce businesses',
        input: {
          currentRevenue: 500000,
          averageDealSize: 100,
          conversionRate: 3,
          salesCycleLength: 1,
          churnRate: 20
        }
      }
    ];
  }
}

// Export singleton instance
export const costCalculatorService = new CostCalculatorService();
export default costCalculatorService;
