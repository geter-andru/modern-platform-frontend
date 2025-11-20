import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import type { AssessmentBaselines } from '@/src/shared/hooks/useAssessmentBaselines';

/**
 * GET /api/assessment/summary
 *
 * Maps assessment scores to dashboard capability baselines
 * This creates the bridge between assessment completion and dashboard tracking
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { hasAssessmentData: false, baselines: null },
        { status: 200 } // Return 200 with empty data for unauthenticated users
      );
    }

    // Fetch user's assessment from andru-assessment database
    // Note: This assumes we have cross-database access or a shared table
    // For now, we'll check the user_assessments table in modern-platform
    const { data: assessment, error: assessmentError } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // If no assessment found, return empty baselines
    if (assessmentError || !assessment) {
      console.log('⚠️ No assessment found for user:', user.id);
      return NextResponse.json({
        hasAssessmentData: false,
        baselines: null
      });
    }

    // Extract assessment scores
    const assessmentData = assessment.assessment_data || {};
    const buyerScore = assessmentData.buyerScore || 0;
    const techScore = assessmentData.techScore || 0;
    const overallScore = assessmentData.overallScore || 0;
    const qualification = assessmentData.qualification || 'Developing';

    // Determine professional level
    const professionalLevel = getProfessionalLevel(overallScore);
    const percentile = Math.min(Math.round(overallScore * 1.2), 99); // Approximate percentile

    // Map to dashboard capability baselines
    const baselines: AssessmentBaselines = {
      // Core Performance Metrics
      overallScore,
      buyerScore,
      techScore,
      qualification,

      // Professional Level Classification
      professionalLevel,
      percentile,

      // Key Performance Indicators
      buyerGap: Math.max(70 - buyerScore, 0), // Gap to "good" threshold
      hasProductInfo: assessmentData.hasProductInfo !== false,
      hasChallenges: assessmentData.hasChallenges !== false,
      hasRecommendations: Array.isArray(assessmentData.recommendations) && assessmentData.recommendations.length > 0,

      // Assessment Metadata
      assessmentDate: assessment.created_at,
      lastUpdated: assessment.updated_at,
      sessionId: assessment.id,

      // Dashboard Integration Flags
      canGenerateICP: buyerScore >= 40,
      canBuildBusinessCase: techScore >= 40,
      canAccessAdvancedFeatures: overallScore >= 60,

      // Progress Tracking Baselines
      // Map assessment scores → dashboard capability baselines
      baselineMetrics: {
        customerUnderstanding: buyerScore, // Maps to "Customer Intelligence"
        technicalTranslation: techScore,   // Maps to "Value Communication"
        overallReadiness: overallScore
      },

      // Improvement Areas (based on score thresholds)
      improvementAreas: getImprovementAreas(buyerScore, techScore),

      // Strength Areas
      strengthAreas: getStrengthAreas(buyerScore, techScore)
    };

    console.log('✅ Assessment baselines mapped successfully:', {
      userId: user.id,
      buyerScore,
      techScore,
      overallScore
    });

    return NextResponse.json({
      hasAssessmentData: true,
      baselines
    });

  } catch (error) {
    console.error('❌ Failed to fetch assessment summary:', error);
    return NextResponse.json(
      {
        hasAssessmentData: false,
        baselines: null,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * Helper: Determine professional level from overall score
 */
function getProfessionalLevel(score: number): string {
  if (score >= 90) return 'Master';
  if (score >= 80) return 'Advanced';
  if (score >= 70) return 'Proficient';
  if (score >= 60) return 'Developing';
  if (score >= 50) return 'Foundation';
  return 'Early Stage';
}

/**
 * Helper: Identify improvement areas based on capability scores
 */
function getImprovementAreas(buyerScore: number, techScore: number): string[] {
  const areas: string[] = [];

  if (buyerScore < 60) {
    areas.push('Customer Intelligence - Deepen understanding of buyer needs and pain points');
  }
  if (techScore < 60) {
    areas.push('Value Communication - Improve technical translation to business value');
  }
  if (buyerScore < 70 && buyerScore >= 60) {
    areas.push('Customer Intelligence - Move from good to excellent buyer understanding');
  }
  if (techScore < 70 && techScore >= 60) {
    areas.push('Value Communication - Strengthen value articulation frameworks');
  }

  return areas;
}

/**
 * Helper: Identify strength areas based on capability scores
 */
function getStrengthAreas(buyerScore: number, techScore: number): string[] {
  const areas: string[] = [];

  if (buyerScore >= 70) {
    areas.push('Customer Intelligence - Strong foundation in buyer understanding');
  }
  if (techScore >= 70) {
    areas.push('Value Communication - Excellent technical-to-business translation');
  }
  if (buyerScore >= 60 && buyerScore < 70) {
    areas.push('Customer Intelligence - Solid buyer intelligence capability');
  }
  if (techScore >= 60 && techScore < 70) {
    areas.push('Value Communication - Good value articulation skills');
  }

  return areas;
}
