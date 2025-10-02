/**
 * API Route: Bridge Assessment Integration
 * 
 * Provides assessment data to modern-platform components
 * Handles data retrieval from both Airtable and Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import dataBridgeService from '@/lib/services/DataBridgeService';
import assessmentService from '@/lib/services/AssessmentService';

export const dynamic = 'force-dynamic';

export interface BridgeAssessmentRequest {
  sessionId?: string;
  userId?: string;
  email?: string;
  action: 'get_assessment' | 'get_progress' | 'sync_and_get';
}

export interface BridgeAssessmentResponse {
  success: boolean;
  message: string;
  data?: {
    assessment?: any;
    progress?: any;
    source?: 'airtable' | 'supabase' | 'both';
    synced?: boolean;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<BridgeAssessmentResponse>> {
  try {
    const body: BridgeAssessmentRequest = await request.json();
    const { action, sessionId, userId, email } = body;

    console.log(`🔄 Bridge assessment request: ${action}`);

    let result: any = {};

    switch (action) {
      case 'get_assessment':
        if (!sessionId) {
          return NextResponse.json({
            success: false,
            message: 'sessionId is required for get_assessment action',
            error: 'Missing required parameter'
          }, { status: 400 });
        }

        const assessmentData = await dataBridgeService.getAssessmentBySessionId(sessionId);
        result = {
          assessment: assessmentData.airtableData || assessmentData.supabaseData,
          source: assessmentData.source
        };
        break;

      case 'get_progress':
        if (!userId) {
          return NextResponse.json({
            success: false,
            message: 'userId is required for get_progress action',
            error: 'Missing required parameter'
          }, { status: 400 });
        }

        const progressData = await assessmentService.getUserProgress(userId);
        result = {
          progress: progressData
        };
        break;

      case 'sync_and_get':
        if (!sessionId) {
          return NextResponse.json({
            success: false,
            message: 'sessionId is required for sync_and_get action',
            error: 'Missing required parameter'
          }, { status: 400 });
        }

        // First, try to sync any pending data
        const syncResult = await dataBridgeService.syncAllPendingAssessments();
        
        // Then get the assessment data
        const syncedAssessmentData = await dataBridgeService.getAssessmentBySessionId(sessionId);
        
        result = {
          assessment: syncedAssessmentData.airtableData || syncedAssessmentData.supabaseData,
          source: syncedAssessmentData.source,
          synced: syncResult.success
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action specified',
          error: 'Invalid action'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Bridge assessment ${action} completed successfully`,
      data: result
    });

  } catch (error) {
    console.error('❌ Bridge assessment error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error during bridge assessment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<BridgeAssessmentResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    console.log(`🔍 Bridge assessment GET request - sessionId: ${sessionId}, userId: ${userId}, email: ${email}`);

    let result: any = {};

    if (sessionId) {
      // Get assessment by session ID
      const assessmentData = await dataBridgeService.getAssessmentBySessionId(sessionId);
      result = {
        assessment: assessmentData.airtableData || assessmentData.supabaseData,
        source: assessmentData.source
      };
    } else if (userId) {
      // Get user progress
      const progressData = await assessmentService.getUserProgress(userId);
      result = {
        progress: progressData
      };
    } else if (email) {
      // Get assessment by email (from Airtable)
      const assessmentData = await dataBridgeService.getAssessmentBySessionId(email);
      result = {
        assessment: assessmentData.airtableData || assessmentData.supabaseData,
        source: assessmentData.source
      };
    } else {
      return NextResponse.json({
        success: false,
        message: 'sessionId, userId, or email parameter is required',
        error: 'Missing required parameter'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment data retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Bridge assessment GET error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve assessment data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
