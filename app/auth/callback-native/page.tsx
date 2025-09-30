'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function NativeAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    console.log('🚀 Native callback - letting Supabase handle everything automatically');
    
    // Don't do anything manually - let Supabase detectSessionInUrl do the work
    // Just listen for auth state changes
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Native Callback - Auth event:', event);
      console.log('🔔 Session details:', {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        accessToken: session?.access_token ? 'present' : 'missing'
      });
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ SIGNED_IN event - user authenticated successfully');
        setStatus('Authentication successful! Redirecting...');
        
        // Double-check session persistence
        const { data: { session: verifySession } } = await supabase.auth.getSession();
        console.log('🔍 Session verification:', {
          sessionPersisted: !!verifySession,
          sameUser: verifySession?.user?.id === session?.user?.id
        });
        
        if (verifySession) {
          console.log('✅ Session verified, redirecting to dashboard');
          router.replace('/dashboard');
        } else {
          console.log('❌ Session not persisted, trying again...');
          setStatus('Session not persisted, retrying...');
        }
      } else if (event === 'INITIAL_SESSION' && session) {
        console.log('✅ INITIAL_SESSION - existing session detected');
        setStatus('Existing session found, redirecting...');
        router.replace('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setStatus('Signed out, redirecting to login...');
        router.replace('/login');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
      } else {
        console.log('⚠️ Unhandled auth event:', event, 'Session exists:', !!session);
      }
    });

    // Also check for existing session after a delay
    setTimeout(async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🕒 Delayed session check:', { 
        hasSession: !!session, 
        error,
        userId: session?.user?.id
      });
      
      if (session) {
        console.log('✅ Delayed check found session, redirecting');
        setStatus('Session found, redirecting...');
        router.replace('/dashboard');
      } else if (!session && !error) {
        console.log('❌ No session after 3 seconds, returning to login');
        setStatus('Authentication failed, redirecting to login...');
        setTimeout(() => router.replace('/login'), 2000);
      }
    }, 3000);

    return () => {
      console.log('🧹 Unsubscribing from auth changes');
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-xl text-white mb-2">Native OAuth Processing</h1>
        <p className="text-gray-400">{status}</p>
        <div className="mt-8 text-xs text-gray-600">
          <p>This callback lets Supabase handle OAuth completely natively.</p>
          <p>Using detectSessionInUrl: true and onAuthStateChange.</p>
        </div>
      </div>
    </div>
  );
}