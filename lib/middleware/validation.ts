/**
 * Zod Validation Middleware System
 * 
 * Provides comprehensive request validation, sanitization, and error handling
 * for all API routes in the modern-platform application.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { configManager } from '@/lib/config';

// Common validation schemas
export const commonSchemas = {
  // User ID validation
  userId: z.string().uuid('Invalid user ID format'),
  
  // Session ID validation
  sessionId: z.string().min(1, 'Session ID is required'),
  
  // Timestamp validation
  timestamp: z.string().datetime('Invalid timestamp format'),
  
  // Pagination validation
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
  
  // Search validation
  search: z.object({
    query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
    filters: z.record(z.any()).optional(),
  }),
  
  // File upload validation
  fileUpload: z.object({
    filename: z.string().min(1, 'Filename is required'),
    size: z.number().int().min(1).max(10 * 1024 * 1024), // 10MB max
    type: z.string().regex(/^[a-zA-Z0-9]+\/[a-zA-Z0-9-+]+$/, 'Invalid file type'),
  }),
};

// API-specific validation schemas
export const apiSchemas = {
  // Assessment API schemas
  assessment: {
    create: z.object({
      userId: commonSchemas.userId,
      sessionId: commonSchemas.sessionId,
      answers: z.record(z.any()).min(1, 'Assessment answers are required'),
      metadata: z.object({
        startTime: commonSchemas.timestamp,
        endTime: commonSchemas.timestamp,
        duration: z.number().int().min(1),
      }),
    }),
    
    update: z.object({
      id: z.string().uuid('Invalid assessment ID'),
      answers: z.record(z.any()).optional(),
      status: z.enum(['in_progress', 'completed', 'abandoned']).optional(),
    }),
    
    get: z.object({
      id: z.string().uuid('Invalid assessment ID').optional(),
      userId: commonSchemas.userId.optional(),
      sessionId: commonSchemas.sessionId.optional(),
    }),
  },
  
  // ICP Analysis API schemas
  icpAnalysis: {
    generate: z.object({
      productData: z.object({
        productName: z.string().min(1, 'Product name is required').max(100),
        productDescription: z.string().min(10, 'Product description must be at least 10 characters').max(1000),
        distinguishingFeature: z.string().min(1, 'Distinguishing feature is required').max(500),
        businessModel: z.enum(['b2b-subscription', 'b2b-one-time'], {
          errorMap: () => ({ message: 'Business model must be either b2b-subscription or b2b-one-time' })
        }),
      }),
      businessContext: z.object({
        industry: z.string().min(1, 'Industry is required').max(100),
        companySize: z.string().min(1, 'Company size is required').max(50),
        currentChallenges: z.array(z.string().min(1)).min(1, 'At least one challenge is required'),
        goals: z.array(z.string().min(1)).min(1, 'At least one goal is required'),
      }).optional(),
    }),
    
    update: z.object({
      id: z.string().uuid('Invalid ICP analysis ID'),
      sections: z.record(z.any()).optional(),
      confidence: z.number().min(0).max(100).optional(),
    }),
  },
  
  // Cost Calculator API schemas
  costCalculator: {
    calculate: z.object({
      productData: z.object({
        name: z.string().min(1, 'Product name is required'),
        description: z.string().min(1, 'Product description is required'),
        features: z.array(z.string().min(1)).min(1, 'At least one feature is required'),
      }),
      pricing: z.object({
        model: z.enum(['subscription', 'one-time', 'usage-based']),
        basePrice: z.number().min(0, 'Base price must be non-negative'),
        currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
      }),
      customerData: z.object({
        companySize: z.enum(['startup', 'small', 'medium', 'enterprise']),
        industry: z.string().min(1, 'Industry is required'),
        budget: z.number().min(0, 'Budget must be non-negative').optional(),
      }),
    }),
  },
  
  // Export API schemas
  export: {
    request: z.object({
      type: z.enum(['assessment', 'icp-analysis', 'cost-calculation', 'business-case']),
      format: z.enum(['pdf', 'docx', 'pptx', 'csv', 'json']),
      data: z.record(z.any()).min(1, 'Export data is required'),
      options: z.object({
        includeCharts: z.boolean().default(true),
        includeMetadata: z.boolean().default(true),
        template: z.string().optional(),
      }).optional(),
    }),
  },
  
  // Agent execution schemas
  agent: {
    execute: z.object({
      agentType: z.enum([
        'ProspectQualificationOptimizer',
        'DealValueCalculatorOptimizer', 
        'SalesMaterialsOptimizer',
        'DashboardOptimizer'
      ]),
      input: z.record(z.any()).min(1, 'Agent input is required'),
      options: z.object({
        priority: z.enum(['low', 'medium', 'high']).default('medium'),
        timeout: z.number().int().min(1000).max(300000).default(30000), // 30 seconds
      }).optional(),
    }),
  },
};

// Validation error response interface
export interface ValidationErrorResponse {
  success: false;
  error: 'Validation Error';
  details: {
    field: string;
    message: string;
    received?: any;
  }[];
  timestamp: string;
  requestId: string;
}

// Validation middleware class
export class ValidationMiddleware {
  private static instance: ValidationMiddleware;
  private config: any;

  private constructor() {
    this.config = configManager.getSecurity();
  }

  public static getInstance(): ValidationMiddleware {
    if (!ValidationMiddleware.instance) {
      ValidationMiddleware.instance = new ValidationMiddleware();
    }
    return ValidationMiddleware.instance;
  }

  // Main validation middleware function
  public validateRequest<T>(schema: z.ZodSchema<T>) {
    return async (request: NextRequest): Promise<{
      success: true;
      data: T;
      requestId: string;
    } | {
      success: false;
      response: NextResponse;
    }> => {
      const requestId = this.generateRequestId();
      
      try {
        // Parse request body
        const body = await this.parseRequestBody(request);
        
        // Validate against schema
        const validatedData = schema.parse(body);
        
        // Log successful validation if enabled
        if (this.config.getLoggingConfig().enableRequestLogging) {
          console.log(`✅ Request validation successful [${requestId}]`);
        }
        
        return {
          success: true,
          data: validatedData,
          requestId,
        };
        
      } catch (error) {
        return this.handleValidationError(error, requestId);
      }
    };
  }

  // Validate query parameters
  public validateQuery<T>(schema: z.ZodSchema<T>) {
    return (request: NextRequest): {
      success: true;
      data: T;
      requestId: string;
    } | {
      success: false;
      response: NextResponse;
    } => {
      const requestId = this.generateRequestId();
      
      try {
        const url = new URL(request.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        
        // Convert string values to appropriate types
        const processedParams = this.processQueryParams(queryParams);
        
        const validatedData = schema.parse(processedParams);
        
        return {
          success: true,
          data: validatedData,
          requestId,
        };
        
      } catch (error) {
        return this.handleValidationError(error, requestId);
      }
    };
  }

  // Validate path parameters
  public validateParams<T>(schema: z.ZodSchema<T>) {
    return (params: Record<string, string>): {
      success: true;
      data: T;
    } | {
      success: false;
      response: NextResponse;
    } => {
      const requestId = this.generateRequestId();
      
      try {
        const validatedData = schema.parse(params);
        
        return {
          success: true,
          data: validatedData,
        };
        
      } catch (error) {
        return this.handleValidationError(error, requestId);
      }
    };
  }

  // Parse request body with error handling
  private async parseRequestBody(request: NextRequest): Promise<any> {
    try {
      const contentType = request.headers.get('content-type');
      
      if (!contentType) {
        throw new Error('Content-Type header is required');
      }
      
      if (contentType.includes('application/json')) {
        return await request.json();
      }
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        return Object.fromEntries(formData.entries());
      }
      
      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        return Object.fromEntries(formData.entries());
      }
      
      throw new Error(`Unsupported content type: ${contentType}`);
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON in request body');
      }
      throw error;
    }
  }

  // Process query parameters to appropriate types
  private processQueryParams(params: Record<string, string>): Record<string, any> {
    const processed: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(params)) {
      // Try to parse as number
      if (!isNaN(Number(value)) && value !== '') {
        processed[key] = Number(value);
        continue;
      }
      
      // Try to parse as boolean
      if (value.toLowerCase() === 'true') {
        processed[key] = true;
        continue;
      }
      if (value.toLowerCase() === 'false') {
        processed[key] = false;
        continue;
      }
      
      // Keep as string
      processed[key] = value;
    }
    
    return processed;
  }

  // Handle validation errors
  private handleValidationError(error: any, requestId: string): {
    success: false;
    response: NextResponse;
  } {
    let errorResponse: ValidationErrorResponse;
    
    if (error instanceof z.ZodError) {
      // Zod validation error
      errorResponse = {
        success: false,
        error: 'Validation Error',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.input,
        })),
        timestamp: new Date().toISOString(),
        requestId,
      };
    } else {
      // Generic error
      errorResponse = {
        success: false,
        error: 'Validation Error',
        details: [{
          field: 'request',
          message: error.message || 'Invalid request format',
        }],
        timestamp: new Date().toISOString(),
        requestId,
      };
    }
    
    // Log validation error if enabled
    if (this.config.getLoggingConfig().enableErrorLogging) {
      console.error(`❌ Request validation failed [${requestId}]:`, errorResponse);
    }
    
    return {
      success: false,
      response: NextResponse.json(errorResponse, { status: 400 }),
    };
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Sanitize input data
  public sanitizeInput<T>(data: T): T {
    if (typeof data === 'string') {
      return data.trim().replace(/[<>]/g, '') as T;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item)) as T;
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized as T;
    }
    
    return data;
  }

  // Validate API key format
  public validateApiKey(apiKey: string, service: string): boolean {
    return this.config.validateApiKey(apiKey, service);
  }

  // Get validation summary
  public getValidationSummary(): {
    totalSchemas: number;
    commonSchemas: number;
    apiSchemas: number;
  } {
    return {
      totalSchemas: Object.keys(commonSchemas).length + Object.keys(apiSchemas).length,
      commonSchemas: Object.keys(commonSchemas).length,
      apiSchemas: Object.keys(apiSchemas).length,
    };
  }
}

// Export singleton instance
export const validationMiddleware = ValidationMiddleware.getInstance();

// Export types
export type { ValidationErrorResponse };

// Helper function to create validated API handler
export function createValidatedHandler<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, requestId: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const validation = await validationMiddleware.validateRequest(schema)(request);
    
    if (!validation.success) {
      return validation.response;
    }
    
    try {
      return await handler(validation.data, validation.requestId);
    } catch (error) {
      console.error(`❌ Handler error [${validation.requestId}]:`, error);
      return NextResponse.json(
        {
          success: false,
          error: 'Internal Server Error',
          requestId: validation.requestId,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  };
}
