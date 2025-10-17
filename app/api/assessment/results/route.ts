import { NextResponse } from 'next/server';

/**
 * Assessment Results API Route
 * Returns mock assessment results for MVP
 * TODO: Wire to Supabase user_progress table in future iteration
 */
export async function GET() {
  // MVP: Return mock assessment results
  // In production, this would fetch from user_progress table based on actual milestones

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
    data: mockResults
  });
}
