'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { CacheService } from '../services/cacheService';

export interface AssessmentBaselines {
  // Core Performance Metrics
  overallScore: number;
  buyerScore: number;
  techScore: number;
  qualification: 'Qualified' | 'Promising' | 'Developing' | 'Early Stage';
  
  // Professional Level Classification
  professionalLevel: string;
  percentile: number;
  
  // Key Performance Indicators
  buyerGap: number;
  hasProductInfo: boolean;
  hasChallenges: boolean;
  hasRecommendations: boolean;
  
  // Assessment Metadata
  assessmentDate: string;
  lastUpdated: string;
  sessionId: string;
  
  // Dashboard Integration Flags
  canGenerateICP: boolean;
  canBuildBusinessCase: boolean;
  canAccessAdvancedFeatures: boolean;
  
  // Progress Tracking Baselines
  baselineMetrics: {
    customerUnderstanding: number;
    technicalTranslation: number;
    overallReadiness: number;
  };
  
  // Improvement Areas
  improvementAreas: string[];
  
  // Strength Areas
  strengthAreas: string[];
}

export interface UseAssessmentBaselinesReturn {
  baselines: AssessmentBaselines | null;
  loading: boolean;
  error: string | null;
  hasAssessmentData: boolean;
  refetch: () => Promise<void>;
}

export function useAssessmentBaselines(): UseAssessmentBaselinesReturn {
  const [baselines, setBaselines] = useState<AssessmentBaselines | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAssessmentData, setHasAssessmentData] = useState(false);
  const { user } = useSupabaseAuth();

  const fetchBaselines = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = `${CacheService.KEYS.ASSESSMENT_SUMMARY}_${user.id}`;
      const cachedData = CacheService.get<{ hasAssessmentData: boolean; baselines: AssessmentBaselines | null }>(cacheKey);
      
      if (cachedData) {
        console.log('📦 Using cached assessment baselines');
        setBaselines(cachedData.baselines);
        setHasAssessmentData(cachedData.hasAssessmentData);
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching assessment baselines for dashboard...');

      const response = await fetch('/api/assessment/summary');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment baselines: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.hasAssessmentData && data.baselines) {
        console.log('✅ Assessment baselines loaded:', data.baselines);
        setBaselines(data.baselines);
        setHasAssessmentData(true);
        
        // Cache the data
        CacheService.set(cacheKey, {
          hasAssessmentData: true,
          baselines: data.baselines
        }, CacheService.TTL.ASSESSMENT_SUMMARY);
      } else {
        console.log('⚠️ No assessment data available for baselines');
        setBaselines(null);
        setHasAssessmentData(false);
        
        // Cache the empty result
        CacheService.set(cacheKey, {
          hasAssessmentData: false,
          baselines: null
        }, CacheService.TTL.ASSESSMENT_SUMMARY);
      }
    } catch (err) {
      console.error('❌ Error fetching assessment baselines:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assessment baselines');
      setBaselines(null);
      setHasAssessmentData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaselines();
  }, [user]);

  return {
    baselines,
    loading,
    error,
    hasAssessmentData,
    refetch: fetchBaselines
  };
}
