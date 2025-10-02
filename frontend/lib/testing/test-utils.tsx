/**
 * Testing Utilities Library
 * 
 * Comprehensive testing utilities for React components, API routes,
 * and utility functions in the modern-platform application.
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextRequest } from 'next/server';
import { configManager } from '@/lib/config';

// Test provider wrapper
interface TestProviderProps {
  children: React.ReactNode;
}

const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  return (
    <div data-testid="test-provider">
      {children}
    </div>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  return render(ui, {
    wrapper: TestProvider,
    ...options,
  });
};

// Test data factories
export const testDataFactories = {
  // User data factory
  createUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  // Assessment data factory
  createAssessment: (overrides = {}) => ({
    id: 'test-assessment-id',
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    answers: {
      question1: 'answer1',
      question2: 'answer2',
    },
    status: 'completed',
    score: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  // Product data factory for ICP analysis
  createProductData: (overrides = {}) => ({
    productName: 'Test Product',
    productDescription: 'A comprehensive test product for ICP analysis',
    distinguishingFeature: 'Advanced AI-powered analytics',
    businessModel: 'b2b-subscription' as const,
    ...overrides,
  }),

  // ICP Analysis data factory
  createICPAnalysis: (overrides = {}) => ({
    id: 'test-icp-id',
    companyName: 'Test Company',
    industry: 'Technology',
    generatedAt: new Date().toISOString(),
    confidence: 85,
    lastUpdated: new Date().toISOString(),
    sections: {
      targetCompanyProfile: 'Test company profile',
      marketIntelligence: 'Test market intelligence',
      decisionMakerProfile: 'Test decision maker profile',
      keyPainPoints: 'Test pain points',
      successMetrics: 'Test success metrics',
      buyingProcess: 'Test buying process',
      competitiveLandscape: 'Test competitive landscape',
      marketTiming: 'Test market timing',
    },
    source: 'ai_generated',
    metadata: {
      processingTime: 1000,
      aiModel: 'claude-3-sonnet',
      confidence: 85,
    },
    ...overrides,
  }),

  // Cost calculation data factory
  createCostCalculation: (overrides = {}) => ({
    id: 'test-cost-id',
    productData: {
      name: 'Test Product',
      description: 'Test product description',
      features: ['feature1', 'feature2'],
    },
    pricing: {
      model: 'subscription',
      basePrice: 100,
      currency: 'USD',
    },
    customerData: {
      companySize: 'medium',
      industry: 'Technology',
      budget: 10000,
    },
    calculatedCost: 1200,
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  // API response factory
  createApiResponse: (data: any, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  }),

  // Error response factory
  createErrorResponse: (message: string, status = 500) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
    text: () => Promise.resolve(JSON.stringify({ error: message })),
  }),
};

// Mock request factory
export const createMockRequest = (
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {}
): NextRequest => {
  const { method = 'GET', headers = {}, body } = options;
  
  return new NextRequest(url, {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined,
  });
};

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
  process.env.NEXT_PUBLIC_STRIPE_TOKEN = 'rk_test_test-key';
  process.env.NEXT_PUBLIC_GITHUB_TOKEN = 'github_pat_test-token';
  process.env.NEXT_PUBLIC_AIRTABLE_API_KEY = 'pat_test-airtable-key';
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID = 'app_test-base-id';
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-google-client-id';
  process.env.GOOGLE_CLIENT_SECRET = 'GOCSPX-test-secret';
  process.env.NEXT_PUBLIC_NETLIFY_API_KEY = 'nfp_test-netlify-key';
  process.env.NEXT_PUBLIC_RENDER_SERVICE_ID = 'srv_test-render-id';
  process.env.NEXT_PUBLIC_RENDER_URL = 'https://test.onrender.com';
  process.env.RENDER_API_KEY = 'rnd_test-render-key';
};

// Test configuration manager
export const testConfigManager = {
  // Mock configuration for tests
  getMockConfig: () => ({
    environment: 'test',
    isDevelopment: false,
    isProduction: false,
    isTest: true,
    config: {
      NODE_ENV: 'test',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    },
    environmentConfig: {
      apiKeys: {
        stripe: { useTestKey: true },
        anthropic: { rateLimit: 100 },
        github: { rateLimit: 5000 },
      },
      security: {
        cors: { origin: ['http://localhost:3000'] },
        headers: { 'X-Content-Type-Options': 'nosniff' },
      },
      logging: {
        level: 'error',
        enableRequestLogging: false,
        enableErrorLogging: true,
      },
    },
  }),

  // Mock secrets manager
  getMockSecrets: () => ({
    validateAllSecrets: jest.fn(),
    getValidationSummary: () => ({
      total: 10,
      valid: 10,
      invalid: 0,
      warnings: 0,
      errors: [],
      warnings: [],
      recommendations: [],
    }),
    getSecret: jest.fn((key: string) => `test-${key}`),
    getAllSecrets: () => new Map(),
  }),

  // Mock security config
  getMockSecurity: () => ({
    getSecurityHeaders: () => ({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
    }),
    getCorsConfig: () => ({
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    }),
    getRateLimitConfig: () => ({
      windowMs: 900000,
      max: 1000,
      message: 'Rate limit exceeded',
    }),
    validateOrigin: jest.fn(() => true),
    validateApiKey: jest.fn(() => true),
  }),

  // Mock Stripe config
  getMockStripe: () => ({
    getConfig: () => ({
      publishableKey: 'rk_test_test-key',
      secretKey: 'rk_test_test-key',
      environment: 'test',
      isTestMode: true,
    }),
    validateStripeKey: jest.fn(() => true),
    isTestMode: () => true,
    getEnvironment: () => 'test',
  }),
};

// Test user event setup
export const setupUserEvent = () => {
  return userEvent.setup();
};

// Test assertions
export const testAssertions = {
  // Assert API response
  assertApiResponse: (response: any, expectedStatus: number, expectedData?: any) => {
    expect(response.status).toBe(expectedStatus);
    if (expectedData) {
      expect(response.json()).resolves.toEqual(expectedData);
    }
  },

  // Assert error response
  assertErrorResponse: (response: any, expectedStatus: number, expectedError?: string) => {
    expect(response.status).toBe(expectedStatus);
    if (expectedError) {
      expect(response.json()).resolves.toEqual(
        expect.objectContaining({ error: expectedError })
      );
    }
  },

  // Assert component props
  assertComponentProps: (component: any, expectedProps: Record<string, any>) => {
    Object.entries(expectedProps).forEach(([key, value]) => {
      expect(component.props[key]).toEqual(value);
    });
  },

  // Assert form validation
  assertFormValidation: (form: any, expectedErrors: string[]) => {
    expectedErrors.forEach(error => {
      expect(form).toHaveTextContent(error);
    });
  },
};

// Test helpers
export const testHelpers = {
  // Wait for async operations
  waitFor: (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock localStorage
  mockLocalStorage: () => {
    const store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: jest.fn((key: string) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
    };
  },

  // Mock sessionStorage
  mockSessionStorage: () => {
    const store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: jest.fn((key: string) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
    };
  },

  // Mock fetch
  mockFetch: (response: any, status = 200) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      })
    );
  },

  // Mock fetch error
  mockFetchError: (message: string, status = 500) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status,
        json: () => Promise.resolve({ error: message }),
        text: () => Promise.resolve(JSON.stringify({ error: message })),
      })
    );
  },
};

// Export everything
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };
export { testDataFactories, createMockRequest, setupTestEnvironment, testConfigManager, setupUserEvent, testAssertions, testHelpers };
