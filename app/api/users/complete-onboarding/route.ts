import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/users/complete-onboarding
 *
 * Marks a user's onboarding as complete in the user_profiles table
 *
 * Request body:
 * {
 *   userId: string  // Supabase auth user ID
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   onboarding_completed: boolean
 *   message?: string
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productInfo } = body;

    // Validate input
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId is required'
        },
        { status: 400 }
      );
    }

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error'
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update user_profiles table
    // Build update object with optional product info
    const updateData: any = {
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    };

    // Add product info if provided
    if (productInfo) {
      updateData.onboarding_data = productInfo;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select('onboarding_completed')
      .single();

    if (error) {
      console.error('Error updating onboarding status:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to update onboarding status'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      onboarding_completed: data.onboarding_completed,
      message: 'Onboarding marked as complete'
    });

  } catch (error) {
    console.error('Exception in complete-onboarding API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
