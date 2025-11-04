import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

/**
 * POST /api/assessment/claim
 *
 * Claims an assessment token and saves it to the authenticated user's account
 *
 * Request body:
 * {
 *   token: string // UUID token to claim
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     assessmentId: string,    // ID of created user_assessment record
 *     assessment: object       // The assessment data
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated. Please sign up or log in first.' },
        { status: 401 }
      );
    }

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

    // Fetch and validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('assessment_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { success: false, error: 'Token not found' },
        { status: 404 }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Token has expired' },
        { status: 410 }
      );
    }

    // Check if token is already claimed
    if (tokenData.is_used) {
      return NextResponse.json(
        { success: false, error: 'Token has already been claimed' },
        { status: 409 } // 409 Conflict
      );
    }

    // Check if user already has an assessment
    const { data: existingAssessment } = await supabase
      .from('user_assessments')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingAssessment) {
      // Update existing assessment instead of creating new one
      const { data: updatedAssessment, error: updateError } = await supabase
        .from('user_assessments')
        .update({
          token_id: tokenData.id,
          assessment_data: tokenData.assessment_data,
          overall_score: tokenData.assessment_data?.overall_score || null,
          buyer_readiness_score: tokenData.assessment_data?.buyer_readiness_score || null,
          technical_readiness_score: tokenData.assessment_data?.technical_readiness_score || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Mark token as used
      await supabase
        .from('assessment_tokens')
        .update({
          is_used: true,
          claimed_at: new Date().toISOString(),
          claimed_by: user.id
        })
        .eq('id', tokenData.id);

      return NextResponse.json({
        success: true,
        message: 'Assessment updated successfully',
        data: {
          assessmentId: updatedAssessment.id,
          assessment: updatedAssessment.assessment_data,
          isUpdate: true
        }
      });
    }

    // Create new user_assessment record
    const { data: newAssessment, error: createError } = await supabase
      .from('user_assessments')
      .insert({
        user_id: user.id,
        token_id: tokenData.id,
        assessment_data: tokenData.assessment_data,
        overall_score: tokenData.assessment_data?.overall_score || null,
        buyer_readiness_score: tokenData.assessment_data?.buyer_readiness_score || null,
        technical_readiness_score: tokenData.assessment_data?.technical_readiness_score || null
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create user assessment:', createError);
      throw createError;
    }

    // Mark token as used
    const { error: updateTokenError } = await supabase
      .from('assessment_tokens')
      .update({
        is_used: true,
        claimed_at: new Date().toISOString(),
        claimed_by: user.id
      })
      .eq('id', tokenData.id);

    if (updateTokenError) {
      console.error('❌ Failed to mark token as used:', updateTokenError);
      // Don't fail the request - assessment is already created
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment claimed successfully',
      data: {
        assessmentId: newAssessment.id,
        assessment: newAssessment.assessment_data,
        isUpdate: false
      }
    });

  } catch (error) {
    console.error('❌ Assessment claim failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
