import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import { 
  validateQueryParams,
  validateResponseData,
  createValidationContext,
  getValidationConfig,
  AssessmentSummaryRequestSchema,
  AssessmentSummaryResponseSchema,
  type AssessmentSummaryRequest,
  type AssessmentSummaryResponse
} from '@/lib/validation';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Validate query parameters
    const queryParams = new URL(request.url).searchParams;
    const queryValidation = validateQueryParams(queryParams, AssessmentSummaryRequestSchema, validationConfig);
    
    if (!queryValidation.success) {
      console.error('❌ Query parameter validation failed:', queryValidation.errors);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.errors 
        },
        { status: 400 }
      );
    }

    const validatedParams = queryValidation.data as AssessmentSummaryRequest;
    console.log('🔍 Fetching assessment summary for dashboard baselines - user:', auth.user.id, 'with params:', validatedParams);

    // Query the assessment_sessions table for this user
    const { data: assessmentSessions, error: queryError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('❌ Error querying assessment_sessions:', queryError);
      return NextResponse.json(
        { error: 'Failed to fetch assessment summary' },
        { status: 500 }
      );
    }

    if (!assessmentSessions || assessmentSessions.length === 0) {
      console.log('⚠️ No assessment data found for dashboard baselines - user:', auth.user.id);
      
      const responseData: AssessmentSummaryResponse = {
        hasAssessmentData: false,
        message: 'No assessment data found for dashboard baselines',
        baselines: null
      };

      // Validate response data
      const responseValidation = await validateResponseData(
        responseData,
        AssessmentSummaryResponseSchema,
        validationContext,
        validationConfig
      );

      if (!responseValidation.success) {
        console.error('❌ Response validation failed:', responseValidation.errors);
      }

      return NextResponse.json(responseData, { status: 200 });
    }

    const latestSession = assessmentSessions[0];
    console.log('✅ Found assessment session for baselines:', latestSession.id);

    // Parse the assessment_data JSON
    let assessmentData;
    try {
      assessmentData = typeof latestSession.assessment_data === 'string' 
        ? JSON.parse(latestSession.assessment_data)
        : latestSession.assessment_data;
    } catch (parseError) {
      console.error('❌ Error parsing assessment_data:', parseError);
      return NextResponse.json(
        { error: 'Invalid assessment data format' },
        { status: 500 }
      );
    }

    // Create dashboard baselines from assessment data
    const dashboardBaselines = {
      // Core Performance Metrics
      overallScore: latestSession.overall_score || 0,
      buyerScore: latestSession.buyer_score || 0,
      techScore: assessmentData.results?.techScore || 0,
      qualification: assessmentData.results?.qualification || 'Developing',
      
      // Professional Level Classification
      professionalLevel: getProfessionalLevel(latestSession.overall_score || 0),
      percentile: getPercentile(latestSession.overall_score || 0),
      
      // Key Performance Indicators
      buyerGap: assessmentData.generatedContent?.buyerGap || 0,
      hasProductInfo: !!assessmentData.productInfo,
      hasChallenges: !!(assessmentData.challenges && assessmentData.challenges.length > 0),
      hasRecommendations: !!(assessmentData.recommendations && assessmentData.recommendations.length > 0),
      
      // Assessment Metadata
      assessmentDate: latestSession.created_at,
      lastUpdated: latestSession.updated_at,
      sessionId: latestSession.session_id,
      
      // Dashboard Integration Flags
      canGenerateICP: (latestSession.overall_score || 0) > 0,
      canBuildBusinessCase: (latestSession.overall_score || 0) > 30,
      canAccessAdvancedFeatures: (latestSession.overall_score || 0) > 50,
      
      // Progress Tracking Baselines
      baselineMetrics: {
        customerUnderstanding: latestSession.buyer_score || 0,
        technicalTranslation: assessmentData.results?.techScore || 0,
        overallReadiness: latestSession.overall_score || 0
      },
      
      // Improvement Areas
      improvementAreas: getImprovementAreas(latestSession.overall_score || 0, latestSession.buyer_score || 0, assessmentData.results?.techScore || 0),
      
      // Strength Areas
      strengthAreas: getStrengthAreas(latestSession.overall_score || 0, latestSession.buyer_score || 0, assessmentData.results?.techScore || 0)
    };

    console.log('✅ Dashboard baselines created successfully');

    // Prepare response data
    const responseData: AssessmentSummaryResponse = {
      hasAssessmentData: true,
      message: 'Assessment baselines retrieved successfully',
      baselines: dashboardBaselines
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      AssessmentSummaryResponseSchema,
      validationContext,
      validationConfig
    );

    if (!responseValidation.success) {
      console.error('❌ Response validation failed:', responseValidation.errors);
      // In production, you might want to return a sanitized response
      // For now, we'll log the warning but return the original response
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Unexpected error in assessment summary API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching assessment summary'
      },
      { status: 500 }
    );
  }
});

// Helper functions for dashboard baselines
function getProfessionalLevel(score: number): string {
  if (score >= 80) return 'Revenue Intelligence Master';
  if (score >= 70) return 'Strategic Revenue Leader';
  if (score >= 60) return 'Revenue Competent';
  if (score >= 50) return 'Revenue Developing';
  return 'Revenue Foundation';
}

function getPercentile(score: number): number {
  return Math.min(95, Math.floor(score * 1.2));
}

function getImprovementAreas(overallScore: number, buyerScore: number, techScore: number): string[] {
  const areas: string[] = [];
  
  if (buyerScore < 70) {
    areas.push('Customer Discovery & Buyer Understanding');
  }
  
  if (techScore < 70) {
    areas.push('Technical Value Translation');
  }
  
  if (overallScore < 60) {
    areas.push('Revenue Execution Fundamentals');
  }
  
  if (overallScore >= 70) {
    areas.push('Advanced Revenue Scaling');
  }
  
  return areas;
}

function getStrengthAreas(overallScore: number, buyerScore: number, techScore: number): string[] {
  const areas: string[] = [];
  
  if (buyerScore >= 70) {
    areas.push('Customer Understanding');
  }
  
  if (techScore >= 70) {
    areas.push('Technical Communication');
  }
  
  if (overallScore >= 70) {
    areas.push('Revenue Strategy');
  }
  
  return areas;
}

