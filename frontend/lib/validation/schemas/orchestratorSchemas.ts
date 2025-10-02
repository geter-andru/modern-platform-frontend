import { z } from 'zod';

export const OrchestratorRecommendationSchema = z.object({
  id: z.string().uuid().describe('Recommendation identifier'),
  title: z.string().min(1).max(255).describe('Recommendation title'),
  description: z.string().min(10).describe('Detailed recommendation description'),
  category: z.enum(['immediate', 'short-term', 'long-term']).describe('Recommendation category'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).describe('Priority level'),
  effort: z.enum(['low', 'medium', 'high']).describe('Implementation effort'),
  impact: z.enum(['low', 'medium', 'high']).describe('Expected impact'),
  timeline: z.string().describe('Implementation timeline'),
  dependencies: z.array(z.string()).optional().describe('Required dependencies')
});

export const BusinessImpactSchema = z.object({
  customerAcquisitionCost: z.string().describe('Customer acquisition cost impact'),
  conversionRate: z.string().describe('Conversion rate impact'),
  dealClosureRate: z.string().describe('Deal closure rate impact'),
  revenueGrowth: z.string().optional().describe('Revenue growth impact'),
  marketShare: z.string().optional().describe('Market share impact')
});

export const CompetencyFocusSchema = z.object({
  primary: z.string().describe('Primary competency focus'),
  secondary: z.string().describe('Secondary competency focus'),
  development: z.string().describe('Development area focus')
});

export const RecommendationsDataSchema = z.object({
  immediate: z.array(z.string()).describe('Immediate action items'),
  shortTerm: z.array(z.string()).describe('Short-term recommendations'),
  longTerm: z.array(z.string()).describe('Long-term strategic recommendations'),
  businessImpact: BusinessImpactSchema.describe('Expected business impact'),
  competencyFocus: CompetencyFocusSchema.describe('Competency development focus')
});

export const FounderProfileSchema = z.object({
  id: z.string().uuid().describe('Founder profile identifier'),
  name: z.string().min(1).max(255).describe('Founder name'),
  company: z.string().min(1).max(255).describe('Company name'),
  industry: z.string().min(1).max(100).describe('Industry'),
  stage: z.enum(['pre-seed', 'seed', 'series-a', 'series-b', 'growth']).describe('Company stage'),
  teamSize: z.number().min(1).describe('Team size'),
  revenue: z.number().min(0).optional().describe('Annual revenue'),
  challenges: z.array(z.string()).describe('Current challenges'),
  goals: z.array(z.string()).describe('Business goals'),
  competencies: z.object({
    customerIntelligence: z.number().min(0).max(100).describe('Customer intelligence score'),
    valueCommunication: z.number().min(0).max(100).describe('Value communication score'),
    salesExecution: z.number().min(0).max(100).describe('Sales execution score'),
    technicalTranslation: z.number().min(0).max(100).describe('Technical translation score')
  }).describe('Competency scores')
});

export const ScalingPlanSchema = z.object({
  id: z.string().uuid().describe('Scaling plan identifier'),
  founderId: z.string().uuid().describe('Founder identifier'),
  phase: z.enum(['foundation', 'growth', 'scale', 'optimization']).describe('Scaling phase'),
  objectives: z.array(z.string()).describe('Scaling objectives'),
  strategies: z.array(z.object({
    area: z.string().describe('Strategy area'),
    actions: z.array(z.string()).describe('Specific actions'),
    timeline: z.string().describe('Implementation timeline'),
    resources: z.array(z.string()).describe('Required resources')
  })).describe('Scaling strategies'),
  metrics: z.object({
    revenue: z.number().min(0).describe('Target revenue'),
    customers: z.number().min(0).describe('Target customer count'),
    team: z.number().min(0).describe('Target team size'),
    marketShare: z.number().min(0).max(100).describe('Target market share percentage')
  }).describe('Target metrics'),
  risks: z.array(z.object({
    risk: z.string().describe('Risk description'),
    probability: z.enum(['low', 'medium', 'high']).describe('Risk probability'),
    impact: z.enum(['low', 'medium', 'high']).describe('Risk impact'),
    mitigation: z.string().describe('Mitigation strategy')
  })).describe('Identified risks')
});

export const SystematicActionSchema = z.object({
  id: z.string().uuid().describe('Action identifier'),
  type: z.enum(['process', 'tool', 'training', 'strategy']).describe('Action type'),
  title: z.string().min(1).max(255).describe('Action title'),
  description: z.string().min(10).describe('Action description'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).describe('Action priority'),
  effort: z.enum(['low', 'medium', 'high']).describe('Implementation effort'),
  impact: z.enum(['low', 'medium', 'high']).describe('Expected impact'),
  timeline: z.string().describe('Implementation timeline'),
  dependencies: z.array(z.string()).optional().describe('Action dependencies'),
  resources: z.array(z.string()).optional().describe('Required resources')
});

