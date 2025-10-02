/**
 * Track Resource Access API Route
 * 
 * POST /api/resources/[resourceId]/access
 * Tracks user access to resources for analytics and progressive unlocking
 */

import { NextRequest, NextResponse } from 'next/server';
import { resourceAccessService } from '@/app/lib/services/resourceAccessService';
import { TrackAccessRequestSchema } from '@/lib/validation/schemas/resourcesLibrarySchemas';

export async function POST(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    console.log(`📊 Tracking access for resource: ${params.resourceId}`);

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = TrackAccessRequestSchema.parse({
      ...body,
      resource_id: params.resourceId
    });

    // Track the access
    await resourceAccessService.trackAccess(validatedRequest);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Access tracked successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to track access:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Resource access tracking endpoint - POST only',
    methods: ['POST'],
    schema: 'TrackAccessRequestSchema'
  });
}
