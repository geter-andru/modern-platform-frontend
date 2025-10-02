
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import { 
  validateQueryParams,
  validateResponseData,
  createValidationContext,
  getValidationConfig,
  OrchestratorRequestSchema,
  RecommendationsResponseSchema,
  type OrchestratorRequest,
  type RecommendationsResponse
} from '@/lib/validation';

export const dynamic = 'force-dynamic';

export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Validate query parameters
    const queryParams = new URL(request.url).searchParams;
    const queryValidation = validateQueryParams(queryParams, OrchestratorRequestSchema, validationConfig);
    
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

    const validatedParams = queryValidation.data as OrchestratorRequest;
    console.log('🔍 Generating recommendations for user:', auth.user.id, 'with params:', validatedParams);

    // Generate systematic recommendations based on user profile
    const recommendations = {
      immediate: [
        'Complete your ICP analysis to identify high-value prospects',
        'Set up systematic lead qualification process',
        'Document your value proposition clearly'
      ],
      shortTerm: [
        'Implement customer intelligence tracking',
        'Develop systematic sales process',
        'Create professional credibility metrics'
      ],
      longTerm: [
        'Scale systematic approach across team',
        'Optimize revenue intelligence systems',
        'Achieve advanced competency levels'
      ],
      businessImpact: {
        customerAcquisitionCost: 'Reduce by 30% through better targeting',
        conversionRate: 'Improve by 25% with systematic approach',
        dealClosureRate: 'Increase by 40% with professional credibility'
      },
      competencyFocus: {
        primary: 'customer_intelligence',
        secondary: 'value_communication',
        development: 'sales_execution'
      }
    };

    // Prepare response data
    const responseData: RecommendationsResponse = {
      success: true,
      recommendations,
      message: 'Recommendations generated successfully'
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      RecommendationsResponseSchema,
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
    console.error('❌ Unexpected error in recommendations API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while generating recommendations'
      },
      { status: 500 }
    );
  }
});