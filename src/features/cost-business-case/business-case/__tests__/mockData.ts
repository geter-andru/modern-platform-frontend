// Mock Test Data for Business Case Auto-Population Testing

import type { ICPData, BuyerPersona } from '@/src/features/icp-analysis/types/icp-types';

// ============================================================================
// MOCK ICP DATA (Series A Technical Founder)
// ============================================================================

export const mockICPData: ICPData = {
  id: 'icp-test-001',
  userId: 'user-test-001',
  companyName: 'TechScale Solutions',
  industry: 'B2B SaaS',
  generatedAt: new Date('2025-10-11'),
  confidence: 90,
  lastUpdated: new Date('2025-10-11'),
  sections: {
    overview: 'Series A B2B SaaS company scaling from $2M to $10M ARR',
    marketPosition: 'Strong product-market fit with technical buyers, expanding to business buyers',
    challenges: 'Pipeline quality issues and enterprise deal conversion'
  },
  buyerPersonas: [
    {
      id: 'persona-001',
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      title: 'Chief Executive Officer',
      demographics: {
        ageRange: '35-45',
        experience: '15+ years in tech',
        education: 'Computer Science, Stanford',
        location: 'San Francisco Bay Area',
        companySize: '50-100 employees',
        industry: 'B2B SaaS'
      },
      psychographics: {
        values: [
          'Systematic efficiency over quick fixes',
          'Data-driven decision making',
          'Long-term strategic thinking'
        ],
        motivations: [
          'Achieve predictable revenue growth',
          'Build world-class sales organization',
          'Maintain technical credibility with enterprise buyers'
        ],
        fears: [
          'Missing Series B fundraising targets',
          'Losing credibility with board due to pipeline issues',
          'Wasting capital on wrong sales hires'
        ],
        personality: 'INTJ (Architect)',
        workStyle: 'Analytical, systematic, data-focused',
        communicationStyle: 'Direct, technical, evidence-based'
      },
      goals: [
        'Scale from $2M to $10M ARR in 18 months',
        'Build repeatable enterprise sales motion',
        'Achieve Series B fundraising targets by Q4 2025'
      ],
      painPoints: [
        'Cannot accurately forecast revenue pipeline',
        'Losing enterprise deals to competitors with better business value articulation',
        'Sales team struggles to communicate ROI to economic buyers',
        'No systematic qualification process leading to wasted opportunities'
      ],
      buyingBehavior: {
        researchStyle: 'Thorough technical evaluation before purchase',
        riskTolerance: 'Low - needs proven ROI',
        decisionSpeed: 'Deliberate - 2-4 weeks for tools',
        informationSources: ['Peer recommendations', 'Technical documentation', 'Case studies'],
        evaluationCriteria: ['ROI proof', 'Integration ease', 'Technical credibility', 'Time to value'],
        decisionProcess: 'Analytical evaluation → ROI validation → Implementation planning'
      },
      communicationPreferences: {
        preferredChannels: ['Email', 'Product demos', 'Documentation'],
        communicationStyle: 'Technical, direct, data-driven',
        meetingPreferences: 'Concise, agenda-driven, outcome-focused',
        followUpFrequency: 'Weekly updates',
        contentPreferences: ['Case studies', 'ROI calculators', 'Technical whitepapers']
      },
      technologyUsage: {
        currentTools: ['HubSpot', 'Salesforce', 'Gong', 'Outreach'],
        techSavviness: 'Very high - technical founder',
        preferredPlatforms: ['Web app', 'API integrations', 'Slack'],
        integrationRequirements: ['CRM sync', 'Sales automation', 'Data export']
      },
      objections: [
        'Does this actually work for B2B SaaS?',
        'How long until we see results?',
        'What if our sales team resists new tools?',
        'Can we prove ROI to the board?'
      ],
      informationSources: [
        'SaaStr community',
        'Founder peer groups',
        'Y Combinator network',
        'Industry analysts'
      ],
      decisionInfluence: {
        influencers: ['VP Sales', 'CFO', 'Board Members'],
        decisionFactors: ['ROI proof', 'Risk mitigation', 'Speed to value', 'Integration ease'],
        approvalProcess: 'CEO decides with CFO sign-off for budget',
        budgetAuthority: 'Up to $100K annually',
        timeline: '2-4 weeks evaluation to purchase decision'
      }
    },
    {
      id: 'persona-002',
      name: 'Marcus Rodriguez',
      role: 'VP Sales',
      title: 'Vice President of Sales',
      demographics: {
        ageRange: '40-50',
        experience: '20+ years in B2B sales',
        education: 'Business Administration, USC',
        location: 'San Francisco Bay Area',
        companySize: '50-100 employees',
        industry: 'B2B SaaS'
      },
      psychographics: {
        values: [
          'Results-driven execution',
          'Team enablement and coaching',
          'Process optimization'
        ],
        motivations: [
          'Hit aggressive revenue targets',
          'Build high-performing sales team',
          'Establish credibility with CEO and board'
        ],
        fears: [
          'Missing quota and losing credibility',
          'Team churning due to lack of tools',
          'Being unable to justify sales investments'
        ],
        personality: 'ENTJ (Commander)',
        workStyle: 'Goal-oriented, strategic, team-focused',
        communicationStyle: 'Assertive, persuasive, outcome-focused'
      },
      goals: [
        'Close 5 enterprise deals in next quarter',
        'Reduce sales cycle from 6 months to 3 months',
        'Improve win rate from 15% to 30%'
      ],
      painPoints: [
        'Cannot articulate business value to CFOs and procurement',
        'Deals stalling at economic buyer stage',
        'Lack of tools to create professional business cases',
        'Sales team spends too much time on unqualified leads'
      ],
      buyingBehavior: {
        researchStyle: 'Pragmatic - focus on results',
        riskTolerance: 'Medium - willing to try new approaches',
        decisionSpeed: 'Fast - 1-2 weeks if CEO approves',
        informationSources: ['Sales leaders network', 'LinkedIn', 'Sales conferences'],
        evaluationCriteria: ['Ease of use', 'Team adoption', 'Immediate impact', 'Training support'],
        decisionProcess: 'Quick evaluation → Pilot test → Rollout to team'
      },
      communicationPreferences: {
        preferredChannels: ['Phone calls', 'Video meetings', 'Slack'],
        communicationStyle: 'Direct, action-oriented, results-focused',
        meetingPreferences: 'Interactive demos, hands-on trials',
        followUpFrequency: 'Daily during evaluation',
        contentPreferences: ['Video demos', 'Quick-start guides', 'Success stories']
      },
      technologyUsage: {
        currentTools: ['Salesforce', 'Outreach', 'LinkedIn Sales Navigator', 'Gong'],
        techSavviness: 'High - comfortable with sales tech',
        preferredPlatforms: ['Mobile app', 'Browser extension', 'Salesforce integration'],
        integrationRequirements: ['Salesforce native', 'Outreach integration', 'Mobile access']
      },
      objections: [
        'Will my team actually use this?',
        'How much training is required?',
        'Can we see results in 30 days?',
        'What if it doesn\'t integrate with our stack?'
      ],
      informationSources: [
        'Sales Hacker community',
        'Revenue Collective',
        'Sales leadership podcasts',
        'Peer referrals'
      ],
      decisionInfluence: {
        influencers: ['CEO', 'Sales Ops', 'Top AEs'],
        decisionFactors: ['Team adoption', 'Quick wins', 'Training ease', 'ROI proof'],
        approvalProcess: 'Recommends to CEO, needs CFO approval for budget',
        budgetAuthority: 'Recommends up to $50K',
        timeline: '1-2 weeks to make recommendation'
      }
    }
  ]
};

