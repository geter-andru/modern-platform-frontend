import { NextRequest, NextResponse } from 'next/server';
import assessmentService from '@/lib/services/AssessmentService';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

// API Contract: User Progress Retrieval
export interface UserProgressResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    baselineScores: {
      customerAnalysis: number;
      valueCommunication: number;
      salesExecution: number;
    };
    currentScores: {
      customerAnalysis: number;
      valueCommunication: number;
      salesExecution: number;
    };
    totalPoints: number;
    levelProgress: {
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
    toolAccess: {
      icpAnalysis: boolean;
      costCalculator: boolean;
      businessCaseBuilder: boolean;
      advancedAnalytics: boolean;
      customFrameworks: boolean;
    };
    lastUpdated: string;
    assessmentHistory: Array<{
      sessionId: string;
      completedAt: string;
      overallScore: number;
      performanceLevel: string;
    }>;
  };
  error?: string;
}

/**
 * GET /api/assessment/progress/[userId]
 * 
 * Retrieves user progress data including competency scores, level progression,
 * tool access, and assessment history.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<UserProgressResponse>> {
  try {
    const { userId } = params;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required', error: 'userId parameter is missing' },
        { status: 400 }
      );
    }

    console.log(`📊 Retrieving progress for user: ${userId}`);

    // Get user progress data
    const userProgress = await assessmentService.getUserProgress(userId);

    if (!userProgress) {
      return NextResponse.json(
        { success: false, message: 'User progress not found', error: 'No progress data found for this user' },
        { status: 404 }
      );
    }

    // Prepare response data
    const responseData = {
      userId: userProgress.userId,
      baselineScores: userProgress.baselineScores,
      currentScores: userProgress.currentScores,
      totalPoints: userProgress.totalPoints,
      levelProgress: userProgress.levelProgress,
      toolAccess: userProgress.toolAccess,
      lastUpdated: userProgress.lastUpdated,
      assessmentHistory: userProgress.assessmentHistory
    };

    console.log(`✅ Progress retrieved for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'User progress retrieved successfully',
      data: responseData
    });

  } catch (error) {
    console.error('❌ Error retrieving user progress:', error);
    
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
