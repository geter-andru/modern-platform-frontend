/**
 * Standardized Error Handling System
 * 
 * Provides comprehensive error handling, logging, and response formatting
 * for all API routes in the modern-platform application.
 */

import { NextRequest, NextResponse } from 'next/server';
import { configManager } from '@/lib/config';

// Error types and categories
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Standard error response interface
export interface StandardErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
    severity: ErrorSeverity;
    retryable: boolean;
    documentation?: string;
  };
  metadata?: {
    endpoint: string;
    method: string;
    userAgent?: string;
    ip?: string;
  };
}

// Custom error class
export class ApiError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly retryable: boolean;
  public readonly details?: any;
  public readonly documentation?: string;

  constructor(
    type: ErrorType,
    message: string,
    statusCode: number = 500,
    options: {
      code?: string;
      severity?: ErrorSeverity;
      retryable?: boolean;
      details?: any;
      documentation?: string;
    } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.code = options.code || type;
    this.statusCode = statusCode;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.retryable = options.retryable || false;
    this.details = options.details;
    this.documentation = options.documentation;
  }
}

// Error handling middleware class
export class ErrorHandlingMiddleware {
  private static instance: ErrorHandlingMiddleware;
  private config: any;

  private constructor() {
    this.config = configManager.getSecurity();
  }

  public static getInstance(): ErrorHandlingMiddleware {
    if (!ErrorHandlingMiddleware.instance) {
      ErrorHandlingMiddleware.instance = new ErrorHandlingMiddleware();
    }
    return ErrorHandlingMiddleware.instance;
  }

  // Main error handling function
  public handleError(
    error: Error | ApiError,
    request: NextRequest,
    requestId: string
  ): NextResponse {
    const apiError = this.normalizeError(error);
    const errorResponse = this.createErrorResponse(apiError, request, requestId);
    
    // Log error
    this.logError(apiError, request, requestId);
    
    return errorResponse;
  }

