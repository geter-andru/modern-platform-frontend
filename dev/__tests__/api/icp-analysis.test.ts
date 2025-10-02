/**
 * ICP Analysis API Integration Tests
 * 
 * Comprehensive integration tests for the ICP Analysis API endpoint
 * including request validation, error handling, and response formatting.
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/icp-analysis/generate/route';
import { createMockRequest, testDataFactories } from '@/lib/testing/test-utils';

// Mock external dependencies
const mockSupabase = {
  auth: {
    getUser: jest.fn(() => Promise.resolve({ 
      data: { 
        user: { 
          id: 'test-user-id', 
          email: 'test@example.com' 
        } 
      }, 
      error: null 
    })),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => Promise.resolve({ data: null, error: null })),
    delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
  })),
};

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => mockSupabase),
}));

jest.mock('@/app/lib/services/webResearchService', () => ({
  default: {
    conductProductResearch: jest.fn(() => Promise.resolve({
      targetCompanyProfile: { industry: 'Technology' },
      marketIntelligence: { trends: ['AI', 'Cloud'] },
      decisionMakerProfile: { role: 'CTO' },
      keyPainPoints: ['Scalability', 'Security'],
      successMetrics: ['ROI', 'Efficiency'],
      buyingProcess: { stages: ['Research', 'Evaluation'] },
      competitiveLandscape: { competitors: ['Company A'] },
      marketTiming: { urgency: 'High' }
    }))
  }
}));

describe('/api/icp-analysis/generate', () => {
  // Test successful ICP generation
  describe('Successful ICP Generation', () => {
    it('generates ICP analysis with valid product data', async () => {
      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.icp).toBeDefined();
      expect(responseData.icp.id).toBeDefined();
      expect(responseData.icp.companyName).toBeDefined();
      expect(responseData.icp.industry).toBeDefined();
      expect(responseData.icp.sections).toBeDefined();
    });

    it('generates ICP analysis with business context', async () => {
      const productData = {
        productName: 'Test Product',
        productDescription: 'A comprehensive testing product',
        distinguishingFeature: 'Advanced testing capabilities',
        businessModel: 'b2b-subscription' as const,
      };

      const businessContext = {
        industry: 'Technology',
        companySize: 'Medium',
        currentChallenges: ['Testing complexity', 'Quality assurance'],
        goals: ['Improve testing', 'Reduce bugs'],
      };

      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData, businessContext },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.icp).toBeDefined();
    });
  });

  // Test request validation
  describe('Request Validation', () => {
    it('returns 400 for missing product data', async () => {
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Product data is required');
    });

    it('returns 400 for invalid product data structure', async () => {
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          productData: {
            productName: '', // Invalid: empty name
            productDescription: 'Test description',
            distinguishingFeature: 'Test feature',
            businessModel: 'invalid-model', // Invalid: not in enum
          },
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBeDefined();
    });

    it('returns 400 for missing required fields', async () => {
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          productData: {
            productName: 'Test Product',
            // Missing: productDescription, distinguishingFeature, businessModel
          },
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBeDefined();
    });
  });

  // Test authentication
  describe('Authentication', () => {
    it('returns 401 for unauthenticated requests', async () => {
      // Override mock to return no user
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: null });

      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('returns 401 for invalid authentication', async () => {
      // Override mock to return authentication error
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('Auth error') });

      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Unauthorized');
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    it('handles Claude AI API errors gracefully', async () => {
      // Mock fetch to return Claude AI error
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: 'Rate limit exceeded' }),
        })
      );

      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200); // Should fallback to WebResearchService
      expect(responseData.success).toBe(true);
      expect(responseData.icp).toBeDefined();
    });

    it('handles WebResearchService fallback errors', async () => {
      // Mock both Claude AI and WebResearchService to fail
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Service unavailable' }),
        })
      );

      const mockWebResearchService = {
        conductProductResearch: jest.fn(() => Promise.reject(new Error('WebResearchService error'))),
      };

      jest.doMock('@/app/lib/services/webResearchService', () => mockWebResearchService);

      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200); // Should return basic ICP
      expect(responseData.success).toBe(true);
      expect(responseData.icp).toBeDefined();
      expect(responseData.icp.confidence).toBe(25); // Basic ICP has low confidence
    });

    it('handles unexpected errors', async () => {
      // Override mock to throw unexpected error
      mockSupabase.auth.getUser.mockRejectedValueOnce(new Error('Unexpected error'));

      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe('Failed to generate ICP analysis');
    });
  });

  // Test response format
  describe('Response Format', () => {
    it('returns properly formatted ICP data', async () => {
      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(responseData).toHaveProperty('success', true);
      expect(responseData).toHaveProperty('icp');
      expect(responseData).toHaveProperty('message', 'ICP analysis generated successfully');

      const icp = responseData.icp;
      expect(icp).toHaveProperty('id');
      expect(icp).toHaveProperty('companyName');
      expect(icp).toHaveProperty('industry');
      expect(icp).toHaveProperty('generatedAt');
      expect(icp).toHaveProperty('confidence');
      expect(icp).toHaveProperty('lastUpdated');
      expect(icp).toHaveProperty('sections');
      expect(icp).toHaveProperty('source', 'ai_generated');
      expect(icp).toHaveProperty('metadata');

      expect(icp.sections).toHaveProperty('targetCompanyProfile');
      expect(icp.sections).toHaveProperty('marketIntelligence');
      expect(icp.sections).toHaveProperty('decisionMakerProfile');
      expect(icp.sections).toHaveProperty('keyPainPoints');
      expect(icp.sections).toHaveProperty('successMetrics');
      expect(icp.sections).toHaveProperty('buyingProcess');
      expect(icp.sections).toHaveProperty('competitiveLandscape');
      expect(icp.sections).toHaveProperty('marketTiming');

      expect(icp.metadata).toHaveProperty('processingTime');
      expect(icp.metadata).toHaveProperty('aiModel');
      expect(icp.metadata).toHaveProperty('confidence');
    });

    it('includes proper timestamps', async () => {
      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      const icp = responseData.icp;
      expect(icp.generatedAt).toBeDefined();
      expect(icp.lastUpdated).toBeDefined();
      expect(new Date(icp.generatedAt)).toBeInstanceOf(Date);
      expect(new Date(icp.lastUpdated)).toBeInstanceOf(Date);
    });
  });

  // Test performance
  describe('Performance', () => {
    it('responds within reasonable time', async () => {
      const startTime = Date.now();
      
      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(10000); // Should respond within 10 seconds
    });

    it('includes processing time in metadata', async () => {
      const productData = testDataFactories.createProductData();
      const request = createMockRequest('http://localhost:3000/api/icp-analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { productData },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(responseData.icp.metadata.processingTime).toBeDefined();
      expect(typeof responseData.icp.metadata.processingTime).toBe('number');
      expect(responseData.icp.metadata.processingTime).toBeGreaterThan(0);
    });
  });

  // Clean up after tests
  afterEach(() => {
    jest.clearAllMocks();
    if (global.fetch) {
      global.fetch.mockClear();
    }
    // Reset Supabase mock to authenticated state
    mockSupabase.auth.getUser.mockResolvedValue({ 
      data: { 
        user: { 
          id: 'test-user-id', 
          email: 'test@example.com' 
        } 
      }, 
      error: null 
    });
  });
});
