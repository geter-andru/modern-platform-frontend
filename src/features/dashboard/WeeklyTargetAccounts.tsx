'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  RefreshCw, 
  Download, 
  Filter,
  Building2,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
  MapPin,
  TrendingUp,
  Clock,
  Star,
  ExternalLink,
  Plus,
  Search,
  Calendar,
  Zap,
  LucideIcon
} from 'lucide-react';

// TypeScript interfaces
interface PainPoint {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  evidence: string;
  source: string;
}

interface StrategyInitiative {
  id: string;
  initiative: string;
  timeline: string;
  priority: 'high' | 'medium' | 'low';
  evidence: string;
}

interface SolutionReason {
  id: string;
  reason: string;
  relevantFeatures: string[];
  expectedImpact: string;
  confidenceLevel: number;
}

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  linkedinUrl: string;
  department: string;
  decisionPower: 'high' | 'medium' | 'low';
  recentActivity: string;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  url: string;
  relevance: number;
}

interface TargetAccount {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  description: string;
  employeeCount: string;
  revenueRange: string;
  location: string;
  
  // Intelligence Data
  painPoints: PainPoint[];
  strategicInitiatives: StrategyInitiative[];
  solutionReasons: SolutionReason[];
  
  // LinkedIn Data
  keyStakeholders: Stakeholder[];
  recentNews: NewsItem[];
  
  // Research Metadata
  confidenceScore: number;
  researchDate: string;
  lastUpdated: string;
  sources: string[];
  
  // UI State
  isExpanded?: boolean;
  selectedTab?: 'painpoints' | 'initiatives' | 'solutions' | 'contacts';
}

interface AccountFilters {
  industry?: string;
  confidenceScore?: number;
  employeeRange?: string;
}

interface WeeklyTargetAccountsProps {
  onAccountSelect?: (account: TargetAccount) => void;
  onExperience?: (action: string, points: number) => void;
  className?: string;
}

/**
 * Weekly Target Accounts - AI-POWERED PROSPECTING INTELLIGENCE
 * 
 * Leverages Puppeteer MCP + LinkedIn MCP to identify 20 target accounts weekly
 * that match user's ICP profile with real-time market intelligence
 */

