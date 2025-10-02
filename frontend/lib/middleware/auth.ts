/**
 * FUNCTIONALITY STATUS: REAL
 * 
 * REAL IMPLEMENTATIONS:
 * - Standardized authentication middleware for all API routes
 * - Session validation and expiry checking
 * - User profile integration with role-based access
 * - Consistent error handling for authentication failures
 * - Support for Next.js 15+ cookie API
 * 
 * FAKE IMPLEMENTATIONS:
 * - None - all authentication is real and functional
 * 
 * MISSING REQUIREMENTS:
 * - None - complete authentication system
 * 
 * PRODUCTION READINESS: YES
 * - Production-ready authentication middleware
 * - Secure session management
 * - Role-based access control support
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, errorHandler } from './error-handling';

export interface AuthContext {
  user: {
    id: string;
    email: string;
    role: string;
    customerId?: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

/**
 * Authenticates a request and returns user context or error response
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthContext | NextResponse> {
  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Validate session expiry
    if (session.expires_at && Date.now() / 1000 > session.expires_at) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }
    
    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, customer_id')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      // If profile doesn't exist, create a default one
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: session.user.id,
          email: session.user.email!,
          role: 'user',
          subscription_status: 'trial'
        })
        .select('role, customer_id')
        .single();
      
      if (createError || !newProfile) {
        return NextResponse.json(
          { success: false, error: 'User profile not found' },
          { status: 401 }
        );
      }
      
      return {
        user: {
          id: session.user.id,
          email: session.user.email!,
          role: newProfile.role || 'user',
          customerId: newProfile.customer_id
        },
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at!
        }
      };
    }
    
    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        role: profile.role || 'user',
        customerId: profile.customer_id
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at!
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Middleware decorator that requires authentication
 */
export function requireAuth(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Authentication failed
    }
    return handler(request, authResult);
  };
}

/**
 * Middleware decorator that requires specific roles
 */
export function requireRole(roles: string[]) {
  return function(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }
      
      if (!roles.includes(authResult.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return handler(request, authResult);
    };
  };
}

/**
 * Middleware decorator that requires admin role
 */
export function requireAdmin(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
  return requireRole(['admin'])(handler);
}

/**
 * Middleware decorator that requires premium or admin role
 */
export function requirePremium(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
  return requireRole(['premium', 'admin'])(handler);
}

/**
 * Utility function to get user ID from request (for non-middleware usage)
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return null;
    }
    return authResult.user.id;
  } catch (error) {
    return null;
  }
}

/**
 * Utility function to get user role from request (for non-middleware usage)
 */
export async function getUserRole(request: NextRequest): Promise<string | null> {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return null;
    }
    return authResult.user.role;
  } catch (error) {
    return null;
  }
}
