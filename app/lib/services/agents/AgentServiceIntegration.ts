/**
 * Agent Service Integration Layer
 * Integrates the sophisticated agent system with existing platform services
 * Provides seamless connection between agents and business logic
 */

import { icpAnalysisService } from '../icpAnalysisService';
import { costCalculatorService } from '../costCalculatorService';
import { businessCaseService } from '../businessCaseService';
import { progressTrackingService } from '../progressTrackingService';
import exportService from '../exportService';
import claudeAIService from '../claudeAIService';
import { backendService } from '../backendService';

// Import agent classes
import { ProspectQualificationOptimizer } from '../../agents/customer-value/ProspectQualificationOptimizer';
import { DealValueCalculatorOptimizer } from '../../agents/customer-value/DealValueCalculatorOptimizer';
import { SalesMaterialsOptimizer } from '../../agents/customer-value/SalesMaterialsOptimizer';
import { DashboardOptimizer } from '../../agents/customer-value/DashboardOptimizer';

// Import orchestrator
import customerValueOrchestrator from '../customerValueOrchestrator';

export interface AgentServiceContext {
  customerId: string;
  sessionId: string;
  userId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  context?: Record<string, any>;
  timestamp?: number;
}

export interface AgentServiceResult {
  success: boolean;
  agentType: string;
  analysis?: any;
  optimizations?: any[];
  results?: any;
  performance?: any;
  error?: string;
  integrationData?: {
    icpData?: any;
    costData?: any;
    businessCaseData?: any;
    progressData?: any;
    exportData?: any;
  };
}

export interface SeriesAFounderContext {
  companyStage: 'late-seed' | 'early-series-a';
  currentARR: number;
  targetARR: number;
  timeToSeriesB: number;
  productType: 'high-value-technical' | 'enterprise-solution';
  salesEvolution: 'founder-led' | 'systematic-process';
  customerBase: EnterpriseClient[];
  psychologicalProfile: {
    mbti: 'INTJ' | 'ENTJ';
    characteristics: string[];
    coreValues: string[];
  };
}

export interface EnterpriseClient {
  type: 'land-expand';
  status: 'paid-pilot' | 'enterprise-contract';
  value: number;
  stakeholders: string[];
}

class AgentServiceIntegration {
  private agents: {
    prospectQualification: ProspectQualificationOptimizer;
    dealValueCalculator: DealValueCalculatorOptimizer;
    salesMaterials: SalesMaterialsOptimizer;
    dashboard: DashboardOptimizer;
  };

  constructor() {
    // Initialize agents with service dependencies
    this.agents = {
      prospectQualification: new ProspectQualificationOptimizer(),
      dealValueCalculator: new DealValueCalculatorOptimizer(),
      salesMaterials: new SalesMaterialsOptimizer(),
      dashboard: new DashboardOptimizer()
    };
  }

