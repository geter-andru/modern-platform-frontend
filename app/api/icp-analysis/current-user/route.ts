import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get user from Supabase session
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch ICP from customer_assets
    const { data, error } = await supabase
      .from('customer_assets')
      .select('icp_content')
      .eq('customer_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return NextResponse.json(
          { success: false, error: 'No ICP data found' },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!data?.icp_content) {
      return NextResponse.json(
        { success: false, error: 'No ICP data found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      icp: data.icp_content
    });

  } catch (error) {
    console.error('❌ Failed to fetch ICP data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
