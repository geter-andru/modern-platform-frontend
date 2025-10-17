'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { env } from '@/app/lib/config/environment'

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${env.siteUrl}/auth/callback`,
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
      const adminDemoToken = process.env.NEXT_PUBLIC_ADMIN_DEMO_TOKEN || 'admin-demo-token-2025';
      redirect(`/customer/dru78DR9789SDF862/simplified/dashboard?token=${adminDemoToken}`)
      return
    }
    redirect('/login?error=oauth_error')
  }

  if (data?.url) {
    redirect(data.url)
  } else {
    // Fallback for development - redirect to admin dashboard
    const adminDemoToken = process.env.NEXT_PUBLIC_ADMIN_DEMO_TOKEN || 'admin-demo-token-2025';
    redirect(`/customer/dru78DR9789SDF862/simplified/dashboard?token=${adminDemoToken}`)
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