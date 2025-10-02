
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';

// In-memory storage (replace with database in production)
const systematicActions = new Map<string, any[]>();

export const POST = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const body = await request.json() as { actionType: string; actionData: any };
    const { actionType, actionData } = body;

    if (!actionType || !actionData) {
      return NextResponse.json(
        { error: 'Action type and data are required' },
        { status: 400 }
      );
};
    // Create action record
    const action = {
      actionId: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      founderId: auth.auth.user.id,
      actionType,
      timestamp: new Date().toISOString(),
      businessImpact: actionData.businessImpact || 'medium',
      competencyAdvancement: {
        area: actionData.area || 'customer_intelligence',
        pointsAwarded: actionData.pointsAwarded || 5,
        levelProgression: actionData.levelProgression || false
      },
      professionalMilestones: actionData.professionalMilestones || [],
      systematicInsights: actionData.systematicInsights || [],
      nextActions: actionData.nextActions || [],
      results: actionData.results || {}
    };

    // Store action
    const userActions = systematicActions.get(auth.user.id) || [];
    userActions.push(action);
    systematicActions.set(auth.user.id, userActions);

    return NextResponse.json({
      success: true,
      action,
      message: 'Systematic action executed successfully'
    });

  } catch (error) {
    console.error('Error executing systematic action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const actions = systematicActions.get(auth.user.id) || [];

    return NextResponse.json({
      success: true,
      actions
    });

  } catch (error) {
    console.error('Error retrieving systematic actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});