
/**
 * API Route: Scaling Status Management
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// In-memory storage (replace with database in production)
const scalingStatus = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create scaling status
    let status = scalingStatus.get(user.id);
    
    if (!status) {
      // Create initial scaling status
      status = {
        founderId: user.id,
        overallReadinessScore: 0,
        competencyProfile: [],
        scalingIntelligence: {
          currentScalingScore: 0,
          systematicProgressionRate: 0,
          professionalCredibilityTrend: 'stable' as const,
          competencyMilestones: {
            customerIntelligence: 0,
            valueCommunication: 0,
            salesExecution: 0,
            systematicOptimization: 0
          },
          scalingVelocity: {
            weeklyProgress: 0,
            monthlyMilestones: 0,
            quarterlyTargets: 0
          },
          riskFactors: {
            inconsistentSystemUsage: false,
            lowBusinessImpactActions: false,
            professionalCredibilityDrift: false
          },
          nextSystematicActions: []
        },
        activeAgents: [],
        recentSessions: [],
        professionalCredibilityTrend: 'stable' as const,
        businessImpactGenerated: 0,
        nextSystematicMilestones: [],
        scalingVelocityMultiplier: 1.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      scalingStatus.set(user.id, status);
    }

    return NextResponse.json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Error retrieving scaling status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as { statusData: any };
    const { statusData } = body;

    if (!statusData) {
      return NextResponse.json(
        { error: 'Status data is required' },
        { status: 400 }
      );
    }

    // Update scaling status
    const updatedStatus = {
      ...statusData,
      founderId: user.id,
      updatedAt: new Date().toISOString()
    };

    scalingStatus.set(user.id, updatedStatus);

    return NextResponse.json({
      success: true,
      status: updatedStatus
    });

  } catch (error) {
    console.error('Error updating scaling status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
