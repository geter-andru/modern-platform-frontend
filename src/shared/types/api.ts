// Comprehensive API type definitions to replace 'any' types

// ===== CORE DATA TYPES =====

export interface ICPData {
  id: string;
  name: string;
  description: string;
  industry: string;
  companySize: string;
  revenue: string;
  painPoints: string[];
  goals: string[];
  decisionMakers: string[];
  budget: string;
  timeline: string;
  technology: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  features: string[];
  benefits: string[];
  pricing: {
    model: string;
    tiers: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
  };
  integrations: string[];
  targetAudience: string[];
}

export interface Persona {
  id: string;
  name: string;
  title: string;
  department: string;
  responsibilities: string[];
  painPoints: string[];
  goals: string[];
  communicationStyle: string;
  decisionMakingProcess: string;
  influence: 'low' | 'medium' | 'high';
  demographics: {
    age: string;
    experience: string;
    education: string;
  };
  technology: {
    preferred: string[];
    current: string[];
    comfort: 'low' | 'medium' | 'high';
  };
  quotes: string[];
  objections: string[];
  successMetrics: string[];
}

// ===== API REQUEST/RESPONSE TYPES =====

export interface PersonaGenerationRequest {
  icpData: ICPData;
  productData?: ProductData;
  customerId?: string;
}

export interface PersonaGenerationResponse {
  success: boolean;
  data?: {
    personas: Persona[];
    confidence: number;
    methodology: string;
  };
  error?: string;
}

export interface AgentExecutionRequest {
  agentType: string;
  context: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    issue: string;
    context?: Record<string, string | number | boolean | object>;
    userId?: string;
    sessionId?: string;
    timestamp?: number;
  };
  prompt: string;
  userId: string;
  sessionId?: string;
}

export interface AgentExecutionResponse {
  success: boolean;
  data?: {
    result: string;
    confidence: number;
    executionTime: number;
    metadata: Record<string, string | number | boolean>;
  };
  error?: string;
}

// ===== COMPETENCY TYPES =====

export interface CompetencyAction {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  prerequisites: string[];
  resources: string[];
}

export interface CompetencyAnalytics {
  overallScore: number;
  categoryScores: {
    customerAnalysis: number;
    valueCommunication: number;
    salesExecution: number;
  };
  progressTrend: {
    period: string;
    score: number;
    change: number;
    velocity: {
      weekly: number;
      monthly: number;
      quarterly: number;
      period: string;
      pointsGained: number;
    };
    date: string;
    customerAnalysis: number;
    valueCommunication: number;
    salesExecution: number;
    overallScore: number;
    points: number;
  };
  recommendations: Array<{
    type: string;
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    estimatedTime: string;
    resources: string[];
    prerequisites: string[];
  }>;
  industryBenchmark: {
    industry: string;
    averageScore: number;
    topQuartile: number;
    position: number;
    metric: string;
    userValue: number;
  };
  progressVelocity: { velocity: number };
  lastUpdated: string;
  analyticsPeriod: string;
}

// ===== BEHAVIORAL TRACKING TYPES =====

export interface BehavioralEvent {
  id: string;
  userId: string;
  eventType: string;
  timestamp: string;
  data: Record<string, string | number | boolean | object>;
  sessionId?: string;
  pageUrl?: string;
  userAgent?: string;
}

export interface CustomizationData {
  type: string;
  timestamp: string;
  data: Record<string, string | number | boolean | object>;
}

// ===== EXPORT TYPES =====

export interface ExportRequest {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  data: {
    type: string;
    filters?: Record<string, string | number | boolean>;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  customerId: string;
  userId: string;
}

export interface ExportResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    filename: string;
    size: number;
    expiresAt: string;
  };
  error?: string;
}

// ===== GENERIC UTILITY TYPES =====

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, string | number | boolean>;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ContextData = Record<string, string | number | boolean | object>;

// ===== ASSESSMENT TYPES =====

export interface AssessmentSession {
  id: string;
  customerId: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  metadata: Record<string, string | number | boolean>;
}

export interface AssessmentData {
  id: string;
  sessionId: string;
  customerId: string;
  productInfo: {
    name: string;
    description: string;
    features: string[];
    benefits: string[];
  };
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    impact: string;
    solutions: string[];
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    implementation: string;
    expectedOutcome: string;
    timeline: string;
  }>;
  insights: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    confidence: number;
    supportingData: string[];
    implications: string[];
  }>;
  summary: {
    overallScore: number;
    keyFindings: string[];
    nextSteps: string[];
    riskAssessment: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExportData {
  format: 'pdf' | 'docx' | 'csv' | 'json' | 'txt';
  content: string | Buffer;
  filename: string;
  mimeType: string;
  size: number;
}

// ===== ERROR TYPES =====

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
  timestamp: string;
  requestId?: string;
}
