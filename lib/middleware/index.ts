/**
 * Middleware System Entry Point
 * 
 * Provides a centralized middleware system that combines validation,
 * versioning, error handling, and security for all API routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validationMiddleware } from './validation';
import { apiVersioning } from './api-versioning';
import { errorHandler } from './error-handling';
import { configManager } from '@/lib/config';

// Middleware configuration interface
export interface MiddlewareConfig {
  enableValidation: boolean;
  enableVersioning: boolean;
  enableErrorHandling: boolean;
  enableSecurity: boolean;
  enableLogging: boolean;
  enableRateLimiting: boolean;
}

// Default middleware configuration
const defaultConfig: MiddlewareConfig = {
  enableValidation: true,
  enableVersioning: true,
  enableErrorHandling: true,
  enableSecurity: true,
  enableLogging: true,
  enableRateLimiting: true,
};

// Comprehensive middleware class
export class ComprehensiveMiddleware {
  private static instance: ComprehensiveMiddleware;
  private config: MiddlewareConfig;
  private securityConfig: any;

  private constructor(config: MiddlewareConfig = defaultConfig) {
    this.config = config;
    this.securityConfig = configManager.getSecurity();
  }

  public static getInstance(config?: MiddlewareConfig): ComprehensiveMiddleware {
    if (!ComprehensiveMiddleware.instance) {
      ComprehensiveMiddleware.instance = new ComprehensiveMiddleware(config);
    }
    return ComprehensiveMiddleware.instance;
  }

  // Main middleware function
  public async processRequest(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const requestId = this.generateRequestId();
    
    try {
      // 1. Security checks
      if (this.config.enableSecurity) {
        const securityResult = await this.processSecurity(request);
        if (!securityResult.success) {
          return securityResult.response;
        }
      }

      // 2. Rate limiting
      if (this.config.enableRateLimiting) {
        const rateLimitResult = await this.processRateLimit(request);
        if (!rateLimitResult.success) {
          return rateLimitResult.response;
        }
      }

      // 3. API versioning
      if (this.config.enableVersioning) {
        const versionResult = this.processVersioning(request);
        if (!versionResult.success) {
          return versionResult.response;
        }
      }

      // 4. Request logging
      if (this.config.enableLogging) {
        this.logRequest(request, requestId);
      }

      // 5. Execute handler
      const response = await handler(request);

      // 6. Add security headers
      if (this.config.enableSecurity) {
        this.addSecurityHeaders(response);
      }

      // 7. Add version headers
      if (this.config.enableVersioning) {
        const version = apiVersioning.extractVersion(request).version;
        apiVersioning.addVersionHeaders(response, version);
      }

      // 8. Response logging
      if (this.config.enableLogging) {
        this.logResponse(response, requestId);
      }

      return response;

    } catch (error) {
      // Handle any errors that occur during middleware processing
      if (this.config.enableErrorHandling) {
        return errorHandler.handleError(error as Error, request, requestId);
      }
      
      // Fallback error response
      return NextResponse.json(
        {
          success: false,
          error: 'Middleware processing failed',
          requestId,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  }

  // Security processing
  private async processSecurity(request: NextRequest): Promise<{
    success: boolean;
    response?: NextResponse;
  }> {
    try {
      // Check CORS
      const origin = request.headers.get('origin');
      if (origin && !this.securityConfig.validateOrigin(origin)) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'CORS policy violation' },
            { status: 403 }
          ),
        };
      }

      // Check for malicious patterns
      const url = request.url;
      if (this.containsMaliciousPattern(url)) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Request contains suspicious patterns' },
            { status: 400 }
          ),
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Security processing error:', error);
      return { success: true }; // Allow request to continue
    }
  }

  // Rate limiting processing
  private async processRateLimit(request: NextRequest): Promise<{
    success: boolean;
    response?: NextResponse;
  }> {
    try {
      // Simple in-memory rate limiting (in production, use Redis or similar)
      const clientIP = this.getClientIP(request);
      const rateLimitConfig = this.securityConfig.getRateLimitConfig();
      
      // Check rate limit (simplified implementation)
      const isRateLimited = await this.checkRateLimit(clientIP, rateLimitConfig);
      
      if (isRateLimited) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Rate limit exceeded' },
            { 
              status: 429,
              headers: {
                'Retry-After': '900', // 15 minutes
                'X-RateLimit-Limit': rateLimitConfig.max.toString(),
                'X-RateLimit-Remaining': '0',
              },
            }
          ),
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Rate limiting error:', error);
      return { success: true }; // Allow request to continue
    }
  }

  // API versioning processing
  private processVersioning(request: NextRequest): {
    success: boolean;
    response?: NextResponse;
  } {
    try {
      const { version } = apiVersioning.extractVersion(request);
      const validation = apiVersioning.validateVersion(version);
      
      if (!validation.isValid) {
        return {
          success: false,
          response: NextResponse.json(
            { error: validation.error },
            { status: 400 }
          ),
        };
      }

      if (validation.isSunset) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'API version has been sunset' },
            { status: 410 }
          ),
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Versioning error:', error);
      return { success: true }; // Allow request to continue
    }
  }

  // Add security headers to response
  private addSecurityHeaders(response: NextResponse): void {
    const securityHeaders = this.securityConfig.getSecurityHeaders();
    
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value);
    }
  }

  // Check for malicious patterns
  private containsMaliciousPattern(url: string): boolean {
    const maliciousPatterns = [
      /\.\.\//, // Directory traversal
      /<script/i, // XSS attempts
      /javascript:/i, // JavaScript injection
      /on\w+\s*=/i, // Event handler injection
      /union\s+select/i, // SQL injection
      /drop\s+table/i, // SQL injection
    ];

    return maliciousPatterns.some(pattern => pattern.test(url));
  }

  // Get client IP address
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  }

  // Simple rate limiting check (in production, use Redis)
  private async checkRateLimit(clientIP: string, config: any): Promise<boolean> {
    // This is a simplified implementation
    // In production, you would use Redis or a similar service
    return false; // Allow all requests for now
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log request
  private logRequest(request: NextRequest, requestId: string): void {
    const loggingConfig = this.securityConfig.getLoggingConfig();
    
    if (!loggingConfig.enableRequestLogging) {
      return;
    }

    console.log(`📥 Request [${requestId}]:`, {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: this.getClientIP(request),
      timestamp: new Date().toISOString(),
    });
  }

  // Log response
  private logResponse(response: NextResponse, requestId: string): void {
    const loggingConfig = this.securityConfig.getLoggingConfig();
    
    if (!loggingConfig.enableRequestLogging) {
      return;
    }

    console.log(`📤 Response [${requestId}]:`, {
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString(),
    });
  }

  // Get middleware statistics
  public getMiddlewareStatistics(): {
    config: MiddlewareConfig;
    validationStats: any;
    versioningStats: any;
    errorStats: any;
  } {
    return {
      config: this.config,
      validationStats: validationMiddleware.getValidationSummary(),
      versioningStats: apiVersioning.getVersionStatistics(),
      errorStats: errorHandler.getErrorStatistics(),
    };
  }

  // Update middleware configuration
  public updateConfig(newConfig: Partial<MiddlewareConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const comprehensiveMiddleware = ComprehensiveMiddleware.getInstance();

// Helper function to create middleware wrapper
export function withMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: Partial<MiddlewareConfig>
) {
  const middleware = ComprehensiveMiddleware.getInstance();
  
  if (config) {
    middleware.updateConfig(config);
  }
  
  return async (request: NextRequest): Promise<NextResponse> => {
    return middleware.processRequest(request, handler);
  };
}

// Export individual middleware components
export { validationMiddleware } from './validation';
export { apiVersioning } from './api-versioning';
export { errorHandler } from './error-handling';

// Export types
export type { MiddlewareConfig };
