import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if route is /icp/[slug] (but not /icp/demo, /icp/rating, etc.)
  const pathname = req.nextUrl.pathname;
  const isICPScenarioRoute = /^\/icp\/[^\/]+$/.test(pathname) &&
    !pathname.startsWith('/icp/demo') &&
    !pathname.startsWith('/icp/rating') &&
    !pathname.startsWith('/icp/product') &&
    !pathname.startsWith('/icp/translator') &&
    !pathname.startsWith('/icp/rate-company') &&
    !pathname.startsWith('/icp/personas') &&
    !pathname.startsWith('/icp/overview');

  if (isICPScenarioRoute) {
    // Check if user is authenticated
    if (!session) {
      // Redirect to gate page
      const redirectUrl = new URL('/icp/gate', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if email contains @delve.
    const email = session.user.email || '';
    const isDelveUser = email.includes('@delve.');

    if (!isDelveUser) {
      // Redirect to access denied page
      const redirectUrl = new URL('/icp/gate', req.url);
      redirectUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Specify which routes this middleware runs on
export const config = {
  matcher: '/icp/:path*',
};
