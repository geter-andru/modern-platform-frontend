
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Import the storage from the generate route (in production, use a shared database)
// For now, we'll create a simple in-memory storage
const icpStorage = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const icpData = icpStorage.get(user.id);

    if (!icpData) {
      return NextResponse.json(
        { error: 'No ICP data found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      icp: icpData
    });

  } catch (error) {
    console.error('Error retrieving ICP data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
