// Common TypeScript interfaces to replace 'any' types
// This file provides proper typing for commonly used data structures

// Re-export types from other modules to avoid conflicts
export type { ApiResponseType as ApiResponse, ApiErrorType as ApiError } from './api.types';
export type { CustomerType as Customer } from './customer.types';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

// Dashboard and Analytics Types
export interface DashboardData {
  id: string;
  name: string;
  metrics: Record<string, number>;
  lastUpdated: string;
}

export interface CompetencyData {
  id: string;
  category: string;
  score: number;
  progress: number;
  baseline?: number;
  target?: number;
}

export interface ActivityData {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
  customerId: string;
}

// ICP Analysis Types
export interface ICPAnalysisData {
  id: string;
  name: string;
  rating: number;
  criteria: ICPRatingCriteria[];
  createdAt: string;
  updatedAt: string;
}

export interface ICPRatingCriteria {
  id: string;
  name: string;
  weight: number;
  score: number;
  description?: string;
}

// Resource Library Types
export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  content: string;
  quality: number;
  createdAt: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  resources: ResourceItem[];
}

// Form and Input Types
export interface FormData {
  [key: string]: string | number | boolean | string[] | File | null;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Event and Action Types
export interface EventData {
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

export interface ActionData {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

// UI Component Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Service and Integration Types
export interface ServiceConfig {
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
  lastCheck?: string;
  status?: 'healthy' | 'degraded' | 'down';
}

export interface IntegrationData {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
}

// Research and Analysis Types
export interface ResearchData {
  id: string;
  query: string;
  results: ResearchResult[];
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface ResearchResult {
  title: string;
  url: string;
  content: string;
  relevance: number;
  source: string;
}

// Progress and Milestone Types
export interface ProgressData {
  id: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  lastUpdated: string;
}

export interface MilestoneData {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedAt?: string;
  targetDate?: string;
  points: number;
}

// Generic Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
