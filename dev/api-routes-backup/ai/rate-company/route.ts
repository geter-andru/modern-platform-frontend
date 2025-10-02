
import { NextRequest, NextResponse } from 'next/server';
// import claudeAIService from '../../lib/services/claudeAIService';

// Surgical type definitions based on actual usage in this file
interface ResearchData {
  companyName: string;
  industry: string;
  size: string;
  revenue: string;
  description: string;
  website: string;
  technologies: string[];
  painPoints: string[];
  goals: string[];
}

interface FrameworkCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface FrameworkTier {
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
}

interface RatingFramework {
  criteria: FrameworkCriteria[];
  tiers: FrameworkTier[];
}

interface CriteriaRating {
  criteriaId: string;
  score: number;
  reasoning: string;
  weight?: number;
  weightedScore?: number;
}

interface TierRating {
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
}

interface Insight {
  type: string;
  title: string;
  description: string;
  impact: string;
}

interface SalesAction {
  action: string;
  priority: 'low' | 'medium' | 'high';
  timeline: string;
  description: string;
}

interface CompanyRatingRequest {
  companyName: string;
  researchData: ResearchData;
  framework: RatingFramework;
  customerId?: string;
}

interface CompanyRatingResponse {
  success: boolean;
  data?: {
    overallScore: number;
    tier: TierRating;
    criteria: CriteriaRating[];
    recommendation: string;
    insights: Insight[];
    salesActions: SalesAction[];
    confidence: number;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('⭐ Company Rating API called');
  
  try {
    const body: CompanyRatingRequest = await request.json();
    const { companyName, researchData, framework, customerId } = body;
    
    console.log('📥 Received request:', {
      companyName: companyName,
      hasResearchData: !!researchData,
      researchDataType: typeof researchData,
      hasFramework: !!framework,
      frameworkType: typeof framework,
      customerId: customerId
    });
    
    if (!companyName || !researchData || !framework) {
      console.log('❌ Validation failed:', {
        companyName: !!companyName,
        researchData: !!researchData,
        framework: !!framework
      });
      return NextResponse.json(
        { 
          success: false,
          error: 'Company name, research data, and framework are required' 
        },
        { status: 400 }
      );
    }

    console.log(`🤖 Generating ICP rating for: "${companyName}"`);

    // Build the AI prompt for company rating
    const prompt = buildCompanyRatingPrompt(companyName, researchData, framework);
    console.log('📝 Prompt built, length:', prompt.length);
    
    // Call Claude AI directly
    console.log('🔄 Calling Claude AI...');
    const aiResponse = await callClaudeAI(prompt);
    console.log('✅ Claude AI response received, length:', aiResponse.length);

    // Parse the AI response
    const ratingData = parseCompanyRatingResponse(aiResponse, framework);
    
    console.log(`✅ Rating generated for ${companyName}: ${ratingData?.overallScore}/100 (${ratingData?.tier.name})`);

    return NextResponse.json({
      success: true,
      data: ratingData
    });

  } catch (error) {
    console.error('❌ Company rating failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate company rating'
      },
      { status: 500 }
    );
  }
}

