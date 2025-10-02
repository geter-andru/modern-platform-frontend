
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
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
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    // Get the next parameter from the URL
    const { searchParams } = new URL(request.url);
    const next = searchParams.get('next') || '/icp';
    
    // Handle the OAuth callback
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
    }

    if (data.session) {
      // Successful authentication, redirect to the intended page
      return NextResponse.redirect(new URL(next, request.url));
    } else {
      // No session, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent('An unexpected error occurred')}`, request.url));
  }
}
