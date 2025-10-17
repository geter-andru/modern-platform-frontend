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
        email: data.session.user.email
      })
      
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
      
      // Redirect to the requested page after successful auth
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If no code and no error, something went wrong
  return NextResponse.redirect(`${origin}/login?error=no_code_provided`)
}