export const ToolUsageSchema = z.object({
  id: z.string().uuid().describe('Tool usage identifier'),
  toolName: z.string().min(1).max(255).describe('Tool name'),
  category: z.enum(['crm', 'analytics', 'communication', 'automation', 'intelligence']).describe('Tool category'),
  usage: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'occasionally']).describe('Usage frequency'),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).describe('Proficiency level'),
    effectiveness: z.number().min(1).max(10).describe('Effectiveness rating (1-10)')
  }).describe('Usage details'),
  recommendations: z.array(z.string()).describe('Usage recommendations'),
  integration: z.object({
    connected: z.boolean().describe('Integration status'),
    dataFlow: z.string().optional().describe('Data flow description'),
    automation: z.boolean().describe('Automation enabled')
  }).describe('Integration details')
});

export const ScalingStatusSchema = z.object({
  founderId: z.string().uuid().describe('Founder identifier'),
  currentPhase: z.enum(['foundation', 'growth', 'scale', 'optimization']).describe('Current scaling phase'),
  progress: z.number().min(0).max(100).describe('Scaling progress percentage'),
  milestones: z.array(z.object({
    milestone: z.string().describe('Milestone description'),
    status: z.enum(['pending', 'in-progress', 'completed', 'blocked']).describe('Milestone status'),
    completionDate: z.string().datetime().optional().describe('Completion date'),
    nextAction: z.string().optional().describe('Next action required')
  })).describe('Scaling milestones'),
  blockers: z.array(z.string()).describe('Current blockers'),
  achievements: z.array(z.string()).describe('Recent achievements'),
  nextSteps: z.array(z.string()).describe('Recommended next steps')
});

export const OrchestratorRequestSchema = z.object({
  includeDetails: z.boolean().optional().default(true).describe('Include detailed information'),
  includeRecommendations: z.boolean().optional().default(true).describe('Include recommendations'),
  includeMetrics: z.boolean().optional().default(false).describe('Include performance metrics')
});

export const OrchestratorResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  data: z.any().optional().describe('Response data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const RecommendationsResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  recommendations: RecommendationsDataSchema.describe('Recommendations data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const FounderProfileResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  profile: FounderProfileSchema.optional().describe('Founder profile data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const ScalingPlanResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  plan: ScalingPlanSchema.optional().describe('Scaling plan data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const SystematicActionResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  actions: z.array(SystematicActionSchema).describe('Systematic actions'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const ToolUsageResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  tools: z.array(ToolUsageSchema).describe('Tool usage data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const ScalingStatusResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  status: ScalingStatusSchema.optional().describe('Scaling status data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export function validateOrchestratorRequest(data: unknown) {
  return OrchestratorRequestSchema.parse(data);
}

export function validateOrchestratorResponse(data: unknown) {
  return OrchestratorResponseSchema.parse(data);
}

export function validateRecommendationsResponse(data: unknown) {
  return RecommendationsResponseSchema.parse(data);
}

export function validateFounderProfileResponse(data: unknown) {
  return FounderProfileResponseSchema.parse(data);
}

export function validateScalingPlanResponse(data: unknown) {
  return ScalingPlanResponseSchema.parse(data);
}

export function validateSystematicActionResponse(data: unknown) {
  return SystematicActionResponseSchema.parse(data);
}

export function validateToolUsageResponse(data: unknown) {
  return ToolUsageResponseSchema.parse(data);
}

export function validateScalingStatusResponse(data: unknown) {
  return ScalingStatusResponseSchema.parse(data);
}

export type OrchestratorRecommendation = z.infer<typeof OrchestratorRecommendationSchema>;
export type BusinessImpact = z.infer<typeof BusinessImpactSchema>;
export type CompetencyFocus = z.infer<typeof CompetencyFocusSchema>;
export type RecommendationsData = z.infer<typeof RecommendationsDataSchema>;
export type FounderProfile = z.infer<typeof FounderProfileSchema>;
export type ScalingPlan = z.infer<typeof ScalingPlanSchema>;
export type SystematicAction = z.infer<typeof SystematicActionSchema>;
export type ToolUsage = z.infer<typeof ToolUsageSchema>;
export type ScalingStatus = z.infer<typeof ScalingStatusSchema>;

export type OrchestratorRequest = z.infer<typeof OrchestratorRequestSchema>;
export type OrchestratorResponse = z.infer<typeof OrchestratorResponseSchema>;
export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;
export type FounderProfileResponse = z.infer<typeof FounderProfileResponseSchema>;
export type ScalingPlanResponse = z.infer<typeof ScalingPlanResponseSchema>;
export type SystematicActionResponse = z.infer<typeof SystematicActionResponseSchema>;
export type ToolUsageResponse = z.infer<typeof ToolUsageResponseSchema>;
export type ScalingStatusResponse = z.infer<typeof ScalingStatusResponseSchema>;