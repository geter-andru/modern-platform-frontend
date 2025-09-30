import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { AuthenticationError } from '../utils/errorHandling';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export function useAdvancedAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  const updateAuthState = useCallback((user: User | null, session: Session | null) => {
    setState(prev => ({
      ...prev,
      user,
      session,
      isAuthenticated: !!user && !!session,
      loading: false
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw new AuthenticationError(error.message);

      updateAuthState(data.user, data.session);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState, setError]);

  const signUp = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw new AuthenticationError(error.message);

      updateAuthState(data.user, data.session);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign up failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState, setError]);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new AuthenticationError(error.message);

      updateAuthState(null, null);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign out failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState, setError]);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw new AuthenticationError(error.message);

      updateAuthState(session?.user ?? null, session);
    } catch (error: any) {
      setError(error.message || 'Session refresh failed');
    }
  }, [updateAuthState, setError]);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw new AuthenticationError(error.message);
        
        if (mounted) {
          updateAuthState(session?.user ?? null, session);
        }
      } catch (error: any) {
        if (mounted) {
          setError(error.message || 'Failed to get session');
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          console.log('Auth state changed:', event);
          updateAuthState(session?.user ?? null, session);
          
          if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState, setError]);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
    clearError
  };
}