
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';

// In-memory storage (replace with database in production)
const toolUsageSessions = new Map<string, any[]>();

export const POST = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const body = await request.json() as { toolUsed: string; sessionData: any };
    const { toolUsed, sessionData } = body;

    if (!toolUsed || !sessionData) {
      return NextResponse.json(
        { error: 'Tool usage and session data are required' },
        { status: 400 }
      );
    }
    // Create session record
    const session = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      founderId: auth.user.id,
      toolUsed,
      timestamp: new Date().toISOString(),
      businessImpact: sessionData.businessImpact || 'medium',
      competencyAdvancement: {
        area: sessionData.area || 'customer_intelligence',
        pointsAwarded: sessionData.pointsAwarded || 10,
        levelProgression: sessionData.levelProgression || false
      },
      professionalMilestones: sessionData.professionalMilestones || [],
      systematicInsights: sessionData.systematicInsights || [],
      nextActions: sessionData.nextActions || []
    };

    // Store session
    const userSessions = toolUsageSessions.get(auth.user.id) || [];
    userSessions.push(session);
    toolUsageSessions.set(auth.user.id, userSessions);

    return NextResponse.json({
      success: true,
      session,
      message: 'Tool usage processed successfully'
    });

  } catch (error) {
    console.error('Error processing tool usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const sessions = toolUsageSessions.get(auth.user.id) || [];

    return NextResponse.json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error('Error retrieving tool usage sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});