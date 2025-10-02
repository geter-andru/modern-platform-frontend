import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import { 
  validateQueryParams,
  validateResponseData,
  createValidationContext,
  getValidationConfig,
  ICPAnalysisRequestSchema,
  ICPAnalysisResponseSchema,
  type ICPAnalysisRequest,
  type ICPAnalysisResponse
} from '@/lib/validation';

export const dynamic = 'force-dynamic';

// In-memory storage (replace with database in production)
const icpStorage = new Map<string, any>();

export const GET = requireAuth(async (
  request: NextRequest,
  auth: AuthContext,
  { params }: { params: Promise<{ customerId: string }> }
) => {
  try {
    const supabase = await createClient();
    const { customerId } = await params;
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Validate customer ID
    if (!customerId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Customer ID is required',
          message: 'Customer ID parameter is missing'
        },
        { status: 400 }
      );
    }

    // Validate query parameters
    const queryParams = new URL(request.url).searchParams;
    const queryValidation = validateQueryParams(queryParams, ICPAnalysisRequestSchema, validationConfig);
    
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

    const validatedParams = queryValidation.data as ICPAnalysisRequest;
    console.log('🔍 Fetching ICP analysis for customer:', customerId, 'with params:', validatedParams);

    // Get ICP data from storage
    const icpData = icpStorage.get(customerId);

    if (!icpData) {
      const responseData: ICPAnalysisResponse = {
        success: false,
        message: 'No ICP data found for this customer',
        error: 'ICP analysis not found'
      };

      // Validate response data
      const responseValidation = await validateResponseData(
        responseData,
        ICPAnalysisResponseSchema,
        validationContext,
        validationConfig
      );

      if (!responseValidation.success) {
        console.error('❌ Response validation failed:', responseValidation.errors);
      }

      return NextResponse.json(responseData, { status: 404 });
    }

    // Prepare response data
    const responseData: ICPAnalysisResponse = {
      success: true,
      icpData: icpData,
      message: 'ICP analysis retrieved successfully'
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      ICPAnalysisResponseSchema,
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
    console.error('❌ Unexpected error in ICP analysis API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while retrieving ICP analysis'
      },
      { status: 500 }
    );
  }
});