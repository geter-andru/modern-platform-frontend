/**
 * Generate Resource API Route
 * 
 * POST /api/resources/generate
 * Generates AI-powered resources using cumulative intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { resourceGenerationService } from '@/app/lib/services/resourceGenerationService';
import { 
  GenerateResourceRequestSchema,
  GenerateResourceResponseSchema 
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Resource generation API called');

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = GenerateResourceRequestSchema.parse(body);

    // Generate the resource
    const resource = await resourceGenerationService.generateResource(
      validatedRequest.customer_id,
      validatedRequest.resource_type,
      validatedRequest.context
    );

    // Return success response
    const response: GenerateResourceResponseSchema = {
      success: true,
      data: resource,
      message: 'Resource generated successfully'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Resource generation failed:', error);

    const response: GenerateResourceResponseSchema = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Resource generation endpoint - POST only',
    methods: ['POST'],
    schema: 'GenerateResourceRequestSchema'
  });
}
