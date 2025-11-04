/**
 * Cache Hook Types
 * 
 * Type definitions for Phase 5, Chunk 1: TanStack Query Cache Hooks
 * Provides type safety for all cache-related operations across widgets.
 */

// Base cache configuration
export interface CacheConfig {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean | 'always';
  retry?: boolean | number | ((failureCount: number, error: any) => boolean);
  retryDelay?: number | ((attemptIndex: number) => number);
}

// Customer/ICP Data Types
export interface CustomerData {
  customerId: string;
  customerName: string;
  company: string;
  email: string;
  contentStatus: string;
  paymentStatus: string;
  icpContent?: any;
  costCalculatorContent?: any;
  businessCaseContent?: any;
  toolAccessStatus?: string;
  lastAccessed?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICPData {
  title: string;
  description: string;
  segments: Array<{
    name: string;
    score: number;
    criteria: string[];
  }>;
  keyIndicators: string[];
  redFlags?: string[];
  ratingCriteria: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
  confidence?: number;
  generatedAt?: string;
  source?: string;
}

// Personas Data Types
export interface BuyerPersona {
  id: string;
  name: string;
  title: string;
  company: string;
  demographics: {
    age: string;
    location: string;
    industry: string;
    companySize: string;
  };
  psychographics: {
    goals: string[];
    challenges: string[];
    motivations: string[];
    painPoints: string[];
  };
  behavior: {
    preferredChannels: string[];
    decisionMakingProcess: string;
    buyingTriggers: string[];
    objections: string[];
  };
  contactStrategy: {
    bestApproach: string;
    messaging: string[];
    timing: string;
    followUp: string;
  };
  confidence: number;
  generatedAt: string;
}

export interface PersonasData {
  personas: BuyerPersona[];
  summary: {
    totalPersonas: number;
    averageConfidence: number;
    keyInsights: string[];
  };
  generatedAt: string;
  source: string;
}

// Company Rating Data Types
export interface CompanyRating {
  companyName: string;
  generatedAt: string;
  confidence: number;
  overallScore: number;
  tier: {
    id: string;
    name: string;
  };
  recommendation: string;
  criteria: Array<{
    criteriaId: string;
    criteriaName: string;
    score: number;
    weight: number;
    weightedScore: number;
    explanation: string;
    evidence?: string[];
  }>;
  insights: Array<{
    type: string;
    message: string;
    actionable: boolean;
  }>;
  salesActions: Array<{
    id: string;
    title: string;
    description: string;
    timeline: string;
    priority: string;
    expectedOutcome: string;
    resources?: string[];
  }>;
}

// Progress Data Types
export interface ProgressData {
  overallProgress: number;
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: string;
    metadata?: any;
  }>;
  insights: Array<{
    type: string;
    message: string;
    actionable: boolean;
    priority: 'low' | 'medium' | 'high';
  }>;
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    timeline: string;
  }>;
}

// Cache Hook Return Types
export interface UseCustomerCacheReturn {
  // Data
  customer: CustomerData | undefined;
  icpData: ICPData | undefined;
  progress: ProgressData | undefined;
  
  // Loading states
  isLoadingCustomer: boolean;
  isLoadingICP: boolean;
  isLoadingProgress: boolean;
  isLoading: boolean; // Any loading
  
  // Error states
  customerError: Error | null;
  icpError: Error | null;
  progressError: Error | null;
  hasError: boolean; // Any error
  
  // Actions
  refetchCustomer: () => void;
  refetchICP: () => void;
  refetchProgress: () => void;
  refetchAll: () => void;
  
  // Cache management
  invalidateCustomer: () => void;
  invalidateICP: () => void;
  invalidateProgress: () => void;
  invalidateAll: () => void;
  
  // Optimistic updates
  updateCustomer: (updates: Partial<CustomerData>) => void;
  updateICP: (updates: Partial<ICPData>) => void;
  updateProgress: (updates: Partial<ProgressData>) => void;
}

export interface UsePersonasCacheReturn {
  // Data
  personas: BuyerPersona[];
  personasData: PersonasData | undefined;
  
  // Loading states
  isLoadingPersonas: boolean;
  isGeneratingPersonas: boolean;
  
  // Error states
  personasError: Error | null;
  generationError: Error | null;
  hasError: boolean;
  
  // Actions
  refetchPersonas: () => void;
  generatePersonas: (context: {
    companyContext: string;
    industry: string;
    targetMarket: string;
  }) => Promise<void>;
  
  // Cache management
  invalidatePersonas: () => void;
  
  // Optimistic updates
  updatePersonas: (personas: BuyerPersona[]) => void;
  addPersona: (persona: BuyerPersona) => void;
  removePersona: (personaId: string) => void;
}

export interface UseCompanyRatingCacheReturn {
  // Data
  ratings: CompanyRating[];
  currentRating: CompanyRating | undefined;
  
  // Loading states
  isLoadingRatings: boolean;
  isAnalyzingCompany: boolean;
  
  // Error states
  ratingsError: Error | null;
  analysisError: Error | null;
  hasError: boolean;
  
  // Actions
  refetchRatings: () => void;
  analyzeCompany: (companyName: string, userId?: string) => Promise<void>;
  
  // Cache management
  invalidateRatings: () => void;
  
  // Optimistic updates
  addRating: (rating: CompanyRating) => void;
  updateRating: (ratingId: string, updates: Partial<CompanyRating>) => void;
  removeRating: (ratingId: string) => void;
}

// Query Key Constants
export const QUERY_KEYS = {
  CUSTOMER: (customerId: string) => ['customer', customerId] as const,
  CUSTOMER_ICP: (customerId: string) => ['customer-icp', customerId] as const,
  CUSTOMER_PROGRESS: (customerId: string) => ['customer-progress', customerId] as const,
  PERSONAS: (customerId: string) => ['personas', customerId] as const,
  COMPANY_RATINGS: (customerId: string) => ['company-ratings', customerId] as const,
  COMPANY_RATING: (companyName: string, customerId: string) => ['company-rating', companyName, customerId] as const,
} as const;

// Default cache configurations
export const DEFAULT_CACHE_CONFIG: Required<CacheConfig> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: 'always',
  retry: (failureCount: number, error: any) => {
    // Don't retry on authentication errors
    if (error?.code === 'AUTH_ERROR') return false;
    // Don't retry on validation errors
    if (error?.code === 'VALIDATION_ERROR') return false;
    // Retry network errors up to 3 times
    return failureCount < 3;
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// Short-lived cache for real-time data
export const SHORT_CACHE_CONFIG: Required<CacheConfig> = {
  ...DEFAULT_CACHE_CONFIG,
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 2 * 60 * 1000, // 2 minutes
};

// Long-lived cache for static data
export const LONG_CACHE_CONFIG: Required<CacheConfig> = {
  ...DEFAULT_CACHE_CONFIG,
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
};




