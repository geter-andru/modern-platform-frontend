'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AuthUser } from './auth-service';
import type { Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with current state
    const currentUser = authService.getCurrentUser();
    const currentSession = authService.getCurrentSession();

    setUser(currentUser);
    setSession(currentSession);
    setLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setSession(authService.getCurrentSession());
      setLoading(false);

      // Clear error on successful auth change
      if (newUser) {
        setError(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.signInWithGoogle(redirectTo);
    } catch (err: any) {
      const errorMessage = err?.message || 'Sign in failed';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setSession(null);
    } catch (err: any) {
      const errorMessage = err?.message || 'Sign out failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user && !!session,
    isAdmin: user?.isAdmin || false,
    signInWithGoogle,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