// ============================================================================
// MOCK COST CALCULATOR DATA
// ============================================================================

export const mockCostCalculatorResults = {
  costData: {
    delayedRevenue: 45000,       // $45K/month in delayed revenue
    competitorAdvantage: 23000,  // $23K/month competitive losses
    teamEfficiency: 12000,        // $12K/month efficiency losses
    marketOpportunity: 38000      // $38K/month missed opportunities
  },
  timeframe: 6, // months
  totalCost: 708000, // (45000 + 23000 + 12000 + 38000) * 6 = 708000
  savingsOpportunity: 531000, // 75% of total cost
  customerData: {
    currentARR: '$2M ARR',
    targetARR: '$10M ARR',
    growthStage: 'rapid_scaling'
  }
};

// ============================================================================
// MOCK USER CONTEXT
// ============================================================================

export const mockUserContext = {
  championName: 'Sarah Chen',
  championTitle: 'CEO & Co-Founder',
  partnerName: 'Alex Thompson',
  partnerCompany: 'Revenue Intelligence Partners',
  recommendedSolution: 'Systematic Revenue Intelligence Platform',
  totalInvestment: 150000, // $150K annual investment
  implementationTimeline: 'Q2 2025',
  alternativesConsidered: ['Gong', 'Clari', 'Internal Build'],
  uniqueDeliverable: 'Automated business case generation from ICP analysis with systematic scaling framework'
};

