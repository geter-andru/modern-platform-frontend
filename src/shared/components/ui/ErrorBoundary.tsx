'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bug, 
  ChevronDown,
  Copy,
  ExternalLink,
  Home 
} from 'lucide-react';

/**
 * ErrorBoundary - Comprehensive error boundary system
 * 
 * Features:
 * - React error boundary with fallback UI
 * - Error logging and reporting
 * - User-friendly error messages
 * - Retry functionality
 * - Error details expansion
 * - Development vs production modes
 * - Custom error actions
 * - Error recovery suggestions
 */

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showReportButton?: boolean;
  isDevelopment?: boolean;
  className?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo
    });

    // Log error
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call onError callback
    this.props.onError?.(error, errorInfo);

    // In development, you might want to report to error tracking service
    if (!this.props.isDevelopment) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Implement error reporting to your service (e.g., Sentry, LogRocket, etc.)
    // This is a placeholder for actual error reporting implementation
    console.log('Error reported:', { error, errorInfo });
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
        retryCount: prevState.retryCount + 1
      }));

      // Add a small delay to prevent immediate retry loops
      this.retryTimeoutId = setTimeout(() => {
        // Force a re-render
        this.forceUpdate();
      }, 100);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0
    });
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  private copyErrorToClipboard = async () => {
    const { error, errorInfo } = this.state;
    const errorText = `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`;
    
    try {
      await navigator.clipboard.writeText(errorText);
      // You could show a toast here
      console.log('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    const { hasError, error, errorInfo, showDetails, retryCount } = this.state;
    const { children, fallback, maxRetries = 3, showReportButton = true, isDevelopment = false, className = '' } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className={`min-h-[400px] flex items-center justify-center p-6 ${className}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full bg-gray-800 rounded-xl border border-gray-700 p-8 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </motion.div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-gray-400 mb-6 leading-relaxed">
              {isDevelopment && error?.message ? (
                error.message
              ) : (
                "We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue."
              )}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              {/* Retry Button */}
              {retryCount < maxRetries && (
                <button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                </button>
              )}

              {/* Reset Button */}
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>

              {/* Report Button */}
              {showReportButton && (
                <button
                  onClick={() => this.reportError(error!, errorInfo!)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 hover:text-white transition-colors"
                >
                  <Bug className="w-4 h-4" />
                  Report Issue
                </button>
              )}
            </div>

            {/* Max Retries Reached */}
            {retryCount >= maxRetries && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Maximum retry attempts reached. Please refresh the page or contact support if the problem persists.
                </p>
              </div>
            )}

            {/* Error Details (Development) */}
            {isDevelopment && error && (
              <div className="text-left">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                  Show Error Details
                </button>

                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-900 rounded-lg p-4 text-xs font-mono overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400 font-semibold">Error Details</span>
                      <button
                        onClick={this.copyErrorToClipboard}
                        className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-auto">
                      {/* Error Message */}
                      <div>
                        <div className="text-gray-400 mb-1">Message:</div>
                        <div className="text-red-300 bg-red-500/10 p-2 rounded border-l-4 border-red-500">
                          {error.message}
                        </div>
                      </div>

                      {/* Error Stack */}
                      {error.stack && (
                        <div>
                          <div className="text-gray-400 mb-1">Stack Trace:</div>
                          <pre className="text-gray-300 bg-gray-800 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {/* Component Stack */}
                      {errorInfo?.componentStack && (
                        <div>
                          <div className="text-gray-400 mb-1">Component Stack:</div>
                          <pre className="text-gray-300 bg-gray-800 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Help Links */}
            <div className="pt-6 border-t border-gray-700 text-sm">
              <p className="text-gray-500 mb-3">Need help?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/help"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Help Center
                </a>
                <a
                  href="/contact"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Contact Support
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return children;
  }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  // Throw error to trigger error boundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
};

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Simple error fallback components
export const SimpleErrorFallback: React.FC<{ error?: Error; retry?: () => void }> = ({ 
  error, 
  retry 
}) => (
  <div className="p-6 text-center bg-gray-800 rounded-lg border border-gray-700">
    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
    <p className="text-gray-400 mb-4">
      {error?.message || 'An unexpected error occurred'}
    </p>
    {retry && (
      <button
        onClick={retry}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export const MinimalErrorFallback: React.FC = () => (
  <div className="p-4 text-center text-gray-400">
    <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
    <p className="text-sm">Unable to load content</p>
  </div>
);

export default ErrorBoundary;