import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

/**
 * POST /api/assessment/validate
 *
 * Validates an assessment token and returns assessment data
 *
 * Request body:
 * {
 *   token: string // UUID token from URL parameter
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     assessment: object,   // Full assessment data
 *     isValid: boolean,     // Whether token is valid and not expired
 *     isClaimed: boolean,   // Whether token has been claimed by a user
 *     expiresAt: string    // ISO timestamp of expiration
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // Validate input
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(token)) {
      return NextResponse.json(
        { success: false, error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Get Supabase client (no auth required - this is public validation)
    const supabase = await createClient();

    // Query token from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('assessment_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token not found',
          isValid: false,
          isClaimed: false
        },
        { status: 404 }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    const isExpired = now > expiresAt;

    if (isExpired) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token has expired',
          isValid: false,
          isClaimed: tokenData.is_used,
          expiresAt: tokenData.expires_at
        },
        { status: 410 } // 410 Gone
      );
    }

    // Token is valid - return assessment data
    return NextResponse.json({
      success: true,
      data: {
        assessment: tokenData.assessment_data,
        isValid: true,
        isClaimed: tokenData.is_used,
        expiresAt: tokenData.expires_at,
        createdAt: tokenData.created_at
      }
    });

  } catch (error) {
    console.error('❌ Token validation failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
