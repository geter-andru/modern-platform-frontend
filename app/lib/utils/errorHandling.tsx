// Enhanced Error Handling System for Next.js Platform
// Based on React SPA's AsyncErrorBoundary patterns

'use client';

import React from 'react';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
}

export class ApiError extends Error {
  public code: string;
  public statusCode?: number;
  public details?: any;
  public recoverable: boolean;

  constructor(
    message: string, 
    code: string = 'API_ERROR', 
    statusCode?: number, 
    details?: any,
    recoverable: boolean = true
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.recoverable = recoverable;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401, null, false);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details, true);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR', 0, null, true);
    this.name = 'NetworkError';
  }
}

// Error categorization and handling strategies
export const errorCategories = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
} as const;

export type ErrorCategory = typeof errorCategories[keyof typeof errorCategories];

// Error analysis and categorization
export function categorizeError(error: any): ErrorCategory {
  if (error instanceof AuthenticationError) {
    return errorCategories.AUTHENTICATION;
  }
  
  if (error instanceof ValidationError) {
    return errorCategories.VALIDATION;
  }
  
  if (error instanceof NetworkError) {
    return errorCategories.NETWORK;
  }
  
  if (error instanceof ApiError) {
    if (error.statusCode === 401) return errorCategories.AUTHENTICATION;
    if (error.statusCode === 403) return errorCategories.AUTHORIZATION;
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) return errorCategories.CLIENT;
    if (error.statusCode && error.statusCode >= 500) return errorCategories.SERVER;
  }
  
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return errorCategories.NETWORK;
  }
  
  return errorCategories.UNKNOWN;
}

// User-friendly error messages
export function getUserFriendlyMessage(error: any): string {
  const category = categorizeError(error);
  
  switch (category) {
    case errorCategories.AUTHENTICATION:
      return 'Please log in to continue. Your session may have expired.';
    case errorCategories.AUTHORIZATION:
      return 'You don\'t have permission to access this feature.';
    case errorCategories.VALIDATION:
      return error.message || 'Please check your input and try again.';
    case errorCategories.NETWORK:
      return 'Connection issue. Please check your internet and try again.';
    case errorCategories.SERVER:
      return 'Server error. Our team has been notified. Please try again later.';
    case errorCategories.CLIENT:
      return error.message || 'Something went wrong. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

// Recovery strategies
export interface RecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  primary?: boolean;
}

export function getRecoveryActions(error: any, context: any = {}): RecoveryAction[] {
  const category = categorizeError(error);
  const actions: RecoveryAction[] = [];
  
  switch (category) {
    case errorCategories.AUTHENTICATION:
      actions.push({
        label: 'Log In Again',
        action: () => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        },
        primary: true
      });
      break;
      
    case errorCategories.NETWORK:
      actions.push({
        label: 'Retry',
        action: context.retry || (() => window.location.reload()),
        primary: true
      });
      actions.push({
        label: 'Go Home',
        action: () => {
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }
      });
      break;
      
    case errorCategories.VALIDATION:
      if (context.retry) {
        actions.push({
          label: 'Try Again',
          action: context.retry,
          primary: true
        });
      }
      break;
      
    default:
      if (context.retry) {
        actions.push({
          label: 'Retry',
          action: context.retry,
          primary: true
        });
      }
      actions.push({
        label: 'Go Back',
        action: () => {
          if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/dashboard';
          }
        }
      });
  }
  
  return actions;
}

// Error logging and reporting
export function logError(error: any, context: any = {}) {
  const errorInfo: AppError = {
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message || 'Unknown error occurred',
    details: {
      stack: error.stack,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      timestamp: Date.now()
    },
    timestamp: Date.now(),
    recoverable: error.recoverable ?? true
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error: ${errorInfo.code}`);
    console.error('Message:', errorInfo.message);
    console.error('Details:', errorInfo.details);
    console.error('Stack:', error.stack);
    console.groupEnd();
  }
  
  // In production, send to error reporting service
  // TODO: Integrate with error reporting service (Sentry, etc.)
  
  return errorInfo;
}

// Retry logic with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error instanceof AuthenticationError || 
          (error instanceof ApiError && !error.recoverable)) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: any = {}
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    const appError = logError(error, context);
    return { error: appError };
  }
}

// Component error boundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<{ error: any; retry: () => void }>
) {
  return function WrappedComponent(props: P) {
    const [error, setError] = React.useState<any>(null);
    
    const resetError = () => setError(null);
    
    React.useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        setError(event.error);
      };
      
      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);
    
    if (error) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent error={error} retry={resetError} />;
      }
      
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">{getUserFriendlyMessage(error)}</p>
            <button
              onClick={resetError}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

export default {
  ApiError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  categorizeError,
  getUserFriendlyMessage,
  getRecoveryActions,
  logError,
  retryWithBackoff,
  safeAsync,
  withErrorBoundary
};