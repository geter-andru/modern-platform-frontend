/**
 * AI Prompt Template Export Utilities
 *
 * Generates structured prompts for ChatGPT, Claude, and Gemini
 * to extend ICP research and validate buyer personas.
 */

import { PersonaForPDF } from './pdf-export';
import { copyToClipboard } from './data-export';

export interface AIPromptExportData {
  companyName?: string;
  productName?: string;
  productDescription?: string;
  targetMarket?: string;
  personas: PersonaForPDF[];
  generatedAt?: string;
}

/**
 * Generate ChatGPT prompt template
 *
 * Optimized for ChatGPT's conversational style and structured output
 */
export function generateChatGPTPrompt(data: AIPromptExportData): string {
  const {
    companyName = 'my company',
    productName = 'my product',
    productDescription,
    targetMarket,
    personas
  } = data;

  let prompt = `I've completed an ICP (Ideal Customer Profile) analysis for ${productName}`;

  if (companyName && companyName !== 'Your Company') {
    prompt += ` at ${companyName}`;
  }

  prompt += ` and need your help extending this research.\n\n`;

  // Product Overview Section
  prompt += `## Product Overview\n\n`;
  prompt += `**Product Name:** ${productName}\n`;

  if (productDescription) {
    prompt += `**Description:** ${productDescription}\n`;
  }

  if (targetMarket) {
    prompt += `**Target Market:** ${targetMarket}\n`;
  }

  prompt += `\n`;

  // Generated Buyer Personas Section
  prompt += `## Generated Buyer Personas\n\n`;
  prompt += `I've identified ${personas.length} key buyer personas:\n\n`;

  personas.forEach((persona, index) => {
    prompt += `### ${index + 1}. ${persona.name} (${persona.title})\n\n`;

    // Demographics
    if (persona.demographics) {
      const demo = [];
      if (persona.demographics.experience) demo.push(`**Experience:** ${persona.demographics.experience}`);
      if (persona.demographics.companySize) demo.push(`**Company Size:** ${persona.demographics.companySize}`);
      if (persona.demographics.industry) demo.push(`**Industry:** ${persona.demographics.industry}`);

      if (demo.length > 0) {
        prompt += demo.join(' | ') + '\n\n';
      }
    }

    // Goals
    const goals = persona.goals || persona.psychographics?.goals || [];
    if (goals.length > 0) {
      prompt += `**Goals:**\n`;
      goals.forEach(goal => {
        prompt += `- ${goal}\n`;
      });
      prompt += `\n`;
    }

    // Pain Points
    const painPoints = persona.painPoints || persona.psychographics?.painPoints || [];
    if (painPoints.length > 0) {
      prompt += `**Pain Points:**\n`;
      painPoints.forEach(pain => {
        prompt += `- ${pain}\n`;
      });
      prompt += `\n`;
    }

    // Communication Preferences
    const channels = persona.communicationPreferences?.preferredChannels ||
                     persona.behavior?.preferredChannels || [];
    if (channels.length > 0) {
      prompt += `**Preferred Channels:** ${channels.join(', ')}\n\n`;
    }

    // Objections
    const objections = persona.objections || persona.behavior?.objections || [];
    if (objections.length > 0 && index === 0) { // Only show for first persona to keep prompt concise
      prompt += `**Common Objections:**\n`;
      objections.slice(0, 3).forEach(objection => {
        prompt += `- ${objection}\n`;
      });
      prompt += `\n`;
    }
  });

  // Research Extension Requests
  prompt += `---\n\n`;
  prompt += `## What I Need From You\n\n`;
  prompt += `Please help me:\n\n`;
  prompt += `1. **Identify Missing Personas** - Are there 3-5 additional buyer personas I might be missing? Consider secondary stakeholders, influencers, or adjacent roles.\n\n`;
  prompt += `2. **Validate These Personas** - For each persona I've identified, suggest 3-5 interview questions to validate their goals, pain points, and buying behavior.\n\n`;
  prompt += `3. **Create Messaging Variations** - For my top 2 personas, suggest specific messaging angles that would resonate with each stakeholder type.\n\n`;
  prompt += `4. **Competitive Intelligence** - What competitors are these personas likely evaluating? How can I position against them?\n\n`;
  prompt += `5. **Buying Committee Dynamics** - How do these personas typically interact in a buying decision? Who has veto power?\n\n`;
  prompt += `Focus on systematic, data-driven buyer understanding for B2B SaaS founders. Format your response with clear sections and actionable insights.\n`;

  return prompt;
}

