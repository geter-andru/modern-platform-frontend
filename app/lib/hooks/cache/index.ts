/**
 * Cache Hooks Index
 * 
 * Central export point for all Phase 5, Chunk 1 cache hooks.
 * Provides unified access to intelligent caching capabilities across the application.
 * 
 * Phase 5, Chunk 1: TanStack Query Cache Hooks Implementation
 */

// Core cache hooks
export { useCustomerCache, useGenerateICP, useTrackProgress } from './useCustomerCache';
export { usePersonasCache, useGeneratePersonas } from './usePersonasCache';
export { useCompanyRatingCache, useAnalyzeCompany } from './useCompanyRatingCache';

// Types and constants
export type {
  CustomerData,
  ICPData,
  ProgressData,
  BuyerPersona,
  PersonasData,
  CompanyRating,
  UseCustomerCacheReturn,
  UsePersonasCacheReturn,
  UseCompanyRatingCacheReturn,
  CacheConfig
} from './types';

export {
  QUERY_KEYS,
  DEFAULT_CACHE_CONFIG,
  SHORT_CACHE_CONFIG,
  LONG_CACHE_CONFIG
} from './types';

// Re-export convenience functions for backward compatibility
export { modernApiClient as api } from '@/app/lib/api/modern-client';




