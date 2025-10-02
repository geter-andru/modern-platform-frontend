import { NextRequest, NextResponse } from 'next/server';
import assessmentService from '@/lib/services/AssessmentService';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

// API Contract: Assessment Sync from andru-assessment
export interface AssessmentSyncRequest {
  sessionId: string;
  userId: string;
  assessmentResults: {
    overallScore: number;
    performanceLevel: string;
    skillLevels: {
      customerAnalysis: number;
      businessCommunication: number;
      revenueStrategy: number;
      valueArticulation: number;
      strategicThinking: number;
    };
    challenges: Array<{
      name: string;
      description: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      impact: number;
      businessConsequence: string;
    }>;
    recommendations: Array<{
      category: string;
      title: string;
      description: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      expectedOutcome: string;
      timeframe: string;
      tools: string[];
    }>;
    focusArea: string;
    revenueOpportunity: number;
    roiMultiplier: number;
    nextSteps: string[];
    confidence: number;
    generatedAt: string;
  };
  userInfo: {
    email: string;
    company: string;
    productName: string;
    productDescription: string;
    businessModel: string;
  };
  syncTimestamp: string;
}

export interface AssessmentSyncResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
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
    competencyScores: {
      customerAnalysis: number;
      valueCommunication: number;
      salesExecution: number;
    };
    totalPoints: number;
  };
  error?: string;
}

/**
 * POST /api/assessment/sync
 * 
 * Receives assessment results from andru-assessment AssessmentServiceLite
 * and processes them for professional development tracking.
 */
export async function POST(request: NextRequest): Promise<NextResponse<AssessmentSyncResponse>> {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, message: 'Method not allowed', error: 'Only POST requests are allowed' },
        { status: 405 }
      );
    }

    // Parse request body
    const syncData: AssessmentSyncRequest = await request.json();

    // Validate required fields
    if (!syncData.sessionId || !syncData.userId || !syncData.assessmentResults || !syncData.userInfo) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', error: 'sessionId, userId, assessmentResults, and userInfo are required' },
        { status: 400 }
      );
    }

    // Validate assessment results structure
    if (!syncData.assessmentResults.overallScore || !syncData.assessmentResults.skillLevels) {
      return NextResponse.json(
        { success: false, message: 'Invalid assessment results', error: 'assessmentResults must include overallScore and skillLevels' },
        { status: 400 }
      );
    }

    // Validate user info structure
    if (!syncData.userInfo.email || !syncData.userInfo.company) {
      return NextResponse.json(
        { success: false, message: 'Invalid user info', error: 'userInfo must include email and company' },
        { status: 400 }
      );
    }

    console.log(`🔄 Processing assessment sync for user: ${syncData.userId}, session: ${syncData.sessionId}`);

    // Process assessment sync data
    const result = await assessmentService.processAssessmentSync(syncData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to process assessment sync', error: result.error },
        { status: 500 }
      );
    }

    // Get updated user progress data
    const userProgress = await assessmentService.getUserProgress(syncData.userId);
    if (!userProgress) {
      return NextResponse.json(
        { success: false, message: 'Failed to retrieve user progress', error: 'User progress not found after sync' },
        { status: 500 }
      );
    }

    // Prepare response data
    const responseData = {
      userId: userProgress.userId,
      levelProgress: userProgress.levelProgress,
      toolAccess: userProgress.toolAccess,
      competencyScores: userProgress.currentScores,
      totalPoints: userProgress.totalPoints
    };

    console.log(`✅ Assessment sync completed for user: ${syncData.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Assessment sync processed successfully',
      data: responseData
    });

  } catch (error) {
    console.error('❌ Assessment sync error:', error);
    
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

/**
 * GET /api/assessment/sync
 * 
 * Health check endpoint for assessment sync service
 */
export async function GET(): Promise<NextResponse<{ status: string; timestamp: string }>> {
  return NextResponse.json({
    status: 'Assessment sync service is running',
    timestamp: new Date().toISOString()
  });
}