  // Normalize error to ApiError
  private normalizeError(error: Error | ApiError): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return new ApiError(
        ErrorType.VALIDATION_ERROR,
        error.message,
        400,
        { severity: ErrorSeverity.LOW, retryable: false }
      );
    }

    if (error.name === 'UnauthorizedError') {
      return new ApiError(
        ErrorType.AUTHENTICATION_ERROR,
        error.message,
        401,
        { severity: ErrorSeverity.MEDIUM, retryable: false }
      );
    }

    if (error.name === 'ForbiddenError') {
      return new ApiError(
        ErrorType.AUTHORIZATION_ERROR,
        error.message,
        403,
        { severity: ErrorSeverity.MEDIUM, retryable: false }
      );
    }

    if (error.name === 'NotFoundError') {
      return new ApiError(
        ErrorType.NOT_FOUND_ERROR,
        error.message,
        404,
        { severity: ErrorSeverity.LOW, retryable: false }
      );
    }

    if (error.name === 'RateLimitError') {
      return new ApiError(
        ErrorType.RATE_LIMIT_ERROR,
        error.message,
        429,
        { severity: ErrorSeverity.MEDIUM, retryable: true }
      );
    }

    if (error.name === 'TimeoutError') {
      return new ApiError(
        ErrorType.TIMEOUT_ERROR,
        error.message,
        408,
        { severity: ErrorSeverity.MEDIUM, retryable: true }
      );
    }

    // Default to internal server error
    return new ApiError(
      ErrorType.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred',
      500,
      { 
        severity: ErrorSeverity.HIGH, 
        retryable: false,
        details: this.config.getLoggingConfig().level === 'debug' ? error.stack : undefined
      }
    );
  }

  // Create standardized error response
  private createErrorResponse(
    error: ApiError,
    request: NextRequest,
    requestId: string
  ): NextResponse {
    const errorResponse: StandardErrorResponse = {
      success: false,
      error: {
        type: error.type,
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId,
        severity: error.severity,
        retryable: error.retryable,
        documentation: error.documentation,
      },
      metadata: {
        endpoint: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent') || undefined,
        ip: this.getClientIP(request),
      },
    };

    // Add retry-after header for retryable errors
    const headers: Record<string, string> = {};
    if (error.retryable) {
      headers['Retry-After'] = this.getRetryAfter(error.type);
    }

    // Add error-specific headers
    if (error.type === ErrorType.RATE_LIMIT_ERROR) {
      headers['X-RateLimit-Limit'] = '100';
      headers['X-RateLimit-Remaining'] = '0';
      headers['X-RateLimit-Reset'] = Math.floor(Date.now() / 1000 + 900).toString(); // 15 minutes
    }

    return NextResponse.json(errorResponse, { 
      status: error.statusCode,
      headers,
    });
  }

  // Log error based on severity and configuration
  private logError(
    error: ApiError,
    request: NextRequest,
    requestId: string
  ): void {
    const loggingConfig = this.config.getLoggingConfig();
    
    if (!loggingConfig.enableErrorLogging) {
      return;
    }

    const logData = {
      requestId,
      error: {
        type: error.type,
        code: error.code,
        message: error.message,
        severity: error.severity,
        retryable: error.retryable,
      },
      request: {
        method: request.method,
        url: request.url,
        userAgent: request.headers.get('user-agent'),
        ip: this.getClientIP(request),
      },
      timestamp: new Date().toISOString(),
    };

    // Log based on severity
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🚨 CRITICAL ERROR:', logData);
        break;
      case ErrorSeverity.HIGH:
        console.error('❌ HIGH SEVERITY ERROR:', logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️  MEDIUM SEVERITY ERROR:', logData);
        break;
      case ErrorSeverity.LOW:
        console.info('ℹ️  LOW SEVERITY ERROR:', logData);
        break;
    }
  }

  // Get client IP address
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (clientIP) {
      return clientIP;
    }
    
    return 'unknown';
  }

  // Get retry-after value based on error type
  private getRetryAfter(errorType: ErrorType): string {
    switch (errorType) {
      case ErrorType.RATE_LIMIT_ERROR:
        return '900'; // 15 minutes
      case ErrorType.TIMEOUT_ERROR:
        return '60'; // 1 minute
      case ErrorType.EXTERNAL_SERVICE_ERROR:
        return '300'; // 5 minutes
      case ErrorType.NETWORK_ERROR:
        return '120'; // 2 minutes
      default:
        return '60'; // 1 minute
    }
  }

  // Create error from type
  public createError(
    type: ErrorType,
    message: string,
    statusCode: number = 500,
    options: {
      code?: string;
      severity?: ErrorSeverity;
      retryable?: boolean;
      details?: any;
      documentation?: string;
    } = {}
  ): ApiError {
    return new ApiError(type, message, statusCode, options);
  }

  // Common error creators
  public validationError(message: string, details?: any): ApiError {
    return this.createError(
      ErrorType.VALIDATION_ERROR,
      message,
      400,
      { severity: ErrorSeverity.LOW, retryable: false, details }
    );
  }

  public authenticationError(message: string = 'Authentication required'): ApiError {
    return this.createError(
      ErrorType.AUTHENTICATION_ERROR,
      message,
      401,
      { severity: ErrorSeverity.MEDIUM, retryable: false }
    );
  }

  public authorizationError(message: string = 'Insufficient permissions'): ApiError {
    return this.createError(
      ErrorType.AUTHORIZATION_ERROR,
      message,
      403,
      { severity: ErrorSeverity.MEDIUM, retryable: false }
    );
  }

  public notFoundError(message: string = 'Resource not found'): ApiError {
    return this.createError(
      ErrorType.NOT_FOUND_ERROR,
      message,
      404,
      { severity: ErrorSeverity.LOW, retryable: false }
    );
  }

  public rateLimitError(message: string = 'Rate limit exceeded'): ApiError {
    return this.createError(
      ErrorType.RATE_LIMIT_ERROR,
      message,
      429,
      { severity: ErrorSeverity.MEDIUM, retryable: true }
    );
  }

  public externalServiceError(service: string, message?: string): ApiError {
    return this.createError(
      ErrorType.EXTERNAL_SERVICE_ERROR,
      message || `External service '${service}' is unavailable`,
      502,
      { 
        severity: ErrorSeverity.HIGH, 
        retryable: true,
        details: { service }
      }
    );
  }

  public databaseError(message: string = 'Database operation failed'): ApiError {
    return this.createError(
      ErrorType.DATABASE_ERROR,
      message,
      500,
      { severity: ErrorSeverity.HIGH, retryable: true }
    );
  }

  public internalServerError(message: string = 'Internal server error'): ApiError {
    return this.createError(
      ErrorType.INTERNAL_SERVER_ERROR,
      message,
      500,
      { severity: ErrorSeverity.HIGH, retryable: false }
    );
  }

  // Get error statistics
  public getErrorStatistics(): {
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
  } {
    // This would typically come from a logging service
    // For now, return empty statistics
    return {
      totalErrors: 0,
      errorsByType: {} as Record<ErrorType, number>,
      errorsBySeverity: {} as Record<ErrorSeverity, number>,
    };
  }
}

// Export singleton instance
export const errorHandler = ErrorHandlingMiddleware.getInstance();

// Helper function to create error handler wrapper
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      return await handler(request);
    } catch (error) {
      return errorHandler.handleError(error as Error, request, requestId);
    }
  };
}

// Export types
export type { StandardErrorResponse };
