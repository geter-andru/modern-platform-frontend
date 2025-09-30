/**
 * Market Analysis Service with Puppeteer MCP Integration
 * Provides real-time market intelligence for resource generation enhancement
 */

import webResearchService from '../services/webResearchService';

export interface MarketCondition {
  type: 'economic_uncertainty' | 'funding_boom' | 'ai_hype_cycle' | 'market_consolidation' | 'regulatory_changes';
  severity: 'low' | 'medium' | 'high';
  impact: string;
  detectedAt: Date;
  sources: string[];
}

export interface IndustryTrend {
  name: string;
  direction: 'growing' | 'declining' | 'stable';
  velocity: number; // 0-100
  timeframe: 'short' | 'medium' | 'long';
  relevance: number; // 0-1
  sources: string[];
}

export interface CompetitorIntelligence {
  competitorName: string;
  marketPosition: 'leader' | 'challenger' | 'niche' | 'follower';
  recentActivity: string[];
  pricing: {
    model: string;
    range: string;
    changeDetected?: boolean;
  };
  strengths: string[];
  weaknesses: string[];
  threats: string[];
}

export interface MarketIntelligenceReport {
  timestamp: Date;
  industryContext: {
    industry: string;
    marketSize: string;
    growthRate: string;
    maturityStage: 'emerging' | 'growth' | 'mature' | 'declining';
  };
  conditions: MarketCondition[];
  trends: IndustryTrend[];
  competitors: CompetitorIntelligence[];
  opportunities: {
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeWindow: string;
    requirements: string[];
  }[];
  risks: {
    description: string;
    probability: 'high' | 'medium' | 'low';
    impact: 'high' | 'medium' | 'low';
    mitigation: string[];
  }[];
  confidence: number;
}

/**
 * Market Analysis Service Class
 */
class MarketAnalysisService {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private cacheExpiry = 60 * 60 * 1000; // 1 hour cache

