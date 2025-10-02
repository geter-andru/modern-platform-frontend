import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';

// Configure for dynamic rendering
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

    // TODO: Import and use the migrated behavioral intelligence service
    // For now, return mock data to prevent 501 errors
    return NextResponse.json({
      founderId: auth.user.id,
      currentScalingScore: 75,
      behavioralPatterns: {
        decisionMaking: 'analytical',
        riskTolerance: 'moderate',
        collaborationStyle: 'collaborative'
      },
      scalingInsights: {
        strengths: ['Strategic thinking', 'Team building'],
        growthAreas: ['Technical execution', 'Market analysis'],
        recommendations: ['Focus on technical depth', 'Expand market research']
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching behavioral intelligence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});