/**
 * Generate Claude prompt template
 *
 * Optimized for Claude's analytical depth and structured thinking
 */
export function generateClaudePrompt(data: AIPromptExportData): string {
  const {
    companyName = 'my company',
    productName = 'my product',
    productDescription,
    targetMarket,
    personas
  } = data;

  let prompt = `I need your help extending an ICP analysis I've completed for ${productName}`;

  if (companyName && companyName !== 'Your Company') {
    prompt += ` (${companyName})`;
  }

  prompt += `. I want to validate my buyer persona research and identify gaps in my understanding of the buying committee.\n\n`;

  // Context Section
  prompt += `<context>\n`;
  prompt += `## Product Context\n\n`;
  prompt += `**Product:** ${productName}\n`;

  if (productDescription) {
    prompt += `**Description:** ${productDescription}\n`;
  }

  if (targetMarket) {
    prompt += `**Target Market:** ${targetMarket}\n`;
  }

  prompt += `\n## Current Buyer Personas\n\n`;

  personas.forEach((persona, index) => {
    prompt += `### Persona ${index + 1}: ${persona.name}\n\n`;
    prompt += `**Title/Role:** ${persona.title}\n`;

    if (persona.demographics) {
      if (persona.demographics.experience) {
        prompt += `**Experience Level:** ${persona.demographics.experience}\n`;
      }
      if (persona.demographics.companySize) {
        prompt += `**Company Size:** ${persona.demographics.companySize}\n`;
      }
    }

    // Goals
    const goals = persona.goals || persona.psychographics?.goals || [];
    if (goals.length > 0) {
      prompt += `\n**Key Goals:**\n`;
      goals.forEach(goal => {
        prompt += `- ${goal}\n`;
      });
    }

    // Pain Points
    const painPoints = persona.painPoints || persona.psychographics?.painPoints || [];
    if (painPoints.length > 0) {
      prompt += `\n**Pain Points:**\n`;
      painPoints.forEach(pain => {
        prompt += `- ${pain}\n`;
      });
    }

    // Communication
    const channels = persona.communicationPreferences?.preferredChannels ||
                     persona.behavior?.preferredChannels || [];
    const commStyle = persona.communicationPreferences?.communicationStyle ||
                      persona.contactStrategy?.bestApproach;

    if (channels.length > 0 || commStyle) {
      prompt += `\n**Communication:**\n`;
      if (channels.length > 0) {
        prompt += `- Preferred Channels: ${channels.join(', ')}\n`;
      }
      if (commStyle) {
        prompt += `- Communication Style: ${commStyle}\n`;
      }
    }

    prompt += `\n`;
  });

  prompt += `</context>\n\n`;

  // Analytical Tasks
  prompt += `<task>\n`;
  prompt += `Please analyze this ICP research and provide:\n\n`;

  prompt += `## 1. Gap Analysis\n`;
  prompt += `Identify missing personas in the buying committee. Consider:\n`;
  prompt += `- Economic buyers (budget holders)\n`;
  prompt += `- Technical evaluators (champions vs gatekeepers)\n`;
  prompt += `- End users (day-to-day operators)\n`;
  prompt += `- Executive sponsors (strategic alignment)\n\n`;

  prompt += `## 2. Persona Validation Framework\n`;
  prompt += `For each persona I've identified, create:\n`;
  prompt += `- 5 interview questions to validate their goals\n`;
  prompt += `- 3 questions to uncover hidden pain points\n`;
  prompt += `- 2 questions to understand their buying authority\n\n`;

  prompt += `## 3. Competitive Positioning\n`;
  prompt += `For my top 2 personas:\n`;
  prompt += `- What alternative solutions are they likely evaluating?\n`;
  prompt += `- What decision criteria matter most to each persona?\n`;
  prompt += `- How should I differentiate for each stakeholder?\n\n`;

  prompt += `## 4. Buying Committee Dynamics\n`;
  prompt += `Map how these personas interact in a typical B2B buying process:\n`;
  prompt += `- Who initiates the search?\n`;
  prompt += `- Who has veto power?\n`;
  prompt += `- What's the typical decision timeline?\n`;
  prompt += `- Where do deals typically stall?\n\n`;

  prompt += `## 5. Content & Messaging Strategy\n`;
  prompt += `Suggest specific content types for each persona:\n`;
  prompt += `- What format resonates? (case studies, ROI calculators, technical docs, etc.)\n`;
  prompt += `- What messaging themes address their specific motivations?\n`;
  prompt += `- What proof points do they need at each buying stage?\n`;
  prompt += `</task>\n\n`;

  prompt += `Please provide detailed, actionable analysis. Use structured thinking and cite relevant B2B SaaS buying patterns.\n`;

  return prompt;
}