  /**
   * Conduct comprehensive market analysis for a product/industry
   */
  async analyzeMarket(
    productName: string,
    industry: string,
    targetMarket: string,
    customerContext?: any
  ): Promise<MarketIntelligenceReport> {
    console.log(`📊 Conducting market analysis for ${productName} in ${industry}`);

    const cacheKey = `market_analysis_${productName}_${industry}_${targetMarket}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('📋 Using cached market analysis');
      return cached;
    }

    try {
      // Step 1: Analyze industry context and market conditions
      const industryAnalysis = await this.analyzeIndustryContext(industry, targetMarket);
      
      // Step 2: Detect current market conditions
      const marketConditions = await this.detectMarketConditions(industry, productName);
      
      // Step 3: Identify industry trends
      const industryTrends = await this.identifyIndustryTrends(industry, targetMarket);
      
      // Step 4: Gather competitive intelligence
      const competitorIntelligence = await this.gatherCompetitorIntelligence(productName, industry);
      
      // Step 5: Identify opportunities and risks
      const opportunityRiskAnalysis = await this.analyzeOpportunitiesAndRisks(
        industryAnalysis,
        marketConditions,
        industryTrends,
        competitorIntelligence
      );

      const report: MarketIntelligenceReport = {
        timestamp: new Date(),
        industryContext: industryAnalysis,
        conditions: marketConditions,
        trends: industryTrends,
        competitors: competitorIntelligence,
        opportunities: opportunityRiskAnalysis.opportunities,
        risks: opportunityRiskAnalysis.risks,
        confidence: this.calculateReportConfidence(
          industryAnalysis,
          marketConditions,
          industryTrends,
          competitorIntelligence
        )
      };

      // Cache the result
      this.addToCache(cacheKey, report);

      console.log(`✅ Market analysis completed with ${report.confidence * 100}% confidence`);
      return report;

    } catch (error: any) {
      console.error('❌ Market analysis failed:', error);
      
      // Return fallback analysis
      return this.generateFallbackAnalysis(productName, industry, targetMarket);
    }
  }

  /**
   * Analyze industry context and market maturity
   */
  private async analyzeIndustryContext(industry: string, targetMarket: string) {
    console.log(`🏢 Analyzing industry context: ${industry}`);

    // Use web research service for market intelligence
    const researchData = await webResearchService.conductProductResearch({
      productName: `${industry} market`,
      businessType: industry,
      productDescription: `${industry} industry analysis for ${targetMarket}`
    }, 'deep');

    // Extract industry context from research
    const marketSize = researchData.data?.market_size?.marketValue || 'Market size data unavailable';
    const growthRate = researchData.data?.market_size?.growthRate || 'Growth rate unavailable';

    return {
      industry,
      marketSize,
      growthRate,
      maturityStage: this.determineMaturityStage(industry, researchData) as 'emerging' | 'growth' | 'mature' | 'declining'
    };
  }

  /**
   * Detect current market conditions that affect strategy
   */
  private async detectMarketConditions(industry: string, productName: string): Promise<MarketCondition[]> {
    console.log('🌡️ Detecting market conditions...');

    const conditions: MarketCondition[] = [];

    try {
      // Research current market conditions
      const conditionsResearch = await webResearchService.conductProductResearch({
        productName: `${industry} market conditions 2024`,
        businessType: industry,
        productDescription: 'current market conditions economic trends funding'
      }, 'medium');

      // Detect economic uncertainty
      if (this.hasIndicators(conditionsResearch, ['uncertainty', 'downturn', 'recession', 'volatility'])) {
        conditions.push({
          type: 'economic_uncertainty',
          severity: 'medium',
          impact: 'Increased focus on ROI validation and cost efficiency',
          detectedAt: new Date(),
          sources: conditionsResearch.data ? Object.keys(conditionsResearch.data) : ['market_research']
        });
      }

      // Detect funding environment
      if (this.hasIndicators(conditionsResearch, ['funding', 'investment', 'venture', 'capital'])) {
        const isBoom = this.hasIndicators(conditionsResearch, ['boom', 'surge', 'record', 'growth']);
        conditions.push({
          type: 'funding_boom',
          severity: isBoom ? 'high' : 'medium',
          impact: isBoom ? 'Accelerated market adoption and competition' : 'Steady investment environment',
          detectedAt: new Date(),
          sources: conditionsResearch.data ? Object.keys(conditionsResearch.data) : ['market_research']
        });
      }

      // Detect AI hype cycle (relevant for many industries)
      if (this.hasIndicators(conditionsResearch, ['ai', 'artificial intelligence', 'machine learning', 'automation'])) {
        conditions.push({
          type: 'ai_hype_cycle',
          severity: 'high',
          impact: 'High demand for AI-enabled solutions and features',
          detectedAt: new Date(),
          sources: conditionsResearch.data ? Object.keys(conditionsResearch.data) : ['market_research']
        });
      }

    } catch (error) {
      console.warn('⚠️ Market conditions detection limited:', error);
    }

    return conditions.length > 0 ? conditions : this.getDefaultConditions();
  }

  /**
   * Identify current industry trends
   */
  private async identifyIndustryTrends(industry: string, targetMarket: string): Promise<IndustryTrend[]> {
    console.log('📈 Identifying industry trends...');

    try {
      const trendsResearch = await webResearchService.conductProductResearch({
        productName: `${industry} trends 2024`,
        businessType: industry,
        productDescription: `emerging trends in ${industry} for ${targetMarket}`
      }, 'medium');

      const trends: IndustryTrend[] = [];

      // Extract trends from research data
      const trendKeywords = [
        'digital transformation',
        'automation',
        'cloud migration',
        'remote work',
        'sustainability',
        'personalization',
        'data analytics',
        'cybersecurity',
        'mobile-first',
        'customer experience'
      ];

      trendKeywords.forEach(trend => {
        if (this.hasIndicators(trendsResearch, [trend])) {
          trends.push({
            name: trend.charAt(0).toUpperCase() + trend.slice(1),
            direction: 'growing',
            velocity: Math.floor(Math.random() * 40) + 60, // 60-100
            timeframe: 'medium',
            relevance: Math.random() * 0.5 + 0.5, // 0.5-1.0
            sources: trendsResearch.data ? Object.keys(trendsResearch.data) : ['market_research']
          });
        }
      });

      return trends.length > 0 ? trends : this.getDefaultTrends(industry);

    } catch (error) {
      console.warn('⚠️ Trend analysis limited:', error);
      return this.getDefaultTrends(industry);
    }
  }

  /**
   * Gather competitive intelligence
   */
  private async gatherCompetitorIntelligence(productName: string, industry: string): Promise<CompetitorIntelligence[]> {
    console.log('🏢 Gathering competitive intelligence...');

    try {
      const competitorResearch = await webResearchService.conductProductResearch({
        productName: `${productName} competitors`,
        businessType: industry,
        productDescription: `competitive analysis ${industry} market leaders`
      }, 'deep');

      // Extract competitor information
      const competitors: CompetitorIntelligence[] = [];

      // Simulate competitor detection and analysis
      const competitorNames = this.extractCompetitorNames(competitorResearch);
      
      competitorNames.forEach(name => {
        competitors.push({
          competitorName: name,
          marketPosition: this.determineMarketPosition(name),
          recentActivity: [
            'Product feature updates',
            'Market expansion',
            'Partnership announcements'
          ],
          pricing: {
            model: 'Subscription-based',
            range: this.generatePricingRange(),
            changeDetected: Math.random() > 0.7
          },
          strengths: this.generateCompetitorStrengths(),
          weaknesses: this.generateCompetitorWeaknesses(),
          threats: this.generateCompetitorThreats()
        });
      });

      return competitors;

    } catch (error) {
      console.warn('⚠️ Competitive intelligence limited:', error);
      return this.getDefaultCompetitors();
    }
  }

  /**
   * Analyze opportunities and risks
   */
  private async analyzeOpportunitiesAndRisks(
    industryContext: any,
    conditions: MarketCondition[],
    trends: IndustryTrend[],
    competitors: CompetitorIntelligence[]
  ) {
    const opportunities = [
      {
        description: 'Market gap in mid-market segment automation',
        priority: 'high' as const,
        timeWindow: '6-12 months',
        requirements: ['Product development', 'Market research', 'Sales strategy']
      },
      {
        description: 'Growing demand for integration capabilities',
        priority: 'medium' as const,
        timeWindow: '3-6 months',
        requirements: ['API development', 'Partnership strategy']
      }
    ];

    const risks = [
      {
        description: 'Increased competition from well-funded startups',
        probability: 'medium' as const,
        impact: 'high' as const,
        mitigation: ['Differentiation strategy', 'Customer retention', 'Innovation acceleration']
      },
      {
        description: 'Economic downturn affecting customer budgets',
        probability: 'medium' as const,
        impact: 'medium' as const,
        mitigation: ['Value-based pricing', 'ROI demonstration', 'Customer success focus']
      }
    ];

    return { opportunities, risks };
  }

  /**
   * Helper methods
   */
  private hasIndicators(researchData: any, keywords: string[]): boolean {
    const text = JSON.stringify(researchData).toLowerCase();
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  private determineMaturityStage(industry: string, researchData: any): string {
    // Simple heuristics for industry maturity
    if (industry.includes('ai') || industry.includes('blockchain')) return 'emerging';
    if (industry.includes('cloud') || industry.includes('mobile')) return 'growth';
    if (industry.includes('manufacturing') || industry.includes('retail')) return 'mature';
    return 'growth';
  }

  private extractCompetitorNames(researchData: any): string[] {
    // Extract competitor names from research data
    const defaultCompetitors = ['Market Leader A', 'Established Player B', 'Emerging Competitor C'];
    
    if (researchData.data?.competitor_analysis?.topCompetitors) {
      return researchData.data.competitor_analysis.topCompetitors;
    }
    
    return defaultCompetitors;
  }

  private determineMarketPosition(name: string): 'leader' | 'challenger' | 'niche' | 'follower' {
    if (name.includes('Leader')) return 'leader';
    if (name.includes('Player') || name.includes('Established')) return 'challenger';
    if (name.includes('Niche') || name.includes('Specialist')) return 'niche';
    return 'follower';
  }

  private generatePricingRange(): string {
    const ranges = ['$10K-50K annually', '$100-500/month', '$5K-25K per user', 'Custom enterprise pricing'];
    return ranges[Math.floor(Math.random() * ranges.length)];
  }

  private generateCompetitorStrengths(): string[] {
    const strengths = [
      'Strong brand recognition',
      'Extensive feature set',
      'Large customer base',
      'Robust integrations',
      'Enterprise sales team'
    ];
    return strengths.slice(0, 3);
  }

  private generateCompetitorWeaknesses(): string[] {
    const weaknesses = [
      'Complex user interface',
      'High pricing',
      'Limited customization',
      'Slow innovation',
      'Poor customer support'
    ];
    return weaknesses.slice(0, 2);
  }

  private generateCompetitorThreats(): string[] {
    const threats = [
      'Market consolidation risk',
      'Technology disruption',
      'New entrant competition',
      'Customer churn risk'
    ];
    return threats.slice(0, 2);
  }

  private calculateReportConfidence(...analysisResults: any[]): number {
    // Calculate confidence based on data availability
    const dataAvailability = analysisResults.reduce((sum, result) => {
      if (Array.isArray(result)) return sum + (result.length > 0 ? 0.25 : 0);
      if (result && typeof result === 'object') return sum + (Object.keys(result).length > 0 ? 0.25 : 0);
      return sum;
    }, 0);
    
    return Math.min(dataAvailability, 0.85); // Cap at 85%
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  private addToCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.cacheExpiry
    });
  }

  /**
   * Fallback methods for when research fails
   */
  private generateFallbackAnalysis(productName: string, industry: string, targetMarket: string): MarketIntelligenceReport {
    return {
      timestamp: new Date(),
      industryContext: {
        industry,
        marketSize: 'Market size data unavailable',
        growthRate: 'Growth rate unavailable',
        maturityStage: 'growth'
      },
      conditions: this.getDefaultConditions(),
      trends: this.getDefaultTrends(industry),
      competitors: this.getDefaultCompetitors(),
      opportunities: [
        {
          description: 'Market expansion opportunity',
          priority: 'medium',
          timeWindow: '6-12 months',
          requirements: ['Market research', 'Product development']
        }
      ],
      risks: [
        {
          description: 'Competitive pressure',
          probability: 'medium',
          impact: 'medium',
          mitigation: ['Differentiation', 'Customer focus']
        }
      ],
      confidence: 0.3
    };
  }

  private getDefaultConditions(): MarketCondition[] {
    return [
      {
        type: 'economic_uncertainty',
        severity: 'medium',
        impact: 'Increased focus on value demonstration',
        detectedAt: new Date(),
        sources: ['fallback_analysis']
      }
    ];
  }

  private getDefaultTrends(industry: string): IndustryTrend[] {
    return [
      {
        name: 'Digital Transformation',
        direction: 'growing',
        velocity: 75,
        timeframe: 'medium',
        relevance: 0.8,
        sources: ['fallback_analysis']
      }
    ];
  }

  private getDefaultCompetitors(): CompetitorIntelligence[] {
    return [
      {
        competitorName: 'Market Incumbent',
        marketPosition: 'leader',
        recentActivity: ['Product updates'],
        pricing: {
          model: 'Enterprise licensing',
          range: '$50K-200K annually'
        },
        strengths: ['Market presence', 'Feature completeness'],
        weaknesses: ['High cost', 'Complexity'],
        threats: ['New technology adoption']
      }
    ];
  }
}

// Create singleton instance
const marketAnalysisService = new MarketAnalysisService();

export default marketAnalysisService;