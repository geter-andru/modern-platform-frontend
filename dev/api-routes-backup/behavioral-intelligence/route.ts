
/**
 * API Route: Behavioral Intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

// In-memory storage (replace with database in production)
const behavioralIntelligence = new Map<string, any>();
const behavioralEvents = new Map<string, any[]>();

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

    // Get or create behavioral intelligence
    let intelligence = behavioralIntelligence.get(user.id);
    
    if (!intelligence) {
      // Create initial behavioral intelligence
      intelligence = {
        userId: user.id,
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
        nextSystematicActions: [
          'Complete ICP analysis',
          'Implement systematic lead qualification',
          'Track professional credibility metrics'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      behavioralIntelligence.set(user.id, intelligence);
    }

    return NextResponse.json({
      success: true,
      intelligence
    });

  } catch (error) {
    console.error('Error retrieving behavioral intelligence:', error);
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

    const body = await request.json() as { 
      eventType: string; 
      toolId?: string; 
      sessionId: string; 
      scalingContext?: any; 
      businessImpact?: string; 
      professionalCredibility?: number 
    };
    const { eventType, toolId, sessionId, scalingContext, businessImpact, professionalCredibility } = body;

    if (!eventType || !sessionId) {
      return NextResponse.json(
        { error: 'Event type and session ID are required' },
        { status: 400 }
      );
    }

    // Create behavioral event
    const event = {
      userId: user.id,
      eventType,
      toolId,
      sessionId,
      timestamp: new Date().toISOString(),
      scalingContext: scalingContext || {
        currentARR: '$0',
        targetARR: '$10M',
        growthStage: 'early_scaling',
        systematicApproach: true
      },
      businessImpact: businessImpact || 'medium',
      professionalCredibility: professionalCredibility || 0
    };

    // Store event
    const userEvents = behavioralEvents.get(user.id) || [];
    userEvents.push(event);
    behavioralEvents.set(user.id, userEvents);

    // Update behavioral intelligence
    let intelligence = behavioralIntelligence.get(user.id);
    
    if (!intelligence) {
      intelligence = {
        userId: user.id,
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
        nextSystematicActions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Update intelligence based on event
    intelligence.currentScalingScore += professionalCredibility || 0;
    intelligence.systematicProgressionRate += 0.1;
    intelligence.updatedAt = new Date().toISOString();

    behavioralIntelligence.set(user.id, intelligence);

    return NextResponse.json({
      success: true,
      event,
      intelligence
    });

  } catch (error) {
    console.error('Error processing behavioral event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
