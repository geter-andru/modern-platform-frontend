import { NextRequest, NextResponse } from 'next/server';
import assessmentService from '@/lib/services/AssessmentService';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

// API Contract: Development Plan Generation
export interface DevelopmentPlanResponse {
  success: boolean;
  message: string;
  data?: {
    timeframe: string;
    objectives: Array<{
      category: string;
      target: string;
      currentScore: number;
      targetScore: number;
      priority: 'high' | 'medium' | 'low';
    }>;
    activities: Array<{
      type: 'platform_engagement' | 'real_world_action';
      title: string;
      description: string;
      estimatedTime: string;
      pointsPotential: number;
      category: string;
    }>;
    milestones: Array<{
      type: 'level_progression';
      title: string;
      description: string;
      targetPoints: number;
      currentPoints: number;
      estimatedTimeframe: string;
    }>;
    estimatedOutcome: {
      totalPointsGain: number;
      competencyImprovements: {
        customerAnalysis: number;
        valueCommunication: number;
        salesExecution: number;
      };
      toolUnlocks: string[];
      levelProgression: {
        willAdvance: boolean;
        currentLevel: string;
        potentialLevel: string;
        progressToNext: {
          current: {
            id: string;
            name: string;
            description: string;
            requiredPoints: number;
            maxPoints: number | null;
            color: string;
            benefits: string[];
            toolUnlocks: string[];
          };
          next: {
            id: string;
            name: string;
            description: string;
            requiredPoints: number;
            maxPoints: number | null;
            color: string;
            benefits: string[];
            toolUnlocks: string[];
          } | null;
          progress: number;
          pointsToNext: number;
          pointsInLevel: number;
          pointsNeededForLevel: number;
        };
      };
    };
  };
  error?: string;
}

/**
 * GET /api/assessment/development-plan/[userId]
 * 
 * Generates a personalized development plan for the user based on their
 * current competency scores and progress.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<DevelopmentPlanResponse>> {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30days';

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required', error: 'userId parameter is missing' },
        { status: 400 }
      );
    }

    // Validate timeframe
    const validTimeframes = ['30days', '90days', '6months', '1year'];
    if (!validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        { success: false, message: 'Invalid timeframe', error: 'timeframe must be one of: 30days, 90days, 6months, 1year' },
        { status: 400 }
      );
    }

    console.log(`📋 Generating development plan for user: ${userId}, timeframe: ${timeframe}`);

    // Get user progress data
    const userProgress = await assessmentService.getUserProgress(userId);

    if (!userProgress) {
      return NextResponse.json(
        { success: false, message: 'User progress not found', error: 'No progress data found for this user' },
        { status: 404 }
      );
    }

    // Prepare competency data for development plan generation
    const competencyData = {
      currentCustomerAnalysis: userProgress.currentScores.customerAnalysis,
      currentValueCommunication: userProgress.currentScores.valueCommunication,
      currentSalesExecution: userProgress.currentScores.salesExecution,
      totalProgressPoints: userProgress.totalPoints
    };

    // Generate development plan
    const developmentPlan = assessmentService.generateDevelopmentPlan(competencyData, timeframe);

    console.log(`✅ Development plan generated for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Development plan generated successfully',
      data: developmentPlan
    });

  } catch (error) {
    console.error('❌ Error generating development plan:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
