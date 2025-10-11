
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/src/shared/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you'd send this to an error tracking service like Sentry
    console.error('Error logged to service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background-primary flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-background-elevated rounded-lg p-6 border border-surface text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-accent-danger/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h1 className="text-xl font-semibold text-text-primary mb-2">
              Something went wrong
            </h1>
            
            <p className="text-text-secondary mb-4">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-text-muted hover:text-text-secondary">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-background-tertiary rounded text-sm font-mono text-text-muted overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                size="sm"
              >
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="secondary"
                size="sm"
              >
                Reload Page
              </Button>
            </div>

            <div className="mt-4 text-xs text-text-muted">
              If this problem persists, please contact support.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to trigger error boundary
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In a real app, you might want to throw this error to trigger the boundary
    // or send it to an error tracking service
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  };
};

export default GlobalErrorBoundary;
