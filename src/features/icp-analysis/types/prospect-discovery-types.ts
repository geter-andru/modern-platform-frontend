/**
 * Prospect Discovery Types
 * Types for the authenticated prospect discovery feature using Claude AI + web search
 */

// Request Types
export interface ProspectDiscoveryRequest {
  companyName: string;
  refinedProductDescription: string;
  coreCapability: string;
  industry?: string;
  targetMarket?: string;
}

// Response Types
export interface ProspectDiscoveryResponse {
  success: boolean;
  data?: ProspectDiscoveryData;
  error?: string;
  fallback?: ProspectDiscoveryData;
  message?: string;
  metadata?: ProspectDiscoveryMetadata;
}

export interface ProspectDiscoveryData {
  prospects: Prospect[];
  searchSummary: SearchSummary;
}

// Prospect Types
export interface Prospect {
  companyName: string;
  website: string;
  headquarters: string;
  productCategory: string;
  estimatedStage: string;
  icpFitEvidence: string[];
  confidenceRating: number; // 1-10
  ratingJustification: string;
  evidenceLinks: EvidenceLinks;
}

export interface EvidenceLinks {
  linkedinCompany?: string;
  founderLinkedIn?: string;
  fundingData?: string;
  painSignal?: string;
  [key: string]: string | undefined;
}

// Search Summary Types
export interface SearchSummary {
  totalProspectsIdentified: number;
  averageConfidenceRating: number;
  strongestSignalPatterns: string;
  searchChallengesEncountered: string;
  queriesUsed: number;
}

// Metadata Types
export interface ProspectDiscoveryMetadata {
  generatedAt: string;
  model: string;
  source: string;
  duration: number;
  requestDuration?: number;
  userId?: string;
  searchQueriesUsed?: number | string;
}

// UI State Types
export interface ProspectDiscoveryState {
  loading: boolean;
  error: string | null;
  data: ProspectDiscoveryData | null;
  metadata: ProspectDiscoveryMetadata | null;
  remainingAttempts?: number;
  rateLimitResetTime?: string;
}

// Rate Limit Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: string;
  windowHours: number;
}

export interface RateLimitError {
  success: false;
  error: string;
  retryAfter: string;
  limit: number;
  window: string;
}

// Confidence Tier Types
export type ConfidenceTier = 'excellent' | 'strong' | 'moderate' | 'weak';

export interface ConfidenceTierDefinition {
  tier: ConfidenceTier;
  minRating: number;
  maxRating: number;
  color: string;
  label: string;
  description: string;
}

// Component Props Types
export interface ProspectCardProps {
  prospect: Prospect;
  index: number;
  onViewDetails?: (prospect: Prospect) => void;
  className?: string;
}

export interface ProspectListProps {
  prospects: Prospect[];
  loading?: boolean;
  onViewDetails?: (prospect: Prospect) => void;
  className?: string;
}

export interface ProspectDiscoveryFormProps {
  onSubmit: (data: ProspectDiscoveryRequest) => Promise<void>;
  loading: boolean;
  initialData?: Partial<ProspectDiscoveryRequest>;
  className?: string;
}

export interface SearchSummaryProps {
  summary: SearchSummary;
  metadata: ProspectDiscoveryMetadata;
  className?: string;
}

export interface RateLimitBannerProps {
  rateLimitInfo: RateLimitInfo;
  className?: string;
}

// Utility Types
export type ProspectSortField = 'confidenceRating' | 'companyName' | 'estimatedStage';
export type SortDirection = 'asc' | 'desc';

export interface ProspectFilters {
  minConfidence?: number;
  maxConfidence?: number;
  productCategories?: string[];
  headquarters?: string[];
}

// Constant Definitions
export const CONFIDENCE_TIERS: ConfidenceTierDefinition[] = [
  {
    tier: 'excellent',
    minRating: 9,
    maxRating: 10,
    color: 'emerald',
    label: 'Excellent Fit',
    description: '4-5+ strong signals verified'
  },
  {
    tier: 'strong',
    minRating: 7,
    maxRating: 8,
    color: 'green',
    label: 'Strong Fit',
    description: '3-4 signals verified'
  },
  {
    tier: 'moderate',
    minRating: 5,
    maxRating: 6,
    color: 'yellow',
    label: 'Moderate Fit',
    description: '2-3 signals verified'
  },
  {
    tier: 'weak',
    minRating: 1,
    maxRating: 4,
    color: 'gray',
    label: 'Weak Fit',
    description: '1-2 signals present'
  }
];

// Helper Functions
export function getConfidenceTier(rating: number): ConfidenceTierDefinition {
  return CONFIDENCE_TIERS.find(
    tier => rating >= tier.minRating && rating <= tier.maxRating
  ) || CONFIDENCE_TIERS[CONFIDENCE_TIERS.length - 1];
}

export function formatConfidenceRating(rating: number): string {
  return `${rating}/10`;
}

export function isRateLimitError(error: any): error is RateLimitError {
  return error && error.retryAfter !== undefined;
}