function buildCompanyRatingPrompt(companyName: string, researchData: ResearchData, framework: RatingFramework): string {
  const researchSummary = Object.entries(researchData)
    .map(([key, value]: [string, any]) => {
      if (typeof value === 'object' && value !== null) {
        return `- * ${key}* : ${JSON.stringify(value).substring(0, 300)}...`;
      }
      return `- * ${key}* : ${value}`;
    })
    .join('\n');

  const criteriaList = framework.criteria
    .map((criteria) => `- * ${criteria.name}* (${criteria.weight * 100}% weight): ${criteria.description}`)
    .join('\n');

  const tierDefinitions = framework.tiers
    .map((tier) => `- * ${tier.name}* : ${tier.minScore}-${tier.maxScore} points - ${tier.description}`)
    .join('\n');

  return `# Company ICP Rating Analysis

## Company Information:
- * Company Name* : ${companyName}
- * Research Data* : ${researchSummary}

## ICP Rating Framework:
### Criteria (with weights):
${criteriaList}

### Tier Definitions:
${tierDefinitions}

## Task:
Analyze the company against the ICP criteria and provide a comprehensive rating with:

1. * Individual Criteria Scores* (1-10 scale for each criterion)
2. * Weighted Overall Score* (0-100 scale)
3. * Tier Assignment* (based on score ranges)
4. * Detailed Reasoning* for each criterion score
5. * Evidence* from research data supporting each score
6. * Key Insights* (success indicators, warnings, opportunities)
7. * Sales Actions* (3 specific, actionable recommendations)

## Scoring Guidelines:
- * 9-10* : Exceptional fit, exceeds expectations
- * 7-8* : Strong fit, meets most criteria well
- * 5-6* : Moderate fit, some alignment with room for improvement
- * 3-4* : Weak fit, limited alignment
- * 1-2* : Poor fit, minimal alignment

## Output Format:
Return as structured JSON with this exact format:
{
  "overallScore": 78,
  "tier": {
    "id": "tier-2",
    "name": "Tier 2 - Strong Match",
    "minScore": 70,
    "maxScore": 84,
    "color": "text-blue-400",
    "description": "Good fit with solid conversion potential",
    "priority": "high",
    "recommendation": "High priority - strong opportunity"
  },
  "criteria": [
    {
      "criteriaId": "company-size",
      "criteriaName": "Company Size",
      "score": 8,
      "weight": 0.25,
      "weightedScore": 2.0,
      "explanation": "Mid-market company with 500-1000 employees, perfect size for our solution",
      "evidence": ["LinkedIn shows 750 employees", "Revenue estimated at $50-100M"]
    }
  ],
  "recommendation": "Strong Tier 2 match with high conversion potential. Focus on ROI demonstration and technical integration benefits.",
  "insights": [
    {
      "type": "success",
      "message": "Excellent industry fit and company size alignment",
      "priority": "high",
      "actionable": true
    }
  ],
  "salesActions": [
    {
      "id": "action-1",
      "title": "Schedule Technical Demo",
      "description": "Demonstrate integration capabilities and technical benefits to their engineering team",
      "priority": "high",
      "timeline": "Within 1 week",
      "resources": ["Technical demo environment", "Integration documentation"],
      "expectedOutcome": "Technical validation and buy-in from engineering stakeholders"
    }
  ],
  "confidence": 87
}

## Critical Requirements:
- Base ALL scores on the actual research data provided
- Provide specific evidence for each score
- Ensure weighted scores add up to the overall score
- Make sales actions specific and actionable
- Include confidence score based on data quality
- Be realistic and honest about limitations`;
}

function parseCompanyRatingResponse(aiResponse: string, framework: RatingFramework): CompanyRatingResponse['data'] {
  try {
    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const ratingData = JSON.parse(jsonMatch[0]);
    
    // Validate and enhance the response
    if (!ratingData.overallScore || !ratingData.criteria) {
      throw new Error('Invalid rating data structure');
    }

    // Ensure tier is properly set based on score
    const tier = framework.tiers.find((t) => 
      ratingData.overallScore >= t.minScore && ratingData.overallScore <= t.maxScore
    ) || framework.tiers[framework.tiers.length - 1]; // Default to lowest tier

    ratingData.tier = tier;

    // Ensure all criteria have proper structure
    ratingData.criteria = ratingData.criteria.map((criteria: any) => ({
      ...criteria,
      weight: framework.criteria.find((c) => c.id === criteria.criteriaId)?.weight || 0,
      weightedScore: (criteria.score || 0) * (framework.criteria.find((c) => c.id === criteria.criteriaId)?.weight || 0)
    }));

    return ratingData;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    
    // Return fallback rating data
    return {
      overallScore: 50,
      tier: framework.tiers[2], // Default to middle tier
      criteria: framework.criteria.map((c) => ({
        criteriaId: c.id,
        score: 5,
        reasoning: 'Unable to analyze - insufficient data',
        weight: c.weight,
        weightedScore: 5 * c.weight
      })),
      recommendation: 'Unable to generate recommendation due to analysis error',
      insights: [{
        type: 'error',
        title: 'Analysis Failed',
        description: 'Analysis failed - please try again',
        impact: 'Unable to proceed with analysis'
      }],
      salesActions: [{
        action: 'Retry Analysis',
        priority: 'high',
        timeline: 'Immediately',
        description: 'Please try analyzing the company again'
      }],
      confidence: 0
    };
  }
}

async function callClaudeAI(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  
  console.log('🔑 API Key check:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'Missing');
  console.log('🔑 Environment check:', {
    NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? 'Set' : 'Not set',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set'
  });
  
  if (!apiKey) {
    throw new Error('Claude AI API key not configured');
  }

  console.log('🌐 Making request to Claude AI...');
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 3000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude API error response:', errorText);
      throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📄 Response data keys:', Object.keys(data));
    return data.content[0].text;
  } catch (error) {
    console.error('❌ Claude AI call failed:', error);
    throw error;
  }
}
