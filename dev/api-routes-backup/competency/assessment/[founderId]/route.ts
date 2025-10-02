
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';

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

    // TODO: Import and use the migrated competency service
    // For now, return mock data to prevent 501 errors
    return NextResponse.json({
      founderId: auth.user.id,
      overallScore: 75,
      competencyAreas: [
        {
          area: 'technical_leadership',
          currentLevel: 3,
          progressToNextLevel: 60,
          businessImpactScore: 85
        },
        {
          area: 'business_strategy',
          currentLevel: 2,
          progressToNextLevel: 40,
          businessImpactScore: 70
        }
      ],
      lastAssessment: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching competency assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
