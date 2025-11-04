import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

/**
 * GET /api/assessment/results
 *
 * Returns the authenticated user's saved assessment
 * Falls back to mock data if no assessment found
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch user's assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // If no assessment found, return mock data (backward compatibility)
    if (assessmentError || !assessment) {
      const mockResults = {
        competencyLevel: 2,
        completionPercentage: 65,
        scoreBreakdown: {
          productClarity: 75,
          marketUnderstanding: 60,
          buyerIntelligence: 55,
          messagingAlignment: 70
        },
        completedMilestones: [
          'product_details_complete',
          'icp_analysis_generated',
          'cost_calculator_completed'
        ],
        pendingMilestones: [
          'buyer_personas_generated',
          'resources_reviewed',
          'business_case_created'
        ],
        recommendations: [
          'Complete ICP analysis to improve buyer intelligence score',
          'Generate buyer personas for better targeting',
          'Review messaging alignment with ICP findings',
          'Create business case to quantify revenue impact'
        ],
        nextSteps: [
          {
            title: 'Generate Buyer Personas',
            description: 'Create detailed buyer personas based on your ICP',
            path: '/icp?widget=personas',
            priority: 'high'
          },
          {
            title: 'Review Resources Library',
            description: 'Access frameworks and templates',
            path: '/resources',
            priority: 'medium'
          },
          {
            title: 'Calculate Revenue Impact',
            description: 'Quantify cost of poor buyer intelligence',
            path: '/cost-calculator',
            priority: 'high'
          }
        ],
        overallScore: 65,
        grade: 'B',
        lastUpdated: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: mockResults,
        isMock: true
      });
    }

    // Return real assessment data
    return NextResponse.json({
      success: true,
      data: {
        ...assessment.assessment_data,
        assessmentId: assessment.id,
        lastUpdated: assessment.updated_at,
        createdAt: assessment.created_at
      },
      isMock: false
    });

  } catch (error) {
    console.error('❌ Failed to fetch assessment results:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
