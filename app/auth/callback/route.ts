import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { env } from '@/app/lib/config/environment'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const cookieStore = await cookies()

  if (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=oauth_callback_error`)
  }

  if (code) {
    const supabaseUrl = env.supabaseUrl;
    const supabaseKey = env.supabaseAnonKey;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration')
      return NextResponse.redirect(`${origin}/login?error=missing_config`)
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/login?error=code_exchange_error`)
    }

    if (data.session) {
      console.log('✅ Route Handler Auth - Session established:', {
        userId: data.session.user.id,
        email: data.session.user.email,
        timestamp: new Date().toISOString()
      })

      // 🔓 ADMIN BYPASS: Allow admin user to access platform without payment
      const adminEmails = ['geter@humusnshore.org', 'admin@andru.ai', 'support@andru.ai'];
      const isAdminEmail = adminEmails.includes(data.session.user.email || '');

      console.log('🔐 [Auth Callback] Admin check:', {
        email: data.session.user.email,
        isAdminEmail,
        adminEmails,
        willBypassPayment: isAdminEmail
      });

      if (isAdminEmail) {
        console.log('✅ Auth Callback: Admin user detected, bypassing payment check');
        const next = searchParams.get('next') || '/dashboard';
        // Add auth_loading parameter to trigger session sync loading screen
        const redirectUrl = new URL(next, origin);
        redirectUrl.searchParams.set('auth_loading', 'true');
        console.log('🔄 Redirecting admin to:', redirectUrl.toString());
        return NextResponse.redirect(redirectUrl.toString());
      }

      console.log('⚠️  Auth Callback: Not an admin email, proceeding with payment verification');

      // ⚠️ PAYMENT VERIFICATION: Check if user has paid before granting access
      const { data: milestone, error: milestoneError } = await supabase
        .from('user_milestones')
        .select('milestone_type, is_founding_member, has_early_access, access_granted_date')
        .eq('user_id', data.session.user.id)
        .single();

      // If no milestone record OR not a founding member, redirect to pricing
      if (milestoneError) {
        if (milestoneError.code === 'PGRST116') {
          // PGRST116 = no rows returned (user hasn't paid)
          console.warn('⚠️ Auth Callback: User authenticated but has not paid:', {
            userId: data.session.user.id,
            email: data.session.user.email,
          });
        } else {
          // Unexpected database error
          console.error('❌ Auth Callback: Error checking payment status:', {
            userId: data.session.user.id,
            email: data.session.user.email,
            error: milestoneError.message,
          });
        }

        return NextResponse.redirect(`${origin}/pricing?error=payment_required`);
      }

      // User has milestone record but is not a founding member
      if (!milestone || !milestone.is_founding_member) {
        console.warn('⚠️ Auth Callback: User not a founding member:', {
          userId: data.session.user.id,
          email: data.session.user.email,
          isFoundingMember: milestone?.is_founding_member,
        });

        return NextResponse.redirect(`${origin}/pricing?error=payment_required`);
      }

      // User is founding member but doesn't have early access yet
      if (!milestone.has_early_access) {
        console.warn('⚠️ Auth Callback: User paid but early access not granted yet:', {
          userId: data.session.user.id,
          email: data.session.user.email,
          accessGrantedDate: milestone.access_granted_date,
        });

        return NextResponse.redirect(`${origin}/waitlist-welcome?status=access_pending`);
      }

      // ✅ User has paid AND has early access - allow dashboard access
      console.log('✅ Auth Callback: Payment verified, granting access:', {
        userId: data.session.user.id,
        email: data.session.user.email,
        isFoundingMember: milestone.is_founding_member,
        hasEarlyAccess: milestone.has_early_access,
      });

      // Create a customer ID based on Supabase user ID (consistent format)
      // Use a prefix + first 15 chars of user ID to match modern-platform format
      const customerId = 'dru' + data.session.user.id.replace(/-/g, '').substring(0, 15);

      // Generate secure access token (you can enhance this with proper JWT signing)
      const accessToken = 'supabase-oauth-' + Date.now();

      console.log('🔄 Redirecting to modern-platform dashboard:', {
        customerId,
        accessToken: accessToken.substring(0, 20) + '...'
      });

      // Get the 'next' parameter from the callback URL
      const next = searchParams.get('next') || '/dashboard'

      // Add auth_loading parameter to trigger session sync loading screen
      const redirectUrl = new URL(next, origin);
      redirectUrl.searchParams.set('auth_loading', 'true');
      console.log('🔄 Redirecting paid user to:', redirectUrl.toString());

      // Redirect to the requested page after successful auth
      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  // If no code and no error, something went wrong
  return NextResponse.redirect(`${origin}/login?error=no_code_provided`)
}