/**
 * Technical Translation Integration Service
 * Integrates with ICP Analysis to automatically generate technical translations
 * Priority #3: Two-Level Stakeholder Technical Translation Integration
 */

import technicalTranslationService from '@/src/lib/services/TechnicalTranslationService';
import type { BuyerPersona, TranslationResult } from '@/src/lib/services/TechnicalTranslationService';
// Import singleton Supabase client (DO NOT create new instances - causes session conflicts)
import { supabase } from '@/app/lib/supabase/client';

export interface ICPAnalysisData {
  id?: string;
  companyName: string;
  industry: string;
  buyerPersonas?: BuyerPersona[];
  technicalFeatures?: Array<{
    name: string;
    improvement: string;
    description?: string;
  }>;
  currentARR?: string;
  targetARR?: string;
  timeline?: string;
  [key: string]: any;
}

export interface TechnicalTranslationIntegrationResult {
  success: boolean;
  translations: Array<{
    technicalMetric: string;
    improvement: string;
    result: TranslationResult;
  }>;
  error?: string;
}

/**
 * Generate technical translations for ICP analysis data
 */
export async function generateTranslationsForICP(icpData: ICPAnalysisData): Promise<TechnicalTranslationIntegrationResult> {
  try {
    console.log('🔄 Generating technical translations for ICP analysis...');

    // Check if ICP has buyer personas
    let personas = icpData.buyerPersonas;
    
    if (!personas || personas.length === 0) {
      console.log('⚠️ No buyer personas found, generating fallback personas...');
      personas = generateFallbackPersonas(icpData);
    }

    // Check if ICP has technical features
    let technicalFeatures = icpData.technicalFeatures;
    
    if (!technicalFeatures || technicalFeatures.length === 0) {
      console.log('⚠️ No technical features found, generating fallback features...');
      technicalFeatures = generateFallbackTechnicalFeatures(icpData);
    }

    // Defensive guard: Ensure fallback function returned a valid array
    if (!Array.isArray(technicalFeatures)) {
      console.error('❌ technicalFeatures is not an array after fallback:', technicalFeatures);
      throw new Error('Failed to generate technical features: Invalid data format');
    }

    const translations = [];

    // Generate translations for each technical feature
    for (const feature of technicalFeatures) {
      console.log(`📝 Generating translation for: ${feature.name} (${feature.improvement})`);
      
      const result = technicalTranslationService.translateTechnicalMetric({
        technicalMetric: feature.name,
        improvement: feature.improvement,
        industry: icpData.industry,
        targetPersonas: personas,
        includeInternalStakeholders: true,
        customerContext: {
          name: icpData.companyName,
          industry: icpData.industry,
          currentARR: icpData.currentARR,
          targetARR: icpData.targetARR,
          timeline: icpData.timeline
        }
      });

      translations.push({
        technicalMetric: feature.name,
        improvement: feature.improvement,
        result: result
      });
    }

    console.log(`✅ Generated ${translations.length} technical translations with ${personas.length} personas + 3 CXOs`);

    return {
      success: true,
      translations
    };

  } catch (error) {
    console.error('❌ Failed to generate technical translations:', error);
    return {
      success: false,
      translations: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Save technical translations to Supabase
 */
export async function saveTranslationsToSupabase(
  translations: Array<{ technicalMetric: string; improvement: string; result: TranslationResult }>,
  icpAnalysisId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('💾 Saving technical translations to Supabase...');

    // Defensive guard: Validate translations array parameter
    if (!Array.isArray(translations)) {
      console.error('❌ saveTranslationsToSupabase received non-array translations:', translations);
      return {
        success: false,
        error: 'Invalid translations parameter: expected array'
      };
    }

    if (translations.length === 0) {
      console.warn('⚠️ No translations to save');
      return { success: true };
    }

    // Use singleton Supabase client (already imported at top)
    // Save each translation
    for (const translation of translations) {
      const { error } = await supabase.from('technical_translations').insert({
        icp_analysis_id: icpAnalysisId,
        technical_metric: translation.technicalMetric,
        improvement: translation.improvement,
        industry: translation.result.industry,
        buyer_persona_translations: translation.result.targetBuyerTranslations,
        internal_stakeholder_translations: translation.result.internalStakeholderTranslations,
        total_stakeholders: translation.result.stakeholderMap.totalStakeholders,
        stakeholder_map: translation.result.stakeholderMap,
        business_translation: translation.result.businessTranslation,
        competitive_positioning: translation.result.competitivePositioning,
        supporting_evidence: translation.result.supportingEvidence,
        usage_instructions: translation.result.usageInstructions
      } as any); // Type assertion for TS inference issue

      if (error) {
        console.error('❌ Failed to save translation:', error);
        throw error;
      }
    }

    console.log(`✅ Saved ${translations.length} technical translations to database`);
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to save translations to Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate fallback personas when ICP doesn't have buyer personas
 */
function generateFallbackPersonas(icpData: ICPAnalysisData): BuyerPersona[] {
  const industry = icpData.industry || 'Technology';
  const companyName = icpData.companyName || 'Target Company';
  
  return [
    {
      id: 'fallback-ceo',
      name: 'Alex Johnson',
      title: 'CEO & Co-Founder',
      role: 'CEO',
      goals: [
        `Scale ${companyName} to next growth stage`,
        'Improve operational efficiency',
        'Drive revenue growth'
      ],
      painPoints: [
        'Scaling challenges',
        'Resource constraints', 
        'Market competition'
      ],
      values: ['Growth', 'Innovation', 'Team building'],
      decisionCriteria: ['ROI', 'Scalability', 'Team impact'],
      communicationStyle: 'Direct, results-focused'
    },
    {
      id: 'fallback-vp-sales',
      name: 'Jordan Martinez',
      title: 'VP Sales',
      role: 'VP Sales',
      goals: [
        'Improve win rates',
        'Shorten sales cycles',
        'Build predictable pipeline'
      ],
      painPoints: [
        'Long sales cycles',
        'Low conversion rates',
        'Difficulty articulating value'
      ],
      values: ['Results', 'Team success', 'Customer satisfaction'],
      decisionCriteria: ['Win rate improvement', 'Sales efficiency', 'Team enablement'],
      communicationStyle: 'Enthusiastic, outcome-focused'
    }
  ];
}

/**
 * Generate fallback technical features when ICP doesn't have them
 */
function generateFallbackTechnicalFeatures(icpData: ICPAnalysisData): Array<{ name: string; improvement: string; description?: string }> {
  const industry = icpData.industry || 'Technology';
  
  // Industry-specific fallback features
  const industryFeatures: Record<string, Array<{ name: string; improvement: string; description?: string }>> = {
    'Healthcare': [
      { name: 'claims processing speed', improvement: '10x faster', description: 'Automated claims processing' },
      { name: 'patient data accuracy', improvement: '99.5% accuracy', description: 'Improved data quality' }
    ],
    'Technology': [
      { name: 'development velocity', improvement: '3x faster', description: 'Faster software development' },
      { name: 'system reliability', improvement: '99.9% uptime', description: 'Improved system stability' }
    ],
    'Financial Services': [
      { name: 'transaction processing', improvement: '5x faster', description: 'Faster financial transactions' },
      { name: 'fraud detection', improvement: '95% accuracy', description: 'Better fraud prevention' }
    ],
    'Manufacturing': [
      { name: 'production efficiency', improvement: '40% improvement', description: 'Optimized manufacturing' },
      { name: 'quality control', improvement: '99% accuracy', description: 'Better quality assurance' }
    ]
  };

  return industryFeatures[industry] || [
    { name: 'operational efficiency', improvement: '50% improvement', description: 'General efficiency gains' },
    { name: 'process automation', improvement: '80% reduction', description: 'Automated manual processes' }
  ];
}

/**
 * Complete integration: Generate and save translations for ICP
 */
export async function integrateTechnicalTranslationsWithICP(icpData: ICPAnalysisData): Promise<{
  success: boolean;
  translations?: Array<{ technicalMetric: string; improvement: string; result: TranslationResult }>;
  error?: string;
}> {
  try {
    // Generate translations
    const translationResult = await generateTranslationsForICP(icpData);
    
    if (!translationResult.success) {
      return {
        success: false,
        error: translationResult.error
      };
    }

    // Save to Supabase if we have an ICP analysis ID
    if (icpData.id) {
      const saveResult = await saveTranslationsToSupabase(translationResult.translations, icpData.id);
      
      if (!saveResult.success) {
        console.warn('⚠️ Failed to save translations to database, but translations were generated');
      }
    }

    return {
      success: true,
      translations: translationResult.translations
    };

  } catch (error) {
    console.error('❌ Technical translation integration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}







