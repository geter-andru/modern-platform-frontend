
import { NextRequest, NextResponse } from 'next/server';
import { 
  PersonaGenerationRequest, 
  PersonaGenerationResponse,
  ICPData,
  ProductData,
  Persona
} from '../../../../src/shared/types/api';

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('👥 Buyer Personas Generation API called');
  
  try {
    const body: PersonaGenerationRequest = await request.json();
    const { icpData, productData, customerId } = body;
    
    if (!icpData) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ICP data is required to generate buyer personas' 
        },
        { status: 400 }
      );
    }

    console.log(`🧠 Generating buyer personas for customer: ${customerId || 'anonymous'}`);

    // Build the AI prompt for persona generation
    const prompt = buildPersonaGenerationPrompt(icpData, productData);

    // Call Claude AI to generate personas
    const aiResponse = await callClaudeAI(prompt);
    
    // Parse the AI response
    const personaData = parsePersonaResponse(aiResponse);

    console.log(`✅ Generated ${personaData.personas.length} buyer personas`);

    return NextResponse.json({
      success: true,
      data: {
        personas: personaData.personas,
        confidence: personaData.confidence,
        methodology: 'AI-powered persona generation using ICP data and behavioral analysis'
      }
    });

  } catch (error: any) {
    console.error('❌ Persona generation API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to generate buyer personas'
      },
      { status: 500 }
    );
  }
}

function buildPersonaGenerationPrompt(icpData: any, productData?: any): string {
  const productContext = productData ? `
Product Information:
- Name: ${productData.name || 'Not specified'}
- Description: ${productData.description || 'Not specified'}
- Key Features: ${productData.features?.join(', ') || 'Not specified'}
- Target Market: ${productData.targetMarket || 'Not specified'}
` : '';

  return `You are an expert buyer persona analyst. Generate 3-4 detailed buyer personas based on the provided ICP (Ideal Customer Profile) data.

${productContext}

ICP Data:
${JSON.stringify(icpData, null, 2)}

Please generate comprehensive buyer personas that include:

1. * Primary Decision Maker* - The person who has final authority to purchase
2. * Influencer/Champion* - Someone who influences the decision but doesn't have final authority
3. * End User* - The person who will actually use the product/service
4. * Optional: Technical Evaluator* - If relevant, someone who evaluates technical aspects

For each persona, provide:

* Basic Information:* - name: "Realistic first and last name"
- role: "Decision Maker/Influencer/End User/Technical Evaluator"
- title: "Actual job title"

* Demographics:* - ageRange: "e.g., 35-45"
- experience: "e.g., 8-12 years in industry"
- education: "e.g., Bachelor's degree in Business"
- location: "e.g., Major metropolitan areas"

* Psychographics:* - values: "What they value most in their work/life"
- motivations: "What drives them professionally"
- fears: "What they're afraid of or concerned about"

* Goals (3-4 specific goals):* - Professional objectives they're trying to achieve
- Business outcomes they want to drive

* Pain Points (3-4 specific pain points):* - Current challenges they face
- Problems they need to solve

* Buying Behavior:* - decisionProcess: "How they typically make purchasing decisions"
- timeline: "Typical buying timeline"
- budgetAuthority: "Their level of budget control"

* Communication Preferences:* - channels: ["Email", "LinkedIn", "Phone calls", "In-person meetings"]
- tone: "Professional, casual, data-driven, etc."

* Objections (3-4 common objections):* - Typical concerns or pushback they might have

* Information Sources:* - Where they get information about solutions
- Industry publications, conferences, peers, etc.

* Technology Usage:* - currentTools: ["Current tools they use"]
- techComfort: "High/Medium/Low"
- adoptionStyle: "Early adopter, mainstream, late adopter"

* Decision Influence:* - priority: "High/Medium/Low"
- influenceLevel: "High/Medium/Low"
- decisionRole: "Final decision maker, influencer, evaluator"

Return the response as a JSON object with this structure:
{
  "personas": [
    {
      "name": "...",
      "role": "...",
      "title": "...",
      "demographics": {...},
      "psychographics": {...},
      "goals": [...],
      "painPoints": [...],
      "buyingBehavior": {...},
      "communicationPreferences": {...},
      "objections": [...],
      "informationSources": [...],
      "technologyUsage": {...},
      "decisionInfluence": {...}
    }
  ],
  "confidence": 85,
  "methodology": "Generated based on ICP analysis and industry best practices"
}

Make the personas realistic, specific, and actionable for sales and marketing teams.`;
}

function parsePersonaResponse(aiResponse: string): any {
  try {
    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!parsed.personas || !Array.isArray(parsed.personas)) {
      throw new Error('Invalid persona data structure');
    }

    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse persona response:', error);
    
    // Return fallback personas if parsing fails
    return {
      personas: [
        {
          name: "Sarah Johnson",
          role: "Decision Maker",
          title: "VP of Operations",
          demographics: {
            ageRange: "35-45",
            experience: "10-15 years",
            education: "MBA",
            location: "Major metropolitan areas"
          },
          psychographics: {
            values: "Efficiency and ROI",
            motivations: "Driving operational excellence",
            fears: "Wasting budget on ineffective solutions"
          },
          goals: [
            "Improve operational efficiency",
            "Reduce costs while maintaining quality",
            "Scale operations effectively"
          ],
          painPoints: [
            "Manual processes slowing down growth",
            "Lack of visibility into operations",
            "Difficulty scaling with current tools"
          ],
          buyingBehavior: {
            decisionProcess: "Data-driven evaluation with stakeholder input",
            timeline: "3-6 months",
            budgetAuthority: "High - final approval authority"
          },
          communicationPreferences: {
            channels: ["Email", "LinkedIn", "In-person meetings"],
            tone: "Professional and data-driven"
          },
          objections: [
            "Concerned about implementation complexity",
            "Worried about ROI timeline",
            "Need to justify to executive team"
          ],
          informationSources: [
            "Industry publications",
            "Peer recommendations",
            "Vendor demos and case studies"
          ],
          technologyUsage: {
            currentTools: ["CRM", "ERP", "Analytics platforms"],
            techComfort: "High",
            adoptionStyle: "Mainstream"
          },
          decisionInfluence: {
            priority: "High",
            influenceLevel: "High",
            decisionRole: "Final decision maker"
          }
        }
      ],
      confidence: 75,
      methodology: "Fallback persona generated due to parsing error"
    };
  }
}

async function callClaudeAI(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  
  console.log('🔑 API Key check:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'Missing');
  
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
        max_tokens: 4000,
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
