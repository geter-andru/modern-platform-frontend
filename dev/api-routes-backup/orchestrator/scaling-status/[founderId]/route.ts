import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import customerValueOrchestrator from '@/app/lib/services/customerValueOrchestrator';

export const dynamic = 'force-dynamic';

export const GET = requireAuth(async (
  request: NextRequest,
  auth: AuthContext,
  { params }: { params: Promise<{ founderId: string }> }
) => {
  try {
    const supabase = await createClient();
    const { founderId } = await params;

    if (!founderId) {
      return NextResponse.json(
        { error: 'Founder ID is required' },
        { status: 400 }
      );
    }

    // Get scaling status using the orchestrator
    const scalingStatus = await customerValueOrchestrator.getScalingStatus(founderId);

    return NextResponse.json({
      success: true,
      founderId,
      scalingStatus
    });

  } catch (error) {
    console.error('Error fetching scaling status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});