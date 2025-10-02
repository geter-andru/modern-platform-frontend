'use client';

// useSupabaseAuth hook for Next.js
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export function useSupabaseAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get session');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setError(null);

        if (event === 'SIGNED_OUT') {
          // Clear any local storage or additional cleanup
          localStorage.removeItem('supabase-auth-token');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      localStorage.removeItem('supabase-auth-token');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Store auth token for compatibility
      if (data.session?.access_token) {
        localStorage.setItem('supabase-auth-token', data.session.access_token);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Store auth token for compatibility
      if (data.session?.access_token) {
        localStorage.setItem('supabase-auth-token', data.session.access_token);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  };
}