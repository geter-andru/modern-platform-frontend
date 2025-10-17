'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Sword,
  Eye,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from 'lucide-react';

interface CompetitiveIntelligenceProps {
  customerId: string;
}

interface Competitor {
  id: string;
  name: string;
  logo?: string;
  marketShare: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  strengths: string[];
  weaknesses: string[];
  recentActivity: string[];
  pricing: {
    model: string;
    range: string;
    competitive: boolean;
  };
  customerOverlap: number;
  trendDirection: 'gaining' | 'stable' | 'losing';
  lastUpdated: string;
}

interface MarketIntelligence {
  segment: string;
  growth: number;
  size: number;
  trends: string[];
  opportunities: string[];
  threats: string[];
}

interface CompetitivePosition {
  ourPosition: number;
  totalCompetitors: number;
  marketShare: number;
  differentiators: string[];
  competitiveAdvantages: string[];
  improvementAreas: string[];
}

export function CompetitiveIntelligence({ customerId }: CompetitiveIntelligenceProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence[]>([]);
  const [position, setPosition] = useState<CompetitivePosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [selectedThreat, setSelectedThreat] = useState<string>('all');

  const views = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'competitors', name: 'Competitors', icon: Sword },
    { id: 'market', name: 'Market Intel', icon: BarChart3 },
    { id: 'positioning', name: 'Our Position', icon: Target },
  ];

  const threatLevels = [
    { id: 'all', name: 'All Threats' },
    { id: 'critical', name: 'Critical' },
    { id: 'high', name: 'High' },
    { id: 'medium', name: 'Medium' },
    { id: 'low', name: 'Low' },
  ];

  useEffect(() => {
    generateIntelligence();
  }, [customerId, selectedView]);

  const generateIntelligence = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would call the analytics API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockCompetitors: Competitor[] = [
        {
          id: 'techcorp',
          name: 'TechCorp Solutions',
          marketShare: 0.28,
          threatLevel: 'high',
          strengths: [
            'Strong enterprise relationships',
            'Comprehensive product suite',
            'Global presence',
            'Established brand recognition',
          ],
          weaknesses: [
            'Complex implementation process',
            'Higher pricing structure',
            'Limited flexibility for SMBs',
            'Slower innovation cycles',
          ],
          recentActivity: [
            'Launched new AI-powered analytics module',
            'Acquired smaller competitor DataFlow',
            'Announced partnership with CloudTech',
            'Raised Series D funding ($150M)',
          ],
          pricing: {
            model: 'Enterprise',
            range: '$50,000 - $200,000',
            competitive: false,
          },
          customerOverlap: 0.15,
          trendDirection: 'gaining',
          lastUpdated: '2024-08-15',
        },
        {
          id: 'innovateai',
          name: 'InnovateAI',
          marketShare: 0.18,
          threatLevel: 'critical',
          strengths: [
            'Advanced AI capabilities',
            'Rapid innovation pace',
            'Strong technical team',
            'Modern architecture',
          ],
          weaknesses: [
            'Limited market presence',
            'Smaller customer base',
            'Less enterprise experience',
            'Funding dependencies',
          ],
          recentActivity: [
            'Released breakthrough ML algorithms',
            'Secured major enterprise client',
            'Expanded into European markets',
            'Hired former Google AI researcher as CTO',
          ],
          pricing: {
            model: 'SaaS',
            range: '$10,000 - $80,000',
            competitive: true,
          },
          customerOverlap: 0.22,
          trendDirection: 'gaining',
          lastUpdated: '2024-08-14',
        },
        {
          id: 'legacysys',
          name: 'LegacySystems Inc',
          marketShare: 0.35,
          threatLevel: 'medium',
          strengths: [
            'Large installed base',
            'Industry expertise',
            'Regulatory compliance',
            'Professional services',
          ],
          weaknesses: [
            'Outdated technology stack',
            'Slow product development',
            'User experience issues',
            'Integration challenges',
          ],
          recentActivity: [
            'Announced modernization initiative',
            'Partnered with cloud providers',
            'Launched customer migration program',
            'Reduced pricing by 15%',
          ],
          pricing: {
            model: 'On-premise',
            range: '$75,000 - $300,000',
            competitive: false,
          },
          customerOverlap: 0.08,
          trendDirection: 'losing',
          lastUpdated: '2024-08-10',
        },
        {
          id: 'nimbletech',
          name: 'NimbleTech',
          marketShare: 0.12,
          threatLevel: 'low',
          strengths: [
            'Agile development',
            'Customer-centric approach',
            'Competitive pricing',
            'Fast deployment',
          ],
          weaknesses: [
            'Limited feature depth',
            'Small team size',
            'Narrow market focus',
            'Scale limitations',
          ],
          recentActivity: [
            'Launched mobile application',
            'Added integration marketplace',
            'Expanded customer support',
            'Released API v2.0',
          ],
          pricing: {
            model: 'Per-user',
            range: '$25 - $100/user/month',
            competitive: true,
          },
          customerOverlap: 0.05,
          trendDirection: 'stable',
          lastUpdated: '2024-08-12',
        },
      ];

      const filteredCompetitors = selectedThreat === 'all' 
        ? mockCompetitors 
        : mockCompetitors.filter(comp => comp.threatLevel === selectedThreat);

      setCompetitors(filteredCompetitors);

      // Market intelligence data
      const mockMarketIntel: MarketIntelligence[] = [
        {
          segment: 'Enterprise Analytics',
          growth: 0.22,
          size: 12.5,
          trends: [
            'AI/ML integration becoming standard',
            'Real-time analytics demand growing',
            'Cloud-first approach accelerating',
            'Self-service analytics adoption',
          ],
          opportunities: [
            'Mid-market expansion potential',
            'Industry-specific solutions',
            'Partnership ecosystem growth',
            'International market entry',
          ],
          threats: [
            'Tech giants entering market',
            'Open-source alternatives',
            'Economic downturn impact',
            'Regulatory compliance changes',
          ],
        },
        {
          segment: 'SMB Solutions',
          growth: 0.35,
          size: 4.2,
          trends: [
            'Affordable SaaS solutions preferred',
            'Easy implementation critical',
            'Mobile-first requirements',
            'Integration capabilities essential',
          ],
          opportunities: [
            'Underserved market segments',
            'Freemium model adoption',
            'Partner channel expansion',
            'Vertical specialization',
          ],
          threats: [
            'Price pressure from competitors',
            'Customer churn risk',
            'Resource constraints',
            'Feature expectations gap',
          ],
        },
      ];

      setMarketIntelligence(mockMarketIntel);

      // Competitive position
      const mockPosition: CompetitivePosition = {
        ourPosition: 3,
        totalCompetitors: 12,
        marketShare: 0.15,
        differentiators: [
          'AI-powered customer insights',
          'Rapid deployment capability',
          'Flexible pricing models',
          'Industry-specific templates',
        ],
        competitiveAdvantages: [
          'Superior user experience',
          'Advanced analytics capabilities',
          'Strong customer support',
          'Continuous innovation',
        ],
        improvementAreas: [
          'Enterprise feature depth',
          'Global market presence',
          'Partnership ecosystem',
          'Brand recognition',
        ],
      };

      setPosition(mockPosition);

    } catch (error) {
      console.error('Failed to generate intelligence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'critical': return AlertTriangle;
      case 'high': return TrendingUp;
      case 'medium': return Target;
      case 'low': return CheckCircle;
      default: return Shield;
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'gaining': return ArrowUpRight;
      case 'losing': return ArrowDownRight;
      default: return BarChart3;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'gaining': return 'text-red-600';
      case 'losing': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Lightbulb className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Competitive Intelligence</h2>
              <p className="text-sm text-gray-600">AI-powered market analysis and competitor insights</p>
            </div>
          </div>
          <button
            onClick={generateIntelligence}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Intel'}
          </button>
        </div>

        {/* Quick Overview */}
        {position && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{position.ourPosition}</div>
              <div className="text-sm text-gray-600">Market Position</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(position.marketShare * 100)}%
              </div>
              <div className="text-sm text-gray-600">Market Share</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{competitors.length}</div>
              <div className="text-sm text-gray-600">Key Competitors</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {competitors.filter(c => c.threatLevel === 'critical' || c.threatLevel === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Threats</div>
            </div>
          </div>
        )}
      </div>

      {/* View Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {views.map((view) => {
            const IconComponent = view.icon;
            const isActive = selectedView === view.id;

            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`flex items-center px-4 py-2 rounded-lg border text-sm transition-all ${
                  isActive
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {view.name}
              </button>
            );
          })}
        </div>

        {selectedView === 'competitors' && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Threat Level</h3>
            <div className="flex flex-wrap gap-2">
              {threatLevels.map((threat) => {
                const isActive = selectedThreat === threat.id;

                return (
                  <button
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat.id)}
                    className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                      isActive
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {threat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Content based on selected view */}
      <div>
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Lightbulb className="h-12 w-12 text-red-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">AI is gathering competitive intelligence...</p>
          </div>
        ) : selectedView === 'competitors' ? (
          <div className="space-y-4">
            {competitors.map((competitor, index) => {
              const ThreatIcon = getThreatIcon(competitor.threatLevel);
              const TrendIcon = getTrendIcon(competitor.trendDirection);

              return (
                <motion.div
                  key={competitor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="p-3 rounded-lg bg-red-50 mr-4">
                        <Sword className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">
                            {competitor.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getThreatColor(competitor.threatLevel)} flex items-center`}>
                              <ThreatIcon className="h-3 w-3 mr-1" />
                              {competitor.threatLevel} threat
                            </span>
                            <span className={`flex items-center text-xs ${getTrendColor(competitor.trendDirection)}`}>
                              <TrendIcon className="h-3 w-3 mr-1" />
                              {competitor.trendDirection}
                            </span>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{Math.round(competitor.marketShare * 100)}%</div>
                            <div className="text-xs text-gray-600">Market Share</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-orange-600">{Math.round(competitor.customerOverlap * 100)}%</div>
                            <div className="text-xs text-gray-600">Customer Overlap</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-green-600">{competitor.pricing.range}</div>
                            <div className="text-xs text-gray-600">Pricing Range</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Strengths */}
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-1" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, strengthIndex) => (
                          <li key={strengthIndex} className="text-sm text-red-700 flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Weaknesses
                      </h4>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, weaknessIndex) => (
                          <li key={weaknessIndex} className="text-sm text-green-700 flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      Recent Activity
                    </h4>
                    <ul className="space-y-1">
                      {competitor.recentActivity.map((activity, activityIndex) => (
                        <li key={activityIndex} className="text-sm text-blue-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : selectedView === 'market' ? (
          <div className="space-y-4">
            {marketIntelligence.map((intel, index) => (
              <motion.div
                key={intel.segment}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{intel.segment}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{Math.round(intel.growth * 100)}% growth</span>
                      <span>${intel.size}B market size</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Trends */}
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Market Trends
                    </h4>
                    <ul className="space-y-1">
                      {intel.trends.map((trend, trendIndex) => (
                        <li key={trendIndex} className="text-sm text-purple-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Opportunities
                    </h4>
                    <ul className="space-y-1">
                      {intel.opportunities.map((opportunity, oppIndex) => (
                        <li key={oppIndex} className="text-sm text-green-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Threats
                    </h4>
                    <ul className="space-y-1">
                      {intel.threats.map((threat, threatIndex) => (
                        <li key={threatIndex} className="text-sm text-red-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : selectedView === 'positioning' && position ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Our Competitive Position</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Differentiators */}
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Key Differentiators
                </h4>
                <ul className="space-y-2">
                  {position.differentiators.map((diff, diffIndex) => (
                    <li key={diffIndex} className="text-sm text-indigo-700 flex items-start">
                      <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                      {diff}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitive Advantages */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Competitive Advantages
                </h4>
                <ul className="space-y-2">
                  {position.competitiveAdvantages.map((advantage, advIndex) => (
                    <li key={advIndex} className="text-sm text-green-700 flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Areas */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="text-sm font-medium text-orange-800 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Improvement Areas
                </h4>
                <ul className="space-y-2">
                  {position.improvementAreas.map((area, areaIndex) => (
                    <li key={areaIndex} className="text-sm text-orange-700 flex items-start">
                      <ArrowUpRight className="h-4 w-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Overview content
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threat Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Analysis</h3>
              <div className="space-y-3">
                {[
                  { level: 'critical', count: competitors.filter(c => c.threatLevel === 'critical').length, color: 'red' },
                  { level: 'high', count: competitors.filter(c => c.threatLevel === 'high').length, color: 'orange' },
                  { level: 'medium', count: competitors.filter(c => c.threatLevel === 'medium').length, color: 'yellow' },
                  { level: 'low', count: competitors.filter(c => c.threatLevel === 'low').length, color: 'green' },
                ].map((threat) => (
                  <div key={threat.level} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{threat.level} Threat</span>
                    <span className={`px-2 py-1 text-sm font-medium rounded bg-${threat.color}-100 text-${threat.color}-800`}>
                      {threat.count} competitors
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
              <div className="space-y-3">
                {marketIntelligence.map((intel) => (
                  <div key={intel.segment} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{intel.segment}</span>
                      <span className="text-sm text-green-600">+{Math.round(intel.growth * 100)}%</span>
                    </div>
                    <p className="text-sm text-gray-600">${intel.size}B market size</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}