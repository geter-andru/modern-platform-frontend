'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
// import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) {
          setError(error.message);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get session');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setError(null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabaseClient.auth]);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabaseClient.auth.refreshSession();
      if (error) {
        setError(error.message);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh session');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signOut,
    refreshSession
  };
}
