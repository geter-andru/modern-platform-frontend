'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SimpleAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Let Supabase handle the OAuth callback automatically
    // The detectSessionInUrl: true in the client config should handle this
    
    const checkSession = async () => {
      console.log('🔍 Simple Callback - Checking for session after OAuth...');
      
      // Wait a moment for Supabase to process the URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if session exists
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('📊 Session check result:', {
        hasSession: !!session,
        sessionError: error,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      if (session) {
        console.log('✅ Session found! Redirecting to dashboard...');
        router.replace('/dashboard');
      } else {
        console.log('❌ No session found after OAuth callback');
        
        // Try one more time after another delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          console.log('✅ Session found on retry! Redirecting to dashboard...');
          router.replace('/dashboard');
        } else {
          console.log('❌ Still no session, redirecting to login...');
          router.replace('/login');
        }
      }
    };

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state change in simple callback:', event);
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ SIGNED_IN event detected! Redirecting to dashboard...');
        router.replace('/dashboard');
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-xl text-white mb-2">Processing Authentication</h1>
        <p className="text-gray-400">Please wait while we complete your sign-in...</p>
        <div className="mt-8 text-xs text-gray-600">
          <p>This simplified callback lets Supabase handle OAuth automatically.</p>
        </div>
      </div>
    </div>
  );
}