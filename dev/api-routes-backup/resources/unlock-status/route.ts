/**
 * Check Unlock Status API Route
 * 
 * POST /api/resources/unlock-status
 * Checks unlock status for resources based on customer progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { resourceGenerationService } from '@/app/lib/services/resourceGenerationService';
import { 
  CheckUnlockStatusRequestSchema,
  CheckUnlockStatusResponseSchema 
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

export async function POST(request: NextRequest) {
  try {
    console.log('🔓 Checking unlock status');

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = CheckUnlockStatusRequestSchema.parse(body);

    // Check unlock status
    const response = await resourceGenerationService.checkUnlockStatus(validatedRequest);

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to check unlock status:', error);

    const response: CheckUnlockStatusResponseSchema = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Unlock status endpoint - POST only',
    methods: ['POST'],
    schema: 'CheckUnlockStatusRequestSchema'
  });
}
