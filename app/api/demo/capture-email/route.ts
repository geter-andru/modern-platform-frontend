import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

/**
 * POST /api/demo/capture-email
 *
 * Captures email from demo page users for lead generation
 * Stores in demo_email_captures table (public, no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, demo_type = 'icp_analysis', company_slug } = body;

    // Validate email format
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create Supabase client (will use anon key for public access)
    const supabase = await createClient();

    // Insert email into demo_email_captures table
    const { data, error } = await supabase
      .from('demo_email_captures')
      .insert({
        email: email.toLowerCase().trim(),
        demo_type,
        company_slug: company_slug || null
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate email (constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: true,
            message: 'Email already registered for this demo',
            already_exists: true
          },
          { status: 200 }
        );
      }

      console.error('❌ Failed to capture email:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save email'
        },
        { status: 500 }
      );
    }

    console.log('✅ Email captured successfully:', {
      id: data.id,
      email: email.toLowerCase().trim(),
      demo_type
    });

    return NextResponse.json({
      success: true,
      message: 'Email captured successfully',
      data: {
        id: data.id,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('❌ Email capture error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
