import { z } from 'zod';

export const CompetencyLevelSchema = z.object({
  id: z.string().uuid().describe('Competency level identifier'),
  name: z.string().min(1).max(255).describe('Level name'),
  description: z.string().min(10).describe('Level description'),
  minScore: z.number().min(0).max(100).describe('Minimum score required'),
  maxScore: z.number().min(0).max(100).describe('Maximum score for this level'),
  requirements: z.array(z.string()).describe('Level requirements'),
  benefits: z.array(z.string()).describe('Level benefits')
});

export const CompetencyDataSchema = z.object({
  id: z.string().uuid().describe('Competency data identifier'),
  userId: z.string().uuid().describe('User identifier'),
  customerAnalysis: z.number().min(0).max(100).describe('Customer analysis score'),
  valueCommunication: z.number().min(0).max(100).describe('Value communication score'),
  salesExecution: z.number().min(0).max(100).describe('Sales execution score'),
  technicalTranslation: z.number().min(0).max(100).describe('Technical translation score'),
  overallScore: z.number().min(0).max(100).describe('Overall competency score'),
  level: z.string().describe('Current competency level'),
  lastUpdated: z.string().datetime().describe('Last update timestamp')
});

export const MilestoneSchema = z.object({
  id: z.string().uuid().describe('Milestone identifier'),
  title: z.string().min(1).max(255).describe('Milestone title'),
  description: z.string().min(10).describe('Milestone description'),
  category: z.enum(['foundation', 'intermediate', 'advanced', 'expert']).describe('Milestone category'),
  requirements: z.array(z.string()).describe('Milestone requirements'),
  rewards: z.array(z.string()).describe('Milestone rewards'),
  isCompleted: z.boolean().describe('Completion status'),
  completedAt: z.string().datetime().optional().describe('Completion timestamp'),
  progress: z.number().min(0).max(100).describe('Progress percentage')
});

export const ProgressTrackingSchema = z.object({
  id: z.string().uuid().describe('Progress tracking identifier'),
  userId: z.string().uuid().describe('User identifier'),
  competency: z.string().describe('Competency area'),
  currentScore: z.number().min(0).max(100).describe('Current score'),
  targetScore: z.number().min(0).max(100).describe('Target score'),
  progress: z.number().min(0).max(100).describe('Progress percentage'),
  lastActivity: z.string().datetime().describe('Last activity timestamp'),
  activities: z.array(z.object({
    activity: z.string().describe('Activity description'),
    score: z.number().min(0).max(100).describe('Activity score'),
    timestamp: z.string().datetime().describe('Activity timestamp')
  })).describe('Recent activities')
});

export const CompetencyActionSchema = z.object({
  id: z.string().uuid().describe('Action identifier'),
  title: z.string().min(1).max(255).describe('Action title'),
  description: z.string().min(10).describe('Action description'),
  category: z.enum(['training', 'practice', 'assessment', 'project']).describe('Action category'),
  competency: z.string().describe('Target competency'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe('Difficulty level'),
  estimatedTime: z.number().min(0).describe('Estimated time in minutes'),
  points: z.number().min(0).describe('Points awarded'),
  prerequisites: z.array(z.string()).optional().describe('Prerequisites')
});

export const CompetencyAnalyticsSchema = z.object({
  userId: z.string().uuid().describe('User identifier'),
  overallProgress: z.number().min(0).max(100).describe('Overall progress percentage'),
  competencyBreakdown: z.object({
    customerAnalysis: z.number().min(0).max(100).describe('Customer analysis score'),
    valueCommunication: z.number().min(0).max(100).describe('Value communication score'),
    salesExecution: z.number().min(0).max(100).describe('Sales execution score'),
    technicalTranslation: z.number().min(0).max(100).describe('Technical translation score')
  }).describe('Competency breakdown'),
  trends: z.object({
    improvement: z.array(z.string()).describe('Areas of improvement'),
    strengths: z.array(z.string()).describe('Strength areas'),
    recommendations: z.array(z.string()).describe('Improvement recommendations')
  }).describe('Analytics trends'),
  achievements: z.array(z.object({
    achievement: z.string().describe('Achievement description'),
    date: z.string().datetime().describe('Achievement date'),
    points: z.number().min(0).describe('Points earned')
  })).describe('Recent achievements')
});

export const CompetencyRequestSchema = z.object({
  includeDetails: z.boolean().optional().default(true).describe('Include detailed information'),
  includeProgress: z.boolean().optional().default(true).describe('Include progress data'),
  includeRecommendations: z.boolean().optional().default(false).describe('Include recommendations')
});

export const CompetencyResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  data: z.any().optional().describe('Response data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const CompetencyLevelsResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  levels: z.array(CompetencyLevelSchema).describe('Competency levels'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const CompetencyDataResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  competencyData: CompetencyDataSchema.optional().describe('Competency data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const MilestonesResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  milestones: z.array(MilestoneSchema).describe('User milestones'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const ProgressResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  progress: z.array(ProgressTrackingSchema).describe('Progress tracking data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const ActionsResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  actions: z.array(CompetencyActionSchema).describe('Available actions'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export const AnalyticsResponseSchema = z.object({
  success: z.boolean().describe('Request success status'),
  analytics: CompetencyAnalyticsSchema.optional().describe('Analytics data'),
  message: z.string().describe('Response message'),
  error: z.string().optional().describe('Error message if applicable')
});

export function validateCompetencyRequest(data: unknown) {
  return CompetencyRequestSchema.parse(data);
}

export function validateCompetencyResponse(data: unknown) {
  return CompetencyResponseSchema.parse(data);
}

export function validateCompetencyLevelsResponse(data: unknown) {
  return CompetencyLevelsResponseSchema.parse(data);
}

export function validateCompetencyDataResponse(data: unknown) {
  return CompetencyDataResponseSchema.parse(data);
}

export function validateMilestonesResponse(data: unknown) {
  return MilestonesResponseSchema.parse(data);
}

export function validateProgressResponse(data: unknown) {
  return ProgressResponseSchema.parse(data);
}

export function validateActionsResponse(data: unknown) {
  return ActionsResponseSchema.parse(data);
}

export function validateAnalyticsResponse(data: unknown) {
  return AnalyticsResponseSchema.parse(data);
}

export type CompetencyLevel = z.infer<typeof CompetencyLevelSchema>;
export type CompetencyData = z.infer<typeof CompetencyDataSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export type ProgressTracking = z.infer<typeof ProgressTrackingSchema>;
export type CompetencyAction = z.infer<typeof CompetencyActionSchema>;
export type CompetencyAnalytics = z.infer<typeof CompetencyAnalyticsSchema>;

export type CompetencyRequest = z.infer<typeof CompetencyRequestSchema>;
export type CompetencyResponse = z.infer<typeof CompetencyResponseSchema>;
export type CompetencyLevelsResponse = z.infer<typeof CompetencyLevelsResponseSchema>;
export type CompetencyDataResponse = z.infer<typeof CompetencyDataResponseSchema>;
export type MilestonesResponse = z.infer<typeof MilestonesResponseSchema>;
export type ProgressResponse = z.infer<typeof ProgressResponseSchema>;
export type ActionsResponse = z.infer<typeof ActionsResponseSchema>;
export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;