  /**
   * Activate Prospect Qualification Optimizer with ICP service integration
   */
  async activateProspectQualificationOptimizer(
    context: AgentServiceContext
  ): Promise<AgentServiceResult> {
    try {
      console.log('🎯 Activating Prospect Qualification Optimizer with service integration');

      // Get ICP data from existing service
      const icpData = await this.getICPData(context.customerId);
      
      // Get progress data
      const progressData = await this.getProgressData(context.customerId);

      // Enhanced context with service data
      const enhancedContext = {
        ...context,
        context: {
          ...context.context,
          icpData,
          progressData,
          serviceIntegration: true
        }
      };

      // Activate agent
      const result = await this.agents.prospectQualification.activate(enhancedContext);

      return {
        success: result.status === 'optimization-complete',
        agentType: 'prospect-qualification-optimizer',
        analysis: result.analysis,
        optimizations: result.optimizations,
        results: result.results,
        performance: result.performance,
        integrationData: {
          icpData,
          progressData
        }
      };

    } catch (error) {
      console.error('❌ Prospect Qualification Optimizer failed:', error);
      return {
        success: false,
        agentType: 'prospect-qualification-optimizer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Activate Deal Value Calculator Optimizer with cost calculator service integration
   */
  async activateDealValueCalculatorOptimizer(
    context: AgentServiceContext
  ): Promise<AgentServiceResult> {
    try {
      console.log('💰 Activating Deal Value Calculator Optimizer with service integration');

      // Get cost calculation data
      const costData = await this.getCostCalculationData(context.customerId);
      
      // Get business case data
      const businessCaseData = await this.getBusinessCaseData(context.customerId);

      // Enhanced context with service data
      const enhancedContext = {
        ...context,
        context: {
          ...context.context,
          costData,
          businessCaseData,
          serviceIntegration: true
        }
      };

      // Activate agent
      const result = await this.agents.dealValueCalculator.activate(enhancedContext);

      return {
        success: result.status === 'optimization-complete',
        agentType: 'deal-value-calculator-optimizer',
        analysis: result.analysis,
        optimizations: result.optimizations,
        results: result.results,
        performance: result.performance,
        integrationData: {
          costData,
          businessCaseData
        }
      };

    } catch (error) {
      console.error('❌ Deal Value Calculator Optimizer failed:', error);
      return {
        success: false,
        agentType: 'deal-value-calculator-optimizer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Activate Sales Materials Optimizer with export service integration
   */
  async activateSalesMaterialsOptimizer(
    context: AgentServiceContext
  ): Promise<AgentServiceResult> {
    try {
      console.log('📄 Activating Sales Materials Optimizer with service integration');

      // Get export data
      const exportData = await this.getExportData(context.customerId);

      // Enhanced context with service data
      const enhancedContext = {
        ...context,
        context: {
          ...context.context,
          exportData,
          serviceIntegration: true
        }
      };

      // Activate agent
      const result = await this.agents.salesMaterials.activate(enhancedContext);

      return {
        success: result.status === 'optimization-complete',
        agentType: 'sales-materials-optimizer',
        analysis: result.analysis,
        optimizations: result.optimizations,
        results: result.results,
        performance: result.performance,
        integrationData: {
          exportData
        }
      };

    } catch (error) {
      console.error('❌ Sales Materials Optimizer failed:', error);
      return {
        success: false,
        agentType: 'sales-materials-optimizer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Activate Dashboard Optimizer (CRITICAL - Professional Credibility)
   */
  async activateDashboardOptimizer(
    context: AgentServiceContext
  ): Promise<AgentServiceResult> {
    try {
      console.log('🚨 CRITICAL: Activating Dashboard Optimizer for professional credibility');

      // Get all relevant data for dashboard analysis
      const icpData = await this.getICPData(context.customerId);
      const progressData = await this.getProgressData(context.customerId);
      const costData = await this.getCostCalculationData(context.customerId);

      // Enhanced context with comprehensive data
      const enhancedContext = {
        ...context,
        context: {
          ...context.context,
          icpData,
          progressData,
          costData,
          serviceIntegration: true,
          criticalPriority: true // Dashboard optimizer is critical for Series A credibility
        }
      };

      // Activate agent
      const result = await this.agents.dashboard.activate(enhancedContext);

      return {
        success: result.status === 'optimization-complete',
        agentType: 'dashboard-optimizer',
        analysis: result.analysis,
        optimizations: result.optimizations,
        results: result.results,
        performance: result.performance,
        integrationData: {
          icpData,
          progressData,
          costData
        }
      };

    } catch (error) {
      console.error('❌ CRITICAL: Dashboard Optimizer failed:', error);
      return {
        success: false,
        agentType: 'dashboard-optimizer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Start orchestration with service integration
   */
  async startOrchestrationWithServices(
    customerId: string,
    sessionId: string,
    founderContext?: SeriesAFounderContext
  ): Promise<{
    status: string;
    sessionId: string;
    customerId: string;
    monitoringActive: boolean;
    serviceIntegration: boolean;
  }> {
    try {
      console.log('🎯 Starting orchestration with service integration');

      // Start the main orchestrator
      const orchestrationResult = await customerValueOrchestrator.startOrchestration(
        customerId,
        sessionId
      );

      // If we have founder context, spawn appropriate agents
      if (founderContext) {
        await this.spawnFounderSpecificAgents(customerId, sessionId, founderContext);
      }

      return {
        ...orchestrationResult,
        serviceIntegration: true
      };

    } catch (error) {
      console.error('❌ Orchestration with services failed:', error);
      throw error;
    }
  }

  /**
   * Spawn agents specific to Series A founder needs
   */
  private async spawnFounderSpecificAgents(
    customerId: string,
    sessionId: string,
    founderContext: SeriesAFounderContext
  ): Promise<void> {
    console.log('🚀 Spawning Series A founder specific agents');

    // Always spawn dashboard optimizer for professional credibility
    await this.activateDashboardOptimizer({
      customerId,
      sessionId,
      userId: customerId,
      priority: 'critical',
      issue: 'Series A founder professional credibility maintenance',
      context: {
        founderContext,
        target: 'Series A founder credibility',
        executiveDemoSafety: 'investor presentation ready'
      }
    });

    // Spawn based on founder's specific challenges
    if (founderContext.salesEvolution === 'founder-led') {
      await this.activateProspectQualificationOptimizer({
        customerId,
        sessionId,
        userId: customerId,
        priority: 'high',
        issue: 'Founder-led sales optimization for Series A scaling',
        context: {
          founderContext,
          focus: 'systematic-qualification-process'
        }
      });
    }

    if (founderContext.currentARR < founderContext.targetARR * 0.3) {
      await this.activateDealValueCalculatorOptimizer({
        customerId,
        sessionId,
        userId: customerId,
        priority: 'high',
        issue: 'Revenue acceleration for Series A scaling',
        context: {
          founderContext,
          focus: 'CFO-ready-business-cases'
        }
      });
    }
  }

  /**
   * Get ICP data from existing service
   */
  private async getICPData(customerId: string): Promise<any> {
    try {
      const response = await (icpAnalysisService as any).getCustomerICP(customerId);
      return response.success ? response.data : null;
    } catch (error) {
      console.warn('⚠️ Could not fetch ICP data:', error);
      return null;
    }
  }

  /**
   * Get progress data from existing service
   */
  private async getProgressData(customerId: string): Promise<any> {
    try {
      const response = await progressTrackingService.getCustomerProgress(customerId);
      return response.success ? response.data : null;
    } catch (error) {
      console.warn('⚠️ Could not fetch progress data:', error);
      return null;
    }
  }

  /**
   * Get cost calculation data from existing service
   */
  private async getCostCalculationData(customerId: string): Promise<any> {
    try {
      // This would typically get the latest cost calculation
      // For now, we'll return null as the service doesn't have a direct method
      return null;
    } catch (error) {
      console.warn('⚠️ Could not fetch cost calculation data:', error);
      return null;
    }
  }

  /**
   * Get business case data from existing service
   */
  private async getBusinessCaseData(customerId: string): Promise<any> {
    try {
      // This would typically get the latest business case
      // For now, we'll return null as the service doesn't have a direct method
      return null;
    } catch (error) {
      console.warn('⚠️ Could not fetch business case data:', error);
      return null;
    }
  }

  /**
   * Get export data from existing service
   */
  private async getExportData(customerId: string): Promise<any> {
    try {
      // This would typically get export history and success rates
      // For now, we'll return null as the service doesn't have a direct method
      return null;
    } catch (error) {
      console.warn('⚠️ Could not fetch export data:', error);
      return null;
    }
  }

  /**
   * Get agent status from orchestrator
   */
  getOrchestrationStatus(): any {
    return customerValueOrchestrator.getStatus();
  }

  /**
   * Stop orchestration
   */
  stopOrchestration(): any {
    return customerValueOrchestrator.stopOrchestration();
  }
}

// Create singleton instance
const agentServiceIntegration = new AgentServiceIntegration();

export default agentServiceIntegration;
export { AgentServiceIntegration };
