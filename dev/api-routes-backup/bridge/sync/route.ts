/**
 * API Route: Data Bridge Sync
 * 
 * Handles synchronization between Airtable and Supabase
 * Used by andru-assessment to sync assessment data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import dataBridgeService from '@/lib/services/DataBridgeService';

export const dynamic = 'force-dynamic';

export interface BridgeSyncRequest {
  airtableRecordId?: string;
  sessionId?: string;
  assessmentData?: any;
  userInfo?: any;
  action: 'sync_record' | 'sync_all' | 'create_both' | 'link_user';
  supabaseUserId?: string;
}

export interface BridgeSyncResponse {
  success: boolean;
  message: string;
  data?: {
    supabaseRecordId?: string;
    airtableRecordId?: string;
    syncedCount?: number;
    errors?: string[];
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<BridgeSyncResponse>> {
  try {
    const body: BridgeSyncRequest = await request.json();
    const { action, airtableRecordId, sessionId, assessmentData, userInfo, supabaseUserId } = body;

    console.log(`🔄 Bridge sync request: ${action}`);

    let result;

    switch (action) {
      case 'sync_record':
        if (!airtableRecordId) {
          return NextResponse.json({
            success: false,
            message: 'airtableRecordId is required for sync_record action',
            error: 'Missing required parameter'
          }, { status: 400 });
        }
        result = await dataBridgeService.syncAssessmentToSupabase(airtableRecordId);
        break;

      case 'sync_all':
        result = await dataBridgeService.syncAllPendingAssessments();
        break;

      case 'create_both':
        if (!assessmentData || !userInfo) {
          return NextResponse.json({
            success: false,
            message: 'assessmentData and userInfo are required for create_both action',
            error: 'Missing required parameters'
          }, { status: 400 });
        }
        result = await dataBridgeService.createAssessmentInBothSystems(assessmentData, userInfo);
        break;

      case 'link_user':
        if (!airtableRecordId || !supabaseUserId) {
          return NextResponse.json({
            success: false,
            message: 'airtableRecordId and supabaseUserId are required for link_user action',
            error: 'Missing required parameters'
          }, { status: 400 });
        }
        result = await dataBridgeService.linkAssessmentToUser(airtableRecordId, supabaseUserId);
        break;

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action specified',
          error: 'Invalid action'
        }, { status: 400 });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Bridge sync completed successfully for action: ${action}`,
        data: {
          supabaseRecordId: result.supabaseRecordId,
          airtableRecordId: result.airtableRecordId,
          syncedCount: (result as any).syncedCount,
          errors: (result as any).errors
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Bridge sync failed for action: ${action}`,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Bridge sync error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error during bridge sync',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<BridgeSyncResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        message: 'sessionId parameter is required',
        error: 'Missing required parameter'
      }, { status: 400 });
    }

    console.log(`🔍 Bridge lookup request for session: ${sessionId}`);

    const assessmentData = await dataBridgeService.getAssessmentBySessionId(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Assessment data retrieved successfully',
      data: {
        source: assessmentData.source,
        airtableData: assessmentData.airtableData,
        supabaseData: assessmentData.supabaseData
      }
    });

  } catch (error) {
    console.error('❌ Bridge lookup error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve assessment data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
