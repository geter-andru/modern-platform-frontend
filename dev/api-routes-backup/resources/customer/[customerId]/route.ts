/**
 * Get Customer Resources API Route
 * 
 * GET /api/resources/[customerId]
 * Retrieves resources for a specific customer with filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { resourceGenerationService } from '@/app/lib/services/resourceGenerationService';
import { 
  GetResourcesRequestSchema,
  GetResourcesResponseSchema 
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    console.log(`📋 Getting resources for customer: ${params.customerId}`);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      customer_id: params.customerId,
      tier: searchParams.get('tier') ? parseInt(searchParams.get('tier')!) : undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    };

    // Validate request parameters
    const validatedRequest = GetResourcesRequestSchema.parse(queryParams);

    // Get resources
    const response = await resourceGenerationService.getResources(validatedRequest);

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to get resources:', error);

    const response: GetResourcesResponseSchema = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