/**
 * Generate Gemini prompt template
 *
 * Optimized for Gemini's multimodal and synthesis capabilities
 */
export function generateGeminiPrompt(data: AIPromptExportData): string {
  const {
    companyName = 'my company',
    productName = 'my product',
    productDescription,
    targetMarket,
    personas
  } = data;

  let prompt = `# ICP Research Extension: ${productName}\n\n`;

  prompt += `## Context\n\n`;
  prompt += `I've completed initial buyer persona research for ${productName}`;

  if (companyName && companyName !== 'Your Company') {
    prompt += ` at ${companyName}`;
  }

  prompt += `. I need help validating these personas, identifying gaps, and creating actionable go-to-market strategies.\n\n`;

  // Product Information
  if (productDescription || targetMarket) {
    prompt += `### Product Details\n\n`;
    if (productDescription) {
      prompt += `**What we do:** ${productDescription}\n\n`;
    }
    if (targetMarket) {
      prompt += `**Target market:** ${targetMarket}\n\n`;
    }
  }

  // Personas Summary
  prompt += `### Identified Buyer Personas (${personas.length})\n\n`;

  personas.forEach((persona, index) => {
    prompt += `**${index + 1}. ${persona.name}** - ${persona.title}\n`;

    const goals = persona.goals || persona.psychographics?.goals || [];
    const painPoints = persona.painPoints || persona.psychographics?.painPoints || [];

    if (goals.length > 0) {
      prompt += `- Goals: ${goals.slice(0, 2).join(', ')}${goals.length > 2 ? ', ...' : ''}\n`;
    }

    if (painPoints.length > 0) {
      prompt += `- Pains: ${painPoints.slice(0, 2).join(', ')}${painPoints.length > 2 ? ', ...' : ''}\n`;
    }

    prompt += `\n`;
  });

  // Detailed Persona Breakdown
  prompt += `### Detailed Persona Profiles\n\n`;

  personas.forEach((persona, index) => {
    prompt += `#### ${persona.name} (${persona.title})\n\n`;

    // Quick Stats
    if (persona.demographics) {
      const stats = [];
      if (persona.demographics.experience) stats.push(persona.demographics.experience);
      if (persona.demographics.companySize) stats.push(persona.demographics.companySize);
      if (persona.demographics.industry) stats.push(persona.demographics.industry);

      if (stats.length > 0) {
        prompt += `*${stats.join(' • ')}*\n\n`;
      }
    }

    // Goals & Pains
    const goals = persona.goals || persona.psychographics?.goals || [];
    const painPoints = persona.painPoints || persona.psychographics?.painPoints || [];

    if (goals.length > 0 || painPoints.length > 0) {
      if (goals.length > 0) {
        prompt += `**Trying to:** ${goals.join(', ')}\n\n`;
      }
      if (painPoints.length > 0) {
        prompt += `**Struggling with:** ${painPoints.join(', ')}\n\n`;
      }
    }

    // Communication
    const channels = persona.communicationPreferences?.preferredChannels ||
                     persona.behavior?.preferredChannels || [];
    if (channels.length > 0) {
      prompt += `**Reaches via:** ${channels.join(', ')}\n\n`;
    }

    if (index < personas.length - 1) {
      prompt += `---\n\n`;
    }
  });

  // Research Questions
  prompt += `\n## Research & Analysis Needed\n\n`;

  prompt += `### 1. Persona Completeness Check\n`;
  prompt += `- Am I missing critical personas in the buying committee?\n`;
  prompt += `- Who are the hidden influencers or blockers?\n`;
  prompt += `- Should I segment any of these personas further?\n\n`;

  prompt += `### 2. Validation & Interview Strategy\n`;
  prompt += `- What specific questions should I ask in customer interviews to validate each persona?\n`;
  prompt += `- What behavioral signals indicate I've correctly identified their pain points?\n`;
  prompt += `- How can I test if my value proposition resonates with each persona?\n\n`;

  prompt += `### 3. Go-to-Market Execution\n`;
  prompt += `- What content format works best for each persona? (1-pager, demo video, ROI calc, case study, etc.)\n`;
  prompt += `- What messaging angle should I lead with for each stakeholder?\n`;
  prompt += `- Where do I find these personas? (LinkedIn groups, events, communities, etc.)\n\n`;

  prompt += `### 4. Competitive Strategy\n`;
  prompt += `- What alternatives are these personas evaluating?\n`;
  prompt += `- What decision criteria differ between personas?\n`;
  prompt += `- How should I position against competitors for each stakeholder?\n\n`;

  prompt += `### 5. Sales Process Design\n`;
  prompt += `- In what order should I engage these personas?\n`;
  prompt += `- How long does a typical buying cycle take for this type of product?\n`;
  prompt += `- What triggers the initial buyer pain/need?\n`;
  prompt += `- Where do deals typically stall and how can I prevent it?\n\n`;

  prompt += `## Output Format\n\n`;
  prompt += `Please provide:\n`;
  prompt += `1. **Gap Analysis** - Missing personas with rationale\n`;
  prompt += `2. **Interview Script** - Top 10 questions per persona\n`;
  prompt += `3. **Content Matrix** - Content type × Persona × Buying Stage\n`;
  prompt += `4. **Competitive Positioning** - Key differentiators per persona\n`;
  prompt += `5. **Sales Playbook** - Sequence, timing, and stakeholder mapping\n\n`;

  prompt += `Make it actionable for a B2B SaaS founder executing a product-led sales motion.\n`;

  return prompt;
}

