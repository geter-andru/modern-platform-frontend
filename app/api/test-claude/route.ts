/**
 * Test endpoint for enterprise Claude AI service
 * Tests circuit breaker, retry logic, and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, successResponse } from '@/app/lib/middleware/error-handler';
import claudeAIService from '@/app/lib/services/claudeAIService';

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const testType = searchParams.get('test') || 'simple';

  console.log(`🧪 Testing Claude AI service: ${testType}`);

  const results: any = {
    testType,
    timestamp: new Date().toISOString(),
    results: {}
  };

  try {
    switch (testType) {
      case 'simple':
        // Test basic message sending
        console.log('📝 Test 1: Simple message');
        const simpleResponse = await claudeAIService.sendMessage({
          messages: [
            { role: 'user', content: 'Say "Hello from enterprise Claude!"' }
          ],
          model: 'claude-3-sonnet-20240229',
          maxTokens: 50
        });

        results.results.simple = {
          success: true,
          content: simpleResponse.content,
          usage: simpleResponse.usage
        };
        break;

      case 'usage':
        // Test usage statistics
        console.log('📊 Test 2: Usage statistics');
        const stats = claudeAIService.getUsageStats();
        results.results.usage = stats;
        break;

      case 'analysis':
        // Test analysis capabilities
        console.log('🔍 Test 3: Analysis');
        const analysisResponse = await claudeAIService.analyzeContent({
          content: 'This is a test document for analysis.',
          analysisType: 'general',
          includeInsights: true,
          includeRecommendations: true
        });

        results.results.analysis = {
          success: true,
          analysis: analysisResponse.analysis,
          insights: analysisResponse.insights,
          recommendations: analysisResponse.recommendations
        };
        break;

      case 'circuit-breaker':
        // Test circuit breaker (this will use mock mode if no API key)
        console.log('⚡ Test 4: Circuit breaker status');
        const metrics = claudeAIService.getMetrics();
        results.results.circuitBreaker = {
          requestCount: metrics.requestCount,
          successCount: metrics.successCount,
          failureCount: metrics.failureCount,
          successRate: metrics.successRate
        };
        break;

      default:
        results.results.error = 'Unknown test type';
    }

    // Add service health info
    results.health = {
      configured: claudeAIService.isConfigured(),
      model: 'claude-3-sonnet-20240229'
    };

  } catch (error) {
    console.error('❌ Claude AI test failed:', error);
    results.results.error = error instanceof Error ? error.message : 'Unknown error';
    results.success = false;
  }

  return successResponse(results);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();

  console.log('📤 Testing Claude AI with custom prompt');

  const response = await claudeAIService.sendMessage({
    messages: body.messages || [
      { role: 'user', content: body.prompt || 'Hello!' }
    ],
    model: body.model || 'claude-3-sonnet-20240229',
    maxTokens: body.maxTokens || 100,
    temperature: body.temperature
  });

  return successResponse({
    content: response.content,
    usage: response.usage,
    model: response.model,
    timestamp: new Date().toISOString()
  });
});