const WeeklyTargetAccounts: React.FC<WeeklyTargetAccountsProps> = ({
  onAccountSelect,
  onExperience,
  className = ''
}) => {
  const [accounts, setAccounts] = useState<TargetAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TargetAccount | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<AccountFilters>({});
  const [weeklyStats, setWeeklyStats] = useState({
    generated: '2024-01-15',
    nextRefresh: 3,
    reviewedCount: 0,
    addedToPipeline: 0
  });

  // Mock data for Phase 1 implementation
  const mockAccounts: TargetAccount[] = [
    {
      id: 'acc_001',
      companyName: 'TechFlow Dynamics',
      website: 'https://techflowdynamics.com',
      industry: 'Enterprise Software',
      description: 'B2B SaaS platform for workflow automation and team collaboration',
      employeeCount: '250-500',
      revenueRange: '$50M-100M',
      location: 'Austin, TX',
      painPoints: [
        {
          id: 'pp_001',
          description: 'Customer churn increasing due to poor onboarding experience',
          severity: 'high',
          evidence: 'Recent Glassdoor reviews mention customer success team overwhelmed',
          source: 'Glassdoor, LinkedIn posts'
        },
        {
          id: 'pp_002',
          description: 'Sales team struggling with complex pricing calculations',
          severity: 'medium',
          evidence: 'Job postings for Sales Operations role mention "pricing complexity"',
          source: 'Job postings analysis'
        },
        {
          id: 'pp_003',
          description: 'Manual reporting processes causing delays in board meetings',
          severity: 'medium',
          evidence: 'CFO LinkedIn post about "need for better business intelligence"',
          source: 'LinkedIn executive activity'
        }
      ],
      strategicInitiatives: [
        {
          id: 'si_001',
          initiative: 'Enterprise customer expansion into Fortune 500',
          timeline: 'Q2 2024',
          priority: 'high',
          evidence: 'CEO interview in TechCrunch about enterprise growth strategy'
        },
        {
          id: 'si_002',
          initiative: 'International market expansion to European markets',
          timeline: 'H2 2024',
          priority: 'medium',
          evidence: 'Recent London office opening announcement'
        },
        {
          id: 'si_003',
          initiative: 'AI-powered features integration across platform',
          timeline: 'Q3 2024',
          priority: 'high',
          evidence: 'Multiple ML engineer job postings, VP Eng LinkedIn activity'
        }
      ],
      solutionReasons: [
        {
          id: 'sr_001',
          reason: 'Revenue intelligence platform would solve pricing complexity and improve sales efficiency',
          relevantFeatures: ['Dynamic pricing calculator', 'Sales automation tools', 'Revenue forecasting'],
          expectedImpact: '25-30% improvement in sales cycle velocity',
          confidenceLevel: 0.85
        },
        {
          id: 'sr_002',
          reason: 'Customer intelligence features would reduce churn through better onboarding',
          relevantFeatures: ['Customer health scoring', 'Onboarding analytics', 'Success milestone tracking'],
          expectedImpact: '15-20% reduction in customer churn rate',
          confidenceLevel: 0.78
        },
        {
          id: 'sr_003',
          reason: 'Business intelligence dashboards would streamline board reporting',
          relevantFeatures: ['Executive dashboards', 'Automated reporting', 'KPI tracking'],
          expectedImpact: '60% reduction in report preparation time',
          confidenceLevel: 0.72
        }
      ],
      keyStakeholders: [
        {
          id: 'stakeholder_001',
          name: 'Sarah Martinez',
          title: 'CTO',
          linkedinUrl: '/in/sarah-martinez-cto',
          department: 'Engineering',
          decisionPower: 'high',
          recentActivity: 'Posted about AI integration challenges 3 days ago'
        },
        {
          id: 'stakeholder_002',
          name: 'Michael Chen',
          title: 'VP Sales',
          linkedinUrl: '/in/michael-chen-vp-sales',
          department: 'Sales',
          decisionPower: 'high',
          recentActivity: 'Shared article about B2B sales automation last week'
        },
        {
          id: 'stakeholder_003',
          name: 'Jennifer Walsh',
          title: 'CFO',
          linkedinUrl: '/in/jennifer-walsh-cfo',
          department: 'Finance',
          decisionPower: 'high',
          recentActivity: 'Published post about better business intelligence tools'
        }
      ],
      recentNews: [
        {
          id: 'news_001',
          title: 'TechFlow Dynamics Raises $25M Series B for Enterprise Expansion',
          date: '2024-01-10',
          source: 'TechCrunch',
          url: 'https://techcrunch.com/techflow-series-b',
          relevance: 0.95
        },
        {
          id: 'news_002',
          title: 'Company Opens London Office to Serve European Clients',
          date: '2024-01-05',
          source: 'Company Blog',
          url: 'https://techflowdynamics.com/blog/london-office',
          relevance: 0.82
        }
      ],
      confidenceScore: 0.87,
      researchDate: '2024-01-15',
      lastUpdated: '2024-01-15T10:30:00Z',
      sources: ['LinkedIn Company Page', 'Glassdoor', 'TechCrunch', 'Company Website', 'Job Postings'],
      selectedTab: 'painpoints'
    },
    // Second mock account with different profile
    {
      id: 'acc_002',
      companyName: 'DataCorp Analytics',
      website: 'https://datacorpanalytics.com',
      industry: 'Data & Analytics',
      description: 'Enterprise data analytics platform serving Fortune 1000 companies',
      employeeCount: '100-250',
      revenueRange: '$25M-50M',
      location: 'San Francisco, CA',
      painPoints: [
        {
          id: 'pp_004',
          description: 'Struggling to demonstrate ROI to enterprise clients',
          severity: 'high',
          evidence: 'Multiple customer success manager job postings mention ROI demonstration',
          source: 'Job postings, LinkedIn'
        },
        {
          id: 'pp_005',
          description: 'Complex client onboarding taking 6+ months',
          severity: 'high',
          evidence: 'Glassdoor reviews mention long implementation cycles',
          source: 'Glassdoor reviews'
        }
      ],
      strategicInitiatives: [
        {
          id: 'si_004',
          initiative: 'Reduce time-to-value for enterprise clients',
          timeline: 'Q1 2024',
          priority: 'high',
          evidence: 'CEO blog post about improving customer experience'
        }
      ],
      solutionReasons: [
        {
          id: 'sr_004',
          reason: 'Business case builder would help demonstrate clear ROI to prospects',
          relevantFeatures: ['ROI calculator', 'Business case templates', 'Value demonstration tools'],
          expectedImpact: '40% faster sales cycles through better value communication',
          confidenceLevel: 0.91
        }
      ],
      keyStakeholders: [
        {
          id: 'stakeholder_004',
          name: 'David Kim',
          title: 'VP Customer Success',
          linkedinUrl: '/in/david-kim-vp-cs',
          department: 'Customer Success',
          decisionPower: 'medium',
          recentActivity: 'Posted about customer onboarding best practices'
        }
      ],
      recentNews: [
        {
          id: 'news_003',
          title: 'DataCorp Analytics Partners with AWS for Enhanced Cloud Solutions',
          date: '2024-01-12',
          source: 'PR Newswire',
          url: 'https://prnewswire.com/datacorp-aws-partnership',
          relevance: 0.78
        }
      ],
      confidenceScore: 0.91,
      researchDate: '2024-01-15',
      lastUpdated: '2024-01-15T11:15:00Z',
      sources: ['LinkedIn', 'Glassdoor', 'Company Blog', 'PR Newswire'],
      selectedTab: 'solutions'
    }
  ];

  // Initialize component with mock data
  useEffect(() => {
    const loadAccounts = () => {
      // Simulate loading
      setIsLoading(true);
      setTimeout(() => {
        setAccounts(mockAccounts);
        setIsLoading(false);
      }, 1500);
    };

    loadAccounts();
  }, []);

  // Get severity styling
  const getSeverityStyle = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return { color: 'text-red-400', bg: 'bg-red-900/20', icon: AlertTriangle };
      case 'medium':
        return { color: 'text-yellow-400', bg: 'bg-yellow-900/20', icon: AlertTriangle };
      case 'low':
        return { color: 'text-green-400', bg: 'bg-green-900/20', icon: CheckCircle };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-900/20', icon: AlertTriangle };
    }
  };

  // Get priority styling
  const getPriorityStyle = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return { color: 'text-purple-400', bg: 'bg-purple-900/20' };
      case 'medium':
        return { color: 'text-blue-400', bg: 'bg-blue-900/20' };
      case 'low':
        return { color: 'text-gray-400', bg: 'bg-gray-900/20' };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-900/20' };
    }
  };

  // Handle account interaction
  const handleAccountInteraction = (account: TargetAccount, action: string, points: number) => {
    onExperience?.(action, points);
    
    // Update weekly stats
    if (action === 'account_reviewed') {
      setWeeklyStats(prev => ({
        ...prev,
        reviewedCount: prev.reviewedCount + 1
      }));
    } else if (action === 'added_to_pipeline') {
      setWeeklyStats(prev => ({
        ...prev,
        addedToPipeline: prev.addedToPipeline + 1
      }));
    }
  };

  // Handle tab selection
  const handleTabSelect = (account: TargetAccount, tab: TargetAccount['selectedTab']) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === account.id 
        ? { ...acc, selectedTab: tab }
        : acc
    ));
  };

  // Manual refresh function (will integrate with MCP in Phase 2)
  const handleManualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleAccountInteraction(accounts[0], 'manual_refresh', 25);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8 ${className}`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <RefreshCw className="w-12 h-12 text-blue-400" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Generating This Week's Target Accounts
          </h3>
          <p className="text-gray-400 mb-4">
            AI-powered research in progress using Puppeteer + LinkedIn intelligence...
          </p>
          <div className="w-64 mx-auto bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">This Week's Target Accounts</h2>
              <p className="text-gray-400 text-sm">
                AI-generated prospects matching your ICP • Generated Monday
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <div className="text-white font-medium">Next update in {weeklyStats.nextRefresh} days</div>
              <div className="text-gray-400">20 accounts generated</div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleManualRefresh}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Refresh accounts"
              >
                <RefreshCw className="w-4 h-4 text-gray-300" />
              </button>
              
              <button
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Export accounts"
              >
                <Download className="w-4 h-4 text-gray-300" />
              </button>
              
              <button
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Filter accounts"
              >
                <Filter className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{accounts.length}</div>
            <div className="text-xs text-gray-400">Total Accounts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{weeklyStats.reviewedCount}</div>
            <div className="text-xs text-gray-400">Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{weeklyStats.addedToPipeline}</div>
            <div className="text-xs text-gray-400">In Pipeline</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {accounts.length > 0 ? Math.round(accounts.reduce((sum, acc) => sum + acc.confidenceScore, 0) / accounts.length * 100) : 0}%
            </div>
            <div className="text-xs text-gray-400">Avg Confidence</div>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account, index) => (
          <AccountCard
            key={account.id}
            account={account}
            index={index}
            onTabSelect={handleTabSelect}
            onInteraction={handleAccountInteraction}
            getSeverityStyle={getSeverityStyle}
            getPriorityStyle={getPriorityStyle}
          />
        ))}
      </div>

      {/* Experience Points Summary */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-4">
        <div className="text-center">
          <h4 className="text-white font-medium mb-2 flex items-center justify-center">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            Weekly Prospecting Experience
          </h4>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="text-gray-300">
              <span className="text-green-400">+50 exp</span> Review all accounts
            </div>
            <div className="text-gray-300">
              <span className="text-blue-400">+75 exp</span> Add to pipeline
            </div>
            <div className="text-gray-300">
              <span className="text-purple-400">+100 exp</span> Contact stakeholder
            </div>
            <div className="text-gray-300">
              <span className="text-yellow-400">+200 exp</span> Book meeting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Account Card Component
const AccountCard: React.FC<{
  account: TargetAccount;
  index: number;
  onTabSelect: (account: TargetAccount, tab: TargetAccount['selectedTab']) => void;
  onInteraction: (account: TargetAccount, action: string, points: number) => void;
  getSeverityStyle: (severity: 'high' | 'medium' | 'low') => any;
  getPriorityStyle: (priority: 'high' | 'medium' | 'low') => any;
}> = ({ account, index, onTabSelect, onInteraction, getSeverityStyle, getPriorityStyle }) => {
  
  const handleTabClick = (tab: TargetAccount['selectedTab']) => {
    onTabSelect(account, tab);
    onInteraction(account, 'tab_viewed', 5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
    >
      {/* Company Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
                {account.companyName}
                <ExternalLink 
                  className="w-4 h-4 text-gray-400 ml-2 cursor-pointer hover:text-white" 
                  onClick={() => window.open(account.website, '_blank')}
                />
              </h3>
              <p className="text-gray-400 text-sm">{account.industry}</p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {account.employeeCount}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {account.location}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold">{Math.round(account.confidenceScore * 100)}%</span>
            </div>
            <div className="text-xs text-gray-400">Confidence Score</div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4">{account.description}</p>

        {/* Intelligence Tabs */}
        <div className="flex space-x-2 mb-4">
          {[
            { id: 'painpoints', label: 'Pain Points', icon: AlertTriangle, count: account.painPoints.length },
            { id: 'initiatives', label: 'Initiatives', icon: Target, count: account.strategicInitiatives.length },
            { id: 'solutions', label: 'Solutions', icon: CheckCircle, count: account.solutionReasons.length },
            { id: 'contacts', label: 'Contacts', icon: Users, count: account.keyStakeholders.length }
          ].map(tab => {
            const isActive = account.selectedTab === tab.id;
            const TabIcon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as TargetAccount['selectedTab'])}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-700' : 'bg-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {account.selectedTab === 'painpoints' && (
            <div className="space-y-3">
              {account.painPoints.map(painPoint => {
                const style = getSeverityStyle(painPoint.severity);
                return (
                  <div key={painPoint.id} className={`${style.bg} border border-gray-600 rounded-lg p-3`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white text-sm font-medium">{painPoint.description}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${style.bg} ${style.color}`}>
                        {painPoint.severity}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{painPoint.evidence}</p>
                    <div className="text-gray-500 text-xs">Source: {painPoint.source}</div>
                  </div>
                );
              })}
            </div>
          )}

          {account.selectedTab === 'initiatives' && (
            <div className="space-y-3">
              {account.strategicInitiatives.map(initiative => {
                const style = getPriorityStyle(initiative.priority);
                return (
                  <div key={initiative.id} className={`${style.bg} border border-gray-600 rounded-lg p-3`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white text-sm font-medium">{initiative.initiative}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${style.bg} ${style.color}`}>
                        {initiative.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Timeline: {initiative.timeline}</span>
                      <span>Evidence: {initiative.evidence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {account.selectedTab === 'solutions' && (
            <div className="space-y-3">
              {account.solutionReasons.map(solution => (
                <div key={solution.id} className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white text-sm font-medium">{solution.reason}</p>
                    <div className="text-right">
                      <div className="text-green-400 text-sm font-bold">
                        {Math.round(solution.confidenceLevel * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">Confidence</div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{solution.expectedImpact}</p>
                  <div className="flex flex-wrap gap-1">
                    {solution.relevantFeatures.map((feature, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-green-900/40 text-green-300 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {account.selectedTab === 'contacts' && (
            <div className="space-y-3">
              {account.keyStakeholders.map(stakeholder => (
                <div key={stakeholder.id} className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{stakeholder.name}</h4>
                      <p className="text-gray-400 text-sm">{stakeholder.title} • {stakeholder.department}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stakeholder.decisionPower === 'high' ? 'bg-red-900/40 text-red-300' :
                      stakeholder.decisionPower === 'medium' ? 'bg-yellow-900/40 text-yellow-300' :
                      'bg-gray-900/40 text-gray-300'
                    }`}>
                      {stakeholder.decisionPower} influence
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{stakeholder.recentActivity}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-800/50 flex space-x-3">
        <button 
          onClick={() => onInteraction(account, 'added_to_pipeline', 75)}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Pipeline</span>
        </button>
        
        <button 
          onClick={() => onInteraction(account, 'research_further', 25)}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Research Further</span>
        </button>
        
        <button 
          onClick={() => onInteraction(account, 'export_intel', 10)}
          className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default WeeklyTargetAccounts;