/**
 * Export ICP data as ChatGPT prompt (copy to clipboard)
 */
export async function exportToChatGPTPrompt(
  data: AIPromptExportData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data || !data.personas || data.personas.length === 0) {
      return {
        success: false,
        error: 'No persona data available to export'
      };
    }

    const prompt = generateChatGPTPrompt(data);
    await copyToClipboard(prompt);

    return { success: true };
  } catch (error) {
    console.error('ChatGPT prompt export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export ChatGPT prompt'
    };
  }
}

/**
 * Export ICP data as Claude prompt (copy to clipboard)
 */
export async function exportToClaudePrompt(
  data: AIPromptExportData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data || !data.personas || data.personas.length === 0) {
      return {
        success: false,
        error: 'No persona data available to export'
      };
    }

    const prompt = generateClaudePrompt(data);
    await copyToClipboard(prompt);

    return { success: true };
  } catch (error) {
    console.error('Claude prompt export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export Claude prompt'
    };
  }
}

/**
 * Export ICP data as Gemini prompt (copy to clipboard)
 */
export async function exportToGeminiPrompt(
  data: AIPromptExportData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data || !data.personas || data.personas.length === 0) {
      return {
        success: false,
        error: 'No persona data available to export'
      };
    }

    const prompt = generateGeminiPrompt(data);
    await copyToClipboard(prompt);

    return { success: true };
  } catch (error) {
    console.error('Gemini prompt export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export Gemini prompt'
    };
  }
}
