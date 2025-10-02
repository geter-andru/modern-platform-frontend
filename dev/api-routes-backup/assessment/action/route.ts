import { NextRequest, NextResponse } from 'next/server';
import assessmentService from '@/lib/services/AssessmentService';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

// API Contract: Real-World Action Tracking
export interface ActionTrackingRequest {
  customerId: string;
  actionData: {
    type: string;
    category: string;
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    evidence?: string;
    tags?: string[];
  };
}

export interface ActionTrackingResponse {
  success: boolean;
  message: string;
  data?: {
    actionRecord: {
      id: string;
      customerId: string;
      type: string;
      category: string;
      description: string;
      impact: 'low' | 'medium' | 'high' | 'critical';
      evidence?: string;
      pointsAwarded: number;
      timestamp: string;
      verified: boolean;
      tags: string[];
    };
    points: number;
    updatedProgress: {
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
    };
  };
  error?: string;
}

/**
 * POST /api/assessment/action
 * 
 * Tracks real-world actions and updates user progress with points.
 */
export async function POST(request: NextRequest): Promise<NextResponse<ActionTrackingResponse>> {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, message: 'Method not allowed', error: 'Only POST requests are allowed' },
        { status: 405 }
      );
    }

    // Parse request body
    const { customerId, actionData }: ActionTrackingRequest = await request.json();

    // Validate required fields
    if (!customerId || !actionData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', error: 'customerId and actionData are required' },
        { status: 400 }
      );
    }

    // Validate action data structure
    if (!actionData.type || !actionData.category || !actionData.description || !actionData.impact) {
      return NextResponse.json(
        { success: false, message: 'Invalid action data', error: 'actionData must include type, category, description, and impact' },
        { status: 400 }
      );
    }

    // Validate impact value
    const validImpacts = ['low', 'medium', 'high', 'critical'];
    if (!validImpacts.includes(actionData.impact)) {
      return NextResponse.json(
        { success: false, message: 'Invalid impact value', error: 'impact must be one of: low, medium, high, critical' },
        { status: 400 }
      );
    }

    console.log(`🎯 Tracking action for user: ${customerId}, type: ${actionData.type}`);

    // Track real-world action
    const result = await assessmentService.trackRealWorldAction(customerId, actionData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to track action', error: result.error },
        { status: 500 }
      );
    }

    // Get updated user progress
    const userProgress = await assessmentService.getUserProgress(customerId);
    if (!userProgress) {
      return NextResponse.json(
        { success: false, message: 'Failed to retrieve updated progress', error: 'User progress not found after action tracking' },
        { status: 500 }
      );
    }

    // Prepare response data
    const responseData = {
      actionRecord: result.actionRecord,
      points: result.points,
      updatedProgress: {
        totalPoints: userProgress.totalPoints,
        levelProgress: userProgress.levelProgress,
        toolAccess: userProgress.toolAccess
      }
    };

    console.log(`✅ Action tracked for user: ${customerId}, points awarded: ${result.points}`);

    return NextResponse.json({
      success: true,
      message: 'Action tracked successfully',
      data: responseData
    });

  } catch (error) {
    console.error('❌ Action tracking error:', error);
    
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
 * GET /api/assessment/action
 * 
 * Health check endpoint for action tracking service
 */
export async function GET(): Promise<NextResponse<{ status: string; timestamp: string }>> {
  return NextResponse.json({
    status: 'Action tracking service is running',
    timestamp: new Date().toISOString()
  });
}
