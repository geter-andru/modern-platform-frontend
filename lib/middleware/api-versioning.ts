/**
 * API Versioning System
 * 
 * Provides comprehensive API versioning, backward compatibility,
 * and migration support for the modern-platform application.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// API version configuration
export interface ApiVersion {
  version: string;
  status: 'current' | 'deprecated' | 'sunset';
  releaseDate: string;
  sunsetDate?: string;
  migrationGuide?: string;
  breakingChanges: string[];
  newFeatures: string[];
}

// API version registry
export const apiVersions: Record<string, ApiVersion> = {
  'v1': {
    version: 'v1',
    status: 'current',
    releaseDate: '2025-01-27',
    breakingChanges: [],
    newFeatures: [
      'Initial API release',
      'Assessment API',
      'ICP Analysis API',
      'Cost Calculator API',
      'Export API',
      'Agent Execution API',
    ],
  },
  'v2': {
    version: 'v2',
    status: 'deprecated',
    releaseDate: '2025-01-27',
    sunsetDate: '2025-04-27',
    migrationGuide: '/docs/api/v2-migration',
    breakingChanges: [
      'Assessment API response format changed',
      'ICP Analysis API input validation updated',
      'Export API file format options modified',
    ],
    newFeatures: [
      'Enhanced validation middleware',
      'Improved error responses',
      'Better pagination support',
    ],
  },
};

// Version header validation schema
const versionHeaderSchema = z.object({
  'API-Version': z.string().regex(/^v\d+$/, 'Invalid API version format').optional(),
  'Accept-Version': z.string().regex(/^v\d+$/, 'Invalid API version format').optional(),
});

// API versioning middleware class
export class ApiVersioningMiddleware {
  private static instance: ApiVersioningMiddleware;
  private defaultVersion: string = 'v1';
  private supportedVersions: string[] = ['v1'];

  private constructor() {}

  public static getInstance(): ApiVersioningMiddleware {
    if (!ApiVersioningMiddleware.instance) {
      ApiVersioningMiddleware.instance = new ApiVersioningMiddleware();
    }
    return ApiVersioningMiddleware.instance;
  }

  // Extract version from request
  public extractVersion(request: NextRequest): {
    version: string;
    source: 'header' | 'query' | 'path' | 'default';
  } {
    // Check API-Version header
    const apiVersionHeader = request.headers.get('API-Version');
    if (apiVersionHeader) {
      return { version: apiVersionHeader, source: 'header' };
    }

    // Check Accept-Version header
    const acceptVersionHeader = request.headers.get('Accept-Version');
    if (acceptVersionHeader) {
      return { version: acceptVersionHeader, source: 'header' };
    }

    // Check query parameter
    const url = new URL(request.url);
    const versionParam = url.searchParams.get('version');
    if (versionParam) {
      return { version: versionParam, source: 'query' };
    }

    // Check path parameter (e.g., /api/v1/...)
    const pathMatch = request.url.match(/\/api\/(v\d+)\//);
    if (pathMatch) {
      return { version: pathMatch[1], source: 'path' };
    }

    // Return default version
    return { version: this.defaultVersion, source: 'default' };
  }

  // Validate API version
  public validateVersion(version: string): {
    isValid: boolean;
    isSupported: boolean;
    isDeprecated: boolean;
    isSunset: boolean;
    versionInfo?: ApiVersion;
    error?: string;
  } {
    const versionInfo = apiVersions[version];
    
    if (!versionInfo) {
      return {
        isValid: false,
        isSupported: false,
        isDeprecated: false,
        isSunset: false,
        error: `API version '${version}' is not recognized`,
      };
    }

    const isSupported = this.supportedVersions.includes(version);
    const isDeprecated = versionInfo.status === 'deprecated';
    const isSunset = versionInfo.status === 'sunset';

    return {
      isValid: true,
      isSupported,
      isDeprecated,
      isSunset,
      versionInfo,
    };
  }

  // Handle version-specific routing
  public handleVersionedRequest(
    request: NextRequest,
    handlers: Record<string, (request: NextRequest) => Promise<NextResponse>>
  ): Promise<NextResponse> {
    const { version } = this.extractVersion(request);
    const validation = this.validateVersion(version);

    if (!validation.isValid) {
      return Promise.resolve(this.createVersionErrorResponse(validation.error!, version));
    }

    if (validation.isSunset) {
      return Promise.resolve(this.createSunsetResponse(version, validation.versionInfo!));
    }

    // Add deprecation warning if version is deprecated
    if (validation.isDeprecated) {
      console.warn(`⚠️  Deprecated API version '${version}' used`);
    }

    // Route to appropriate handler
    const handler = handlers[version];
    if (!handler) {
      return Promise.resolve(this.createVersionErrorResponse(
        `No handler found for API version '${version}'`,
        version
      ));
    }

    return handler(request);
  }

  // Create version error response
  private createVersionErrorResponse(error: string, requestedVersion: string): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: 'API Version Error',
        message: error,
        requestedVersion,
        supportedVersions: this.supportedVersions,
        currentVersion: this.defaultVersion,
        timestamp: new Date().toISOString(),
      },
      { 
        status: 400,
        headers: {
          'API-Version': this.defaultVersion,
          'Supported-Versions': this.supportedVersions.join(', '),
        },
      }
    );
  }

  // Create sunset response
  private createSunsetResponse(version: string, versionInfo: ApiVersion): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: 'API Version Sunset',
        message: `API version '${version}' has been sunset`,
        sunsetDate: versionInfo.sunsetDate,
        migrationGuide: versionInfo.migrationGuide,
        supportedVersions: this.supportedVersions,
        currentVersion: this.defaultVersion,
        timestamp: new Date().toISOString(),
      },
      { 
        status: 410, // Gone
        headers: {
          'API-Version': this.defaultVersion,
          'Supported-Versions': this.supportedVersions.join(', '),
          'Sunset-Date': versionInfo.sunsetDate || '',
        },
      }
    );
  }

  // Add version headers to response
  public addVersionHeaders(response: NextResponse, version: string): NextResponse {
    const versionInfo = apiVersions[version];
    
    if (versionInfo) {
      response.headers.set('API-Version', version);
      response.headers.set('API-Status', versionInfo.status);
      
      if (versionInfo.status === 'deprecated') {
        response.headers.set('API-Deprecation-Date', versionInfo.sunsetDate || '');
        response.headers.set('API-Migration-Guide', versionInfo.migrationGuide || '');
      }
    }
    
    response.headers.set('Supported-Versions', this.supportedVersions.join(', '));
    
    return response;
  }

  // Get version information
  public getVersionInfo(version: string): ApiVersion | undefined {
    return apiVersions[version];
  }

  // Get all versions
  public getAllVersions(): Record<string, ApiVersion> {
    return apiVersions;
  }

  // Get supported versions
  public getSupportedVersions(): string[] {
    return this.supportedVersions;
  }

  // Get current version
  public getCurrentVersion(): string {
    return this.defaultVersion;
  }

  // Check if version is supported
  public isVersionSupported(version: string): boolean {
    return this.supportedVersions.includes(version);
  }

  // Get version compatibility matrix
  public getCompatibilityMatrix(): {
    version: string;
    status: string;
    breakingChanges: string[];
    newFeatures: string[];
    migrationRequired: boolean;
  }[] {
    return Object.values(apiVersions).map(version => ({
      version: version.version,
      status: version.status,
      breakingChanges: version.breakingChanges,
      newFeatures: version.newFeatures,
      migrationRequired: version.status === 'deprecated' || version.status === 'sunset',
    }));
  }

  // Create versioned response
  public createVersionedResponse(
    data: any,
    version: string,
    status: number = 200
  ): NextResponse {
    const response = NextResponse.json(data, { status });
    return this.addVersionHeaders(response, version);
  }

  // Log version usage
  public logVersionUsage(version: string, endpoint: string): void {
    const versionInfo = apiVersions[version];
    
    if (versionInfo?.status === 'deprecated') {
      console.warn(`⚠️  Deprecated API version '${version}' used for endpoint '${endpoint}'`);
    }
    
    if (versionInfo?.status === 'sunset') {
      console.error(`❌ Sunset API version '${version}' used for endpoint '${endpoint}'`);
    }
  }

  // Get version statistics
  public getVersionStatistics(): {
    totalVersions: number;
    currentVersions: number;
    deprecatedVersions: number;
    sunsetVersions: number;
  } {
    const versions = Object.values(apiVersions);
    
    return {
      totalVersions: versions.length,
      currentVersions: versions.filter(v => v.status === 'current').length,
      deprecatedVersions: versions.filter(v => v.status === 'deprecated').length,
      sunsetVersions: versions.filter(v => v.status === 'sunset').length,
    };
  }
}

// Export singleton instance
export const apiVersioning = ApiVersioningMiddleware.getInstance();

// Helper function to create versioned API handler
export function createVersionedHandler(
  handlers: Record<string, (request: NextRequest) => Promise<NextResponse>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return apiVersioning.handleVersionedRequest(request, handlers);
  };
}

// Helper function to get version from request
export function getApiVersion(request: NextRequest): string {
  return apiVersioning.extractVersion(request).version;
}

// Helper function to create versioned response
export function createVersionedResponse(
  data: any,
  request: NextRequest,
  status: number = 200
): NextResponse {
  const version = getApiVersion(request);
  return apiVersioning.createVersionedResponse(data, version, status);
}

// Export types
export type { ApiVersion };
