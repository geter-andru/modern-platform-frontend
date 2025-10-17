
// Core ICP Data Types
export interface ICPData {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  generatedAt: Date;
  confidence: number;
  lastUpdated: Date;
  sections: Record<string, string>;
  ratingFramework?: RatingFramework;
  buyerPersonas?: BuyerPersona[];
  technicalTranslations?: TechnicalTranslation[];
}

// ICP Section Types
export interface ICPSection {
  id: string;
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
  expanded?: boolean;
}

export interface SectionDefinition {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

// Rating Framework Types
export interface RatingFramework {
  id: string;
  name: string;
  criteria: Criteria[];
  weights: Record<string, number>;
  tiers: TierDefinition[];
  lastUpdated: Date;
  version: string;
}

export interface Criteria {
  id: string;
  name: string;
  weight: number;
  description: string;
  scoringMethod: 'binary' | 'scale' | 'custom';
  scale?: {
    min: number;
    max: number;
    step: number;
  };
  customOptions?: string[];
}

export interface TierDefinition {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
}

// Company Rating Types
export interface CompanyRating {
  id: string;
  companyName: string;
  overallScore: number;
  tier: TierDefinition;
  criteria: CriteriaScore[];
  recommendation: string;
  insights: RatingInsight[];
  salesActions: SalesAction[];
  generatedAt: Date;
  confidence: number;
}

export interface CriteriaScore {
  criteriaId: string;
  criteriaName: string;
  score: number;
  weight: number;
  weightedScore: number;
  explanation: string;
  evidence?: string[];
}

export interface RatingInsight {
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface SalesAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  resources?: string[];
  expectedOutcome: string;
}

// Buyer Persona Types
export interface BuyerPersona {
  id: string;
  name: string;
  role: string;
  title: string;
  demographics: Demographics;
  psychographics: Psychographics;
  goals: string[];
  painPoints: string[];
  buyingBehavior: BuyingBehavior;
  communicationPreferences: CommunicationPreferences;
  objections: string[];
  informationSources: string[];
  technologyUsage: TechnologyUsage;
  decisionInfluence: DecisionInfluence;
}

export interface Demographics {
  ageRange: string;
  experience: string;
  education: string;
  location: string;
  companySize: string;
  industry: string;
}

export interface Psychographics {
  values: string[];
  motivations: string[];
  fears: string[];
  personality: string;
  workStyle: string;
  communicationStyle: string;
}

export interface BuyingBehavior {
  researchStyle: string;
  riskTolerance: string;
  decisionSpeed: string;
  informationSources: string[];
  evaluationCriteria: string[];
  decisionProcess: string;
}

export interface CommunicationPreferences {
  preferredChannels: string[];
  communicationStyle: string;
  meetingPreferences: string;
  followUpFrequency: string;
  contentPreferences: string[];
}

export interface TechnologyUsage {
  currentTools: string[];
  techSavviness: string;
  preferredPlatforms: string[];
  integrationRequirements: string[];
}

export interface DecisionInfluence {
  influencers: string[];
  decisionFactors: string[];
  approvalProcess: string;
  budgetAuthority: string;
  timeline: string;
}

// Technical Translation Types
export interface TechnicalTranslation {
  id: string;
  technicalMetric: string;
  improvement: string;
  industry: string;
  targetStakeholder: string;
  businessTranslation: string;
  stakeholderSpecific: StakeholderTranslation;
  usageInstructions: UsageInstructions;
  generatedAt: Date;
}

export interface StakeholderTranslation {
  language: string;
  focus: string;
  metrics: string[];
  concerns: string[];
  roiCalculation?: string;
}

export interface UsageInstructions {
  elevator: string;
  email: string;
  presentation: string;
  objection: string;
  followUp: string;
}

// Service Types
export interface WebResearchResult {
  type: string;
  data: any;
  sources: string[];
  confidence: number;
  timestamp: Date;
}

export interface ClaudeAIResponse {
  content: string;
  confidence: number;
  tokens: number;
  model: string;
  timestamp: Date;
}

export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'csv' | 'json' | 'text';
  template?: string;
  supportedTools: string[];
}

export interface ExportResult {
  format: ExportFormat;
  data: any;
  filename: string;
  downloadUrl?: string;
  success: boolean;
  error?: string;
}

// Widget Props Types
export interface MyICPOverviewWidgetProps {
  onExport?: (data: ICPData) => void;
  onRefresh?: () => void;
  className?: string;
}

export interface ICPRatingSystemWidgetProps {
  onFrameworkUpdate?: (framework: RatingFramework) => void;
  onExport?: (framework: RatingFramework) => void;
  className?: string;
}

export interface RateCompanyWidgetProps {
  framework?: RatingFramework;
  onRatingComplete?: (rating: CompanyRating) => void;
  onExport?: (rating: CompanyRating) => void;
  className?: string;
}

export interface BuyerPersonasWidgetProps {
  onPersonaUpdate?: (personas: BuyerPersona[]) => void;
  onExport?: (personas: BuyerPersona[]) => void;
  className?: string;
}

export interface TechnicalTranslatorWidgetProps {
  onTranslationComplete?: (translation: TechnicalTranslation) => void;
  onExport?: (translation: TechnicalTranslation) => void;
  className?: string;
}

// API Types
export interface ICPAnalysisRequest {
  companyName: string;
  industry: string;
  productDescription: string;
  targetMarket: string;
  competitiveAdvantages: string[];
  researchDepth: 'basic' | 'medium' | 'deep';
}

export interface ICPAnalysisResponse {
  success: boolean;
  data?: ICPData;
  error?: string;
  processingTime: number;
  confidence: number;
}

// Context Types
export interface ICPAnalysisContextType {
  icpData: ICPData | null;
  ratingFramework: RatingFramework | null;
  buyerPersonas: BuyerPersona[];
  technicalTranslations: TechnicalTranslation[];
  loading: boolean;
  error: string | null;
  updateICPData: (data: ICPData) => void;
  updateRatingFramework: (framework: RatingFramework) => void;
  updateBuyerPersonas: (personas: BuyerPersona[]) => void;
  addTechnicalTranslation: (translation: TechnicalTranslation) => void;
  clearError: () => void;
}

// Utility Types
export type ICPWidgetType = 'product-details' | 'overview' | 'rating-system' | 'rate-company' | 'buyer-personas' | 'technical-translator';

export type ICPPriority = 'high' | 'medium' | 'low';

export type ICPConfidence = 'low' | 'medium' | 'high' | 'very-high';

export type ExportTool = 'claude' | 'chatgpt' | 'hubspot' | 'salesforce' | 'outreach' | 'salesloft' | 'pdf' | 'docx' | 'pptx';

// Error Types
export interface ICPError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
}

// Analytics Types
export interface ICPAnalytics {
  widgetViews: Record<ICPWidgetType, number>;
  exportCounts: Record<ExportTool, number>;
  averageSessionTime: number;
  completionRates: Record<ICPWidgetType, number>;
  userSatisfaction: number;
  lastUpdated: Date;
}
