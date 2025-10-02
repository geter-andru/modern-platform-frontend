import { NextRequest, NextResponse } from 'next/server';
import assessmentService from '@/lib/services/AssessmentService';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

// API Contract: Competency Analytics
export interface CompetencyAnalyticsResponse {
  success: boolean;
  message: string;
  data?: {
    insights: Array<{
      type: 'positive' | 'opportunity' | 'milestone';
      category: string;
      title: string;
      message: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    recommendations: Array<{
      category: string;
      priority: 'high' | 'medium' | 'low';
      action: string;
      description: string;
      estimatedTime: string;
      potentialPoints: number;
    }>;
    focusArea: string;
    overallScore: number;
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
  };
  error?: string;
}

/**
 * GET /api/assessment/analytics/[userId]
 * 
 * Generates competency analytics including insights, recommendations,
 * and progress analysis for the user.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<CompetencyAnalyticsResponse>> {
  try {
    const { userId } = params;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required', error: 'userId parameter is missing' },
        { status: 400 }
      );
    }

    console.log(`📊 Generating competency analytics for user: ${userId}`);

    // Get user progress data
    const userProgress = await assessmentService.getUserProgress(userId);

    if (!userProgress) {
      return NextResponse.json(
        { success: false, message: 'User progress not found', error: 'No progress data found for this user' },
        { status: 404 }
      );
    }

    // Prepare competency data for analytics generation
    const competencyData = {
      baselineCustomerAnalysis: userProgress.baselineScores.customerAnalysis,
      baselineValueCommunication: userProgress.baselineScores.valueCommunication,
      baselineSalesExecution: userProgress.baselineScores.salesExecution,
      currentCustomerAnalysis: userProgress.currentScores.customerAnalysis,
      currentValueCommunication: userProgress.currentScores.valueCommunication,
      currentSalesExecution: userProgress.currentScores.salesExecution,
      totalProgressPoints: userProgress.totalPoints
    };

    // Generate competency analytics
    const analytics = assessmentService.generateCompetencyInsights(competencyData);

    console.log(`✅ Competency analytics generated for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Competency analytics generated successfully',
      data: analytics
    });

  } catch (error) {
    console.error('❌ Error generating competency analytics:', error);
    
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
