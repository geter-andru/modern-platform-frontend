/**
 * Agent System Exports
 * Centralized exports for the sophisticated agent orchestration system
 * Designed for Series A technical founders scaling $2M→$10M ARR
 */

// Core Agent Classes
export { ProspectQualificationOptimizer } from '../../agents/customer-value/ProspectQualificationOptimizer';
export { DealValueCalculatorOptimizer } from '../../agents/customer-value/DealValueCalculatorOptimizer';
export { SalesMaterialsOptimizer } from '../../agents/customer-value/SalesMaterialsOptimizer';
export { DashboardOptimizer } from '../../agents/customer-value/DashboardOptimizer';

// Service Integration
import agentServiceIntegration, { AgentServiceIntegration, type SeriesAFounderContext } from './AgentServiceIntegration';
export { agentServiceIntegration, AgentServiceIntegration };

// Orchestration Services
import customerValueOrchestrator from '../customerValueOrchestrator';
import { agentOrchestrationService } from '../agentOrchestrationService';
export { customerValueOrchestrator, agentOrchestrationService };

// React Hook
// TODO: Restore when agent system is fully implemented
// import { useAgentOrchestration } from '../../hooks/useAgentOrchestration';
// export { useAgentOrchestration };

// Types and Interfaces
export type {
  AgentServiceContext,
  AgentServiceResult,
  SeriesAFounderContext,
  EnterpriseClient
} from './AgentServiceIntegration';

// TODO: Restore when agent system is fully implemented
// export type {
//   UseAgentOrchestrationOptions,
//   UseAgentOrchestrationReturn,
//   SessionData,
//   SubAgent,
//   AgentContext,
//   AgentResult,
//   OverallPerformance,
//   OrchestrationStatus,
//   AgentType,
//   AgentStatus
// } from '../../hooks/useAgentOrchestration';

// Legacy exports for backward compatibility
export type {
  OrchestrationSession,
  FrictionPoint,
  WorkflowStep,
  SessionData as LegacySessionData,
  SubAgentContext,
  SubAgent as LegacySubAgent,
  OrchestrationReport,
  OrchestrationStatus as LegacyOrchestrationStatus
} from '../customerValueOrchestrator';

// Agent System Configuration
export const AGENT_SYSTEM_CONFIG = {
  version: '1.0.0',
  targetBuyer: 'Series A Technical Founders',
  scalingRange: '$2M → $10M ARR',
  timeToSeriesB: '18-24 months',
  professionalCredibility: '100% (zero gaming terminology)',
  valueRecognitionTarget: '<30 seconds',
  businessCaseGenerationTarget: '<5 minutes',
  exportSuccessRateTarget: '98%+',
  features: [
    'Real-time performance monitoring',
    'Behavioral intelligence integration',
    'Predictive analytics',
    'Adaptive thresholds',
    'Professional credibility maintenance',
    'Service integration layer',
    'React hook management',
    'Series A founder optimization'
  ]
} as const;

// Quick Start Helper Functions
export const agentSystem = {
  /**
   * Quick start orchestration for Series A founders
   */
  quickStart: async (customerId: string, founderContext?: SeriesAFounderContext) => {
    return await agentServiceIntegration.startOrchestrationWithServices(
      customerId,
      `quick_start_${Date.now()}`,
      founderContext
    );
  },

  /**
   * Spawn critical dashboard optimizer for professional credibility
   */
  ensureProfessionalCredibility: async (customerId: string) => {
    return await agentServiceIntegration.activateDashboardOptimizer({
      customerId,
      sessionId: `credibility_check_${Date.now()}`,
      userId: customerId,
      priority: 'critical',
      issue: 'Professional credibility maintenance for Series A founder',
      context: {
        requirement: 'ZERO gaming terminology',
        target: 'Series A founder credibility',
        executiveDemoSafety: 'investor presentation ready'
      }
    });
  },

  /**
   * Optimize for value recognition speed
   */
  optimizeValueRecognition: async (customerId: string) => {
    return await agentServiceIntegration.activateProspectQualificationOptimizer({
      customerId,
      sessionId: `value_recognition_${Date.now()}`,
      userId: customerId,
      priority: 'high',
      issue: 'Value recognition exceeds 30-second target',
      context: {
        target: '30 seconds',
        focus: 'immediate-wow-factor'
      }
    });
  },

  /**
   * Generate CFO-ready business cases
   */
  generateCFOReadyBusinessCase: async (customerId: string) => {
    return await agentServiceIntegration.activateDealValueCalculatorOptimizer({
      customerId,
      sessionId: `cfo_business_case_${Date.now()}`,
      userId: customerId,
      priority: 'high',
      issue: 'CFO-ready business case generation',
      context: {
        target: 'CFO presentations',
        focus: 'financial-credibility'
      }
    });
  },

  /**
   * Optimize export success rate
   */
  optimizeExportSuccess: async (customerId: string) => {
    return await agentServiceIntegration.activateSalesMaterialsOptimizer({
      customerId,
      sessionId: `export_optimization_${Date.now()}`,
      userId: customerId,
      priority: 'medium',
      issue: 'Export success rate below 98% target',
      context: {
        target: '98%+ success rate',
        focus: 'CRM integration'
      }
    });
  },

  /**
   * Get current orchestration status
   */
  getStatus: () => {
    return agentServiceIntegration.getOrchestrationStatus();
  },

  /**
   * Stop orchestration
   */
  stop: () => {
    return agentServiceIntegration.stopOrchestration();
  }
};

// Series A Founder Context Helper
export const createSeriesAFounderContext = (
  currentARR: number,
  targetARR: number = 10000000,
  timeToSeriesB: number = 18
): SeriesAFounderContext => {
  return {
    companyStage: currentARR < 5000000 ? 'late-seed' : 'early-series-a',
    currentARR,
    targetARR,
    timeToSeriesB,
    productType: 'high-value-technical',
    salesEvolution: 'founder-led',
    customerBase: [],
    psychologicalProfile: {
      mbti: 'INTJ',
      characteristics: ['analytical', 'systematic', 'data-driven'],
      coreValues: ['systematic-efficiency', 'technical-credibility', 'speed-to-value']
    }
  };
};

// Default export for convenience
export default {
  agentServiceIntegration,
  customerValueOrchestrator,
  agentOrchestrationService,
  // useAgentOrchestration, // TODO: Restore when agent system is fully implemented
  agentSystem,
  createSeriesAFounderContext,
  AGENT_SYSTEM_CONFIG
};
