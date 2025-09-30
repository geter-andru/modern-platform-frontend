'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function MinimalAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Do nothing - let Supabase handle everything via detectSessionInUrl
    // Just listen for the auth state change
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Minimal Callback - Auth event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in, redirecting to dashboard');
        router.replace('/dashboard');
      } else if (event === 'INITIAL_SESSION' && session) {
        console.log('✅ Initial session detected, redirecting to dashboard');
        router.replace('/dashboard');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 Token refreshed');
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        router.replace('/login');
      }
    });

    // Also check for existing session after a brief delay
    setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('✅ Session exists, redirecting to dashboard');
        router.replace('/dashboard');
      } else {
        console.log('❌ No session after 2 seconds, redirecting to login');
        router.replace('/login');
      }
    }, 2000);

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-xl text-white mb-2">Completing Sign In</h1>
        <p className="text-gray-400">One moment please...</p>
      </div>
    </div>
  );
}