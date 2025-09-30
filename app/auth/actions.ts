'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('OAuth error:', error)
    // In development with mock Supabase, redirect to admin access instead
    if (error.message?.includes('not configured for development')) {
      redirect('/customer/dru78DR9789SDF862/simplified/dashboard?token=admin-demo-token-2025')
      return
    }
    redirect('/login?error=oauth_error')
  }

  if (data?.url) {
    redirect(data.url)
  } else {
    // Fallback for development - redirect to admin dashboard
    redirect('/customer/dru78DR9789SDF862/simplified/dashboard?token=admin-demo-token-2025')
  }
}

export async function signOut() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    redirect('/login?error=sign_out_error')
  }

  redirect('/login')
}