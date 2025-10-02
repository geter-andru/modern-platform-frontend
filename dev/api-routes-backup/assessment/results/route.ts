import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import { 
  validateQueryParams,
  validateResponseData,
  createValidationContext,
  getValidationConfig,
  AssessmentResultsRequestSchema,
  AssessmentResultsResponseSchema,
  type AssessmentResultsRequest,
  type AssessmentResultsResponse
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
    const queryValidation = validateQueryParams(queryParams, AssessmentResultsRequestSchema, validationConfig);
    
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

    const validatedParams = queryValidation.data as AssessmentResultsRequest;
    console.log('🔍 Fetching assessment data for user:', auth.user.id, 'with params:', validatedParams);

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
        { error: 'Failed to fetch assessment data' },
        { status: 500 }
      );
    }

    if (!assessmentSessions || assessmentSessions.length === 0) {
      console.log('⚠️ No assessment data found for user:', auth.user.id);
      return NextResponse.json(
        { assessmentData: null, message: 'No assessment data found' },
        { status: 200 }
      );
    }

    const latestSession = assessmentSessions[0];
    console.log('✅ Found assessment session:', latestSession.id);

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

    // Transform the data to match the expected format
    const transformedData = {
      results: {
        overallScore: latestSession.overall_score || 0,
        buyerScore: latestSession.buyer_score || 0,
        techScore: assessmentData.results?.techScore || 0,
        qualification: assessmentData.results?.qualification || 'Developing'
      },
      generatedContent: {
        buyerGap: assessmentData.generatedContent?.buyerGap,
        icp: assessmentData.generatedContent?.icp,
        tbp: assessmentData.generatedContent?.tbp
      },
      userInfo: {
        company: latestSession.company_name || 'Unknown Company',
        email: auth.user.email || '',
        name: auth.user.email || '', // We'll get this from user profile later
        role: auth.user.role || ''
      },
      productInfo: assessmentData.productInfo || null,
      questionTimings: assessmentData.questionTimings || {},
      challenges: assessmentData.challenges || null,
      recommendations: assessmentData.recommendations || null,
      insights: assessmentData.insights || null,
      metadata: {
        sessionId: latestSession.session_id,
        createdAt: latestSession.created_at,
        updatedAt: latestSession.updated_at,
        status: latestSession.status
      }
    };

    console.log('✅ Assessment data transformed successfully');

    // Prepare response data
    const responseData: AssessmentResultsResponse = {
      success: true,
      assessmentData: transformedData,
      message: 'Assessment data retrieved successfully'
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      AssessmentResultsResponseSchema,
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
    console.error('❌ Unexpected error in assessment results API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching assessment data'
      },
      { status: 500 }
    );
  }
});