// ============================================================================
// EXPECTED AUTO-POPULATION RESULTS (for validation)
// ============================================================================

export const expectedAutoPopulationResults = {
  header: {
    companyName: 'TechScale Solutions',
    championName: 'Sarah Chen',
    championTitle: 'CEO & Co-Founder',
    partnerName: 'Alex Thompson',
    partnerCompany: 'Revenue Intelligence Partners',
    // priorityHeadline will be AI-generated
  },
  executiveSummary: {
    businessChange: 'Cannot accurately forecast revenue pipeline',
    recommendedSolution: 'Systematic Revenue Intelligence Platform',
    implementationTimeline: 'Q2 2025',
    currentCostPain: '$708K in delayed revenue, competitive losses, and missed opportunities',
    executiveGoal: 'Scale from $2M to $10M ARR in 18 months',
    // fullSummary will be AI-generated
  },
  businessChallenge: {
    currentRealityDescription: 'Cannot accurately forecast revenue pipeline',
    frequency: '6 months',
    affectedCount: 50, // Parsed from "50-100 employees"
    affectedStakeholders: 'CEO & Co-Founder, VP Sales',
    specificProblem: 'Losing enterprise deals to competitors with better business value articulation',
    dollarCost: 708000,
    // consequence and timeline will be user-provided
  },
  approachDifferentiation: {
    discoveryStakeholders: ['Sarah Chen', 'Marcus Rodriguez'],
    // capabilities will be user-provided
  },
  businessImpactROI: {
    visionFrom: 'Cannot accurately forecast revenue pipeline',
    visionTo: 'Scale from $2M to $10M ARR in 18 months',
    financialROI: '3.5:1 ROI within 6 months', // 531000 / 150000 = 3.54
    executiveKPI: {
      impactArea: 'Revenue Growth',
      currentState: '$2M ARR',
      targetByDate: '$10M ARR by Q4 2026',
      strategicValue: 'Scale from $2M to $10M ARR in 18 months'
    }
  },
  investmentImplementation: {
    totalInvestment: 150000,
    roiRatio: '3.5:1',
    roiTimeframe: 'within 6 months'
  },
  strategyNextSteps: {
    valueAlignment1: 'Systematic efficiency over quick fixes',
    valueAlignment2: 'Data-driven decision making',
    valueAlignment3: 'Long-term strategic thinking',
    alternativesConsidered: ['Gong', 'Clari', 'Internal Build'],
    uniqueDeliverable: 'Automated business case generation from ICP analysis with systematic scaling framework'
  }
};

// ============================================================================
// CONFIDENCE SCORE EXPECTATIONS
// ============================================================================

export const expectedConfidenceScores = {
  // From ICP (85-90%)
  'header.companyName': 0.9,
  'executiveSummary.businessChange': 0.85,
  'executiveSummary.executiveGoal': 0.85,
  'businessChallenge.currentRealityDescription': 0.85,
  'businessChallenge.affectedStakeholders': 0.9,
  'approachDifferentiation.discoveryStakeholders': 0.9,
  'strategyNextSteps.valueAlignment1': 0.85,

  // From Cost Calculator (95%)
  'executiveSummary.currentCostPain': 0.95,
  'businessChallenge.dollarCost': 0.95,
  'businessChallenge.frequency': 0.95,
  'businessImpactROI.financialROI': 0.95,
  'investmentImplementation.roiRatio': 0.95,

  // From User Context (100%)
  'header.championName': 1.0,
  'header.championTitle': 1.0,
  'executiveSummary.recommendedSolution': 1.0,
  'investmentImplementation.totalInvestment': 1.0,
  'strategyNextSteps.alternativesConsidered': 1.0,

  // AI-Generated (75-90%)
  'header.priorityHeadline': 0.85,
  'executiveSummary.fullSummary': 0.9
};
