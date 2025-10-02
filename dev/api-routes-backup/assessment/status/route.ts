import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import assessmentService from '@/lib/services/AssessmentService';
import { 
  validateQueryParams,
  validateResponseData,
  createValidationContext,
  getValidationConfig,
  AssessmentStatusRequestSchema,
  AssessmentStatusResponseSchema,
  type AssessmentStatusRequest,
  type AssessmentStatusResponse
} from '@/lib/validation';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

// Using AssessmentStatusResponse from validation schemas

/**
 * GET /api/assessment/status
 * 
 * Checks if the current user has completed an assessment and returns
 * their current level, tool access, and progress data.
 */
export const GET = requireAuth(async (request: NextRequest, auth: AuthContext): Promise<NextResponse<AssessmentStatusResponse>> => {
  try {
    const supabase = await createClient();
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Validate query parameters
    const queryParams = new URL(request.url).searchParams;
    const queryValidation = validateQueryParams(queryParams, AssessmentStatusRequestSchema, validationConfig);
    
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

    const validatedParams = queryValidation.data as AssessmentStatusRequest;
    
    // Get user's assessment data
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', auth.user.id)
      .single();

    if (assessmentError && assessmentError.code !== 'PGRST116') {
      console.error('Error fetching assessment data:', assessmentError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch assessment data'
      }, { status: 500 });
    }

    if (!assessmentData) {
      return NextResponse.json({
        success: true,
        message: 'No assessment data found',
        data: {
          hasAssessment: false
        }
      });
    }

    // Get current level information
    const level = assessmentService.getLevelInfo(assessmentData.current_level);
    
    // Determine tool access based on scores
    const toolAccess = {
      icpAnalysis: assessmentData.overall_score >= 30,
      costCalculator: assessmentData.cost_calculator_unlocked,
      businessCaseBuilder: assessmentData.business_case_unlocked,
      advancedAnalytics: assessmentData.overall_score >= 70,
      customFrameworks: assessmentData.overall_score >= 80
    };

    // Prepare response data
    const responseData: AssessmentStatusResponse = {
      success: true,
      message: 'Assessment status retrieved successfully',
      status: {
        hasAssessment: true,
        currentLevel: level?.name as any,
        progress: assessmentData.total_points,
        lastUpdated: assessmentData.last_updated,
        toolAccess: Object.keys(toolAccess).filter(key => toolAccess[key as keyof typeof toolAccess])
      }
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      AssessmentStatusResponseSchema,
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
    console.error('Error in assessment status API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
});