'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  BookOpenIcon,
  CalculatorIcon,
  UserGroupIcon,
  CogIcon,
  BoltIcon,
  LightBulbIcon,
  FireIcon,
  SparklesIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface CompanyRatingInterfaceProps {
  framework?: any;
  onRatingComplete?: (rating: any) => void;
}

interface CompanyData {
  name: string;
  website: string;
  industry: string;
  employees: string;
  arr: string;
  growth: string;
  salesCycle: string;
  salesTeamSize: string;
  crm: string;
  challenges: string[];
  techStack: string[];
  evaluatingTools: boolean;
  dataDriver: boolean;
}

interface CategoryScore {
  categoryId: string;
  score: number;
  reasoning: string;
}

const CompanyRatingInterface: React.FC<CompanyRatingInterfaceProps> = ({ 
  framework: providedFramework,
  onRatingComplete 
}) => {
  const [activeTab, setActiveTab] = useState<'framework' | 'rate' | 'results'>('framework');
  const [framework, setFramework] = useState<any>(providedFramework || null);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    website: '',
    industry: '',
    employees: '',
    arr: '',
    growth: '',
    salesCycle: '',
    salesTeamSize: '',
    crm: '',
    challenges: [],
    techStack: [],
    evaluatingTools: false,
    dataDriver: false
  });
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [tier, setTier] = useState<any>(null);
  const [showFrameworkDetails, setShowFrameworkDetails] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Load saved framework from localStorage if not provided
  useEffect(() => {
    if (!providedFramework) {
      const savedFramework = localStorage.getItem('icpRatingFramework');
      if (savedFramework) {
        setFramework(JSON.parse(savedFramework));
      } else {
        // Use default framework if none exists
        setFramework(getDefaultFramework());
      }
    }
  }, [providedFramework]);

  // Save framework to localStorage when it changes
  useEffect(() => {
    if (framework) {
      localStorage.setItem('icpRatingFramework', JSON.stringify(framework));
    }
  }, [framework]);

  const getDefaultFramework = () => {
    return {
      interactive: {
        rating_system: {
          categories: [
            {
              id: "company_size",
              name: "Company Size & Growth",
              type: "firmographic",
              weight: 0.20,
              icon: BuildingOfficeIcon,
              description: "Employee count and ARR within ICP sweet spot",
              scoring: {
                "4": {
                  criteria: ["50-500 employees", "$5M-$50M ARR", "30%+ YoY growth"],
                  examples: ["Series B SaaS with 200 employees, $20M ARR"],
                  data_sources: ["LinkedIn", "Crunchbase", "Company website"]
                },
                "3": {
                  criteria: ["30-600 employees", "$3M-$75M ARR", "20%+ growth"],
                  examples: ["Late Series A or Series C companies"]
                },
                "2": {
                  criteria: ["20-1000 employees", "$1M-$100M ARR", "10%+ growth"],
                  examples: ["Companies outside sweet spot but still viable"]
                },
                "1": {
                  criteria: ["<20 or >1000 employees", "<$1M or >$100M ARR", "<10% growth"],
                  examples: ["Too small or enterprise-level"]
                }
              }
            },
            {
              id: "sales_complexity",
              name: "Sales Process Complexity",
              type: "firmographic",
              weight: 0.15,
              icon: UserGroupIcon,
              description: "Deal complexity and team structure alignment",
              scoring: {
                "4": {
                  criteria: ["3+ month sales cycles", "10+ sales reps", "Multiple stakeholders"],
                  examples: ["Enterprise software sales teams"],
                  data_sources: ["Sales team page", "Job postings", "LinkedIn Sales Navigator"]
                },
                "3": {
                  criteria: ["2-4 month cycles", "5-15 reps", "3+ stakeholders"],
                  examples: ["Mid-market B2B SaaS"]
                },
                "2": {
                  criteria: ["1-3 month cycles", "3-20 reps", "2+ stakeholders"],
                  examples: ["SMB-focused SaaS"]
                },
                "1": {
                  criteria: ["<1 month cycles", "<3 reps", "Single stakeholder"],
                  examples: ["Transactional or self-serve"]
                }
              }
            },
            {
              id: "tech_stack",
              name: "Technology Stack Fit",
              type: "firmographic",
              weight: 0.15,
              icon: CogIcon,
              description: "CRM usage and integration readiness",
              scoring: {
                "4": {
                  criteria: ["Uses Salesforce/HubSpot", "Data-driven culture", "Multiple sales tools"],
                  examples: ["Salesforce + Gong + Outreach stack"],
                  data_sources: ["BuiltWith", "Job postings", "G2 reviews"]
                },
                "3": {
                  criteria: ["Uses major CRM", "Some sales tools", "Tech-forward"],
                  examples: ["Pipedrive + basic sales stack"]
                },
                "2": {
                  criteria: ["Basic CRM usage", "Limited tools", "Open to technology"],
                  examples: ["Using spreadsheets + simple CRM"]
                },
                "1": {
                  criteria: ["No CRM", "Manual processes", "Tech-resistant"],
                  examples: ["Email and spreadsheets only"]
                }
              }
            },
            {
              id: "pain_intensity",
              name: "Pain Point Intensity",
              type: "behavioral",
              weight: 0.20,
              icon: FireIcon,
              description: "Urgency of sales productivity challenges",
              scoring: {
                "4": {
                  criteria: ["Struggling with forecast accuracy", "Sales productivity issues", "Scaling challenges"],
                  examples: ["Missed targets 2+ quarters", "Rep ramp time >6 months"],
                  data_sources: ["Earnings calls", "News", "Reviews"]
                },
                "3": {
                  criteria: ["Some sales challenges", "Growth plateauing", "Efficiency concerns"],
                  examples: ["Looking to improve win rates"]
                },
                "2": {
                  criteria: ["Minor inefficiencies", "Considering optimization", "Future planning"],
                  examples: ["Proactive improvement seeking"]
                },
                "1": {
                  criteria: ["No urgent pain", "Happy with current state", "Not prioritizing sales"],
                  examples: ["Product-led growth focus"]
                }
              }
            },
            {
              id: "buying_readiness",
              name: "Buying Readiness Signals",
              type: "behavioral",
              weight: 0.15,
              icon: BoltIcon,
              description: "Active evaluation and budget indicators",
              scoring: {
                "4": {
                  criteria: ["Hiring sales ops", "Evaluating tools", "Budget allocated"],
                  examples: ["Posted sales ops job", "RFP for sales tools"],
                  data_sources: ["Job boards", "Intent data", "Vendor reviews"]
                },
                "3": {
                  criteria: ["Researching solutions", "Building business case", "Planning budget"],
                  examples: ["Downloading whitepapers", "Attending webinars"]
                },
                "2": {
                  criteria: ["Aware of need", "Information gathering", "Future consideration"],
                  examples: ["Following thought leaders", "Early research"]
                },
                "1": {
                  criteria: ["No active research", "No budget", "Other priorities"],
                  examples: ["Focus on other initiatives"]
                }
              }
            },
            {
              id: "innovation_culture",
              name: "Innovation & Data Culture",
              type: "behavioral",
              weight: 0.15,
              icon: LightBulbIcon,
              description: "Openness to AI and data-driven decisions",
              scoring: {
                "4": {
                  criteria: ["Data-driven decisions", "Early adopters", "Innovation mandate"],
                  examples: ["Published about AI adoption", "Data team in place"],
                  data_sources: ["Company blog", "Leadership LinkedIn", "Press releases"]
                },
                "3": {
                  criteria: ["Open to innovation", "Some data usage", "Progressive mindset"],
                  examples: ["Testing new technologies"]
                },
                "2": {
                  criteria: ["Traditional but curious", "Limited data usage", "Cautious adoption"],
                  examples: ["Considering digital transformation"]
                },
                "1": {
                  criteria: ["Risk-averse", "Intuition-based", "Resistant to change"],
                  examples: ["Prefer proven methods only"]
                }
              }
            }
          ],
          tiers: [
            {
              name: "🎯 Perfect ICP Match",
              range: [20, 24],
              color: "from-green-500 to-emerald-600",
              description: "Exceptional alignment - highest conversion probability",
              actions: [
                "Immediate executive outreach",
                "Custom ROI analysis",
                "Fast-track POC process",
                "Assign senior AE"
              ],
              conversion_probability: "65-80%",
              typical_deal_size: "$75K-150K ACV",
              sales_cycle: "45-60 days"
            },
            {
              name: "💪 Strong ICP Fit",
              range: [16, 19],
              color: "from-blue-500 to-indigo-600",
              description: "Good alignment - standard high-priority process",
              actions: [
                "Personalized outreach",
                "Industry-specific case studies",
                "Standard demo track",
                "Regular AE assignment"
              ],
              conversion_probability: "35-50%",
              typical_deal_size: "$50K-100K ACV",
              sales_cycle: "60-90 days"
            },
            {
              name: "📈 Moderate ICP Fit",
              range: [12, 15],
              color: "from-yellow-500 to-orange-600",
              description: "Some alignment - nurture until stronger fit",
              actions: [
                "Add to nurture campaigns",
                "Educational content track",
                "Quarterly check-ins",
                "SDR ownership"
              ],
              conversion_probability: "15-25%",
              typical_deal_size: "$30K-75K ACV",
              sales_cycle: "90-120 days"
            },
            {
              name: "🔄 Poor ICP Fit",
              range: [6, 11],
              color: "from-gray-400 to-gray-600",
              description: "Weak alignment - minimal resource allocation",
              actions: [
                "Automated email sequences",
                "Self-serve resources",
                "Annual review only",
                "Marketing-only touch"
              ],
              conversion_probability: "5-10%",
              typical_deal_size: "$20K-40K ACV",
              sales_cycle: "120+ days"
            }
          ]
        }
      }
    };
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const loadSampleCompany = () => {
    setCompanyData({
      name: 'TechScale Solutions',
      website: 'www.techscale.com',
      industry: 'B2B SaaS',
      employees: '250',
      arr: '$22M',
      growth: '35%',
      salesCycle: '3-4 months',
      salesTeamSize: '15',
      crm: 'Salesforce',
      challenges: ['forecast_accuracy', 'sales_productivity', 'scaling'],
      techStack: ['Salesforce', 'Outreach', 'Gong'],
      evaluatingTools: true,
      dataDriver: true
    });
  };

  const calculateScores = () => {
    if (!framework) return;

    const scores: CategoryScore[] = [];
    let total = 0;

    framework.interactive.rating_system.categories.forEach((category: any) => {
      let score = 0;
      let reasoning = '';

      // Auto-scoring logic based on company data
      switch(category.id) {
        case 'company_size':
          const employees = parseInt(companyData.employees);
          const arrNum = parseFloat(companyData.arr.replace(/[$M]/g, ''));
          const growthNum = parseFloat(companyData.growth.replace('%', ''));
          
          if (employees >= 50 && employees <= 500 && arrNum >= 5 && arrNum <= 50 && growthNum >= 30) {
            score = 4;
            reasoning = 'Perfect fit: Mid-market size with high growth';
          } else if (employees >= 30 && employees <= 600 && arrNum >= 3 && arrNum <= 75 && growthNum >= 20) {
            score = 3;
            reasoning = 'Strong fit: Good size and growth metrics';
          } else if (employees >= 20 && employees <= 1000 && arrNum >= 1 && arrNum <= 100 && growthNum >= 10) {
            score = 2;
            reasoning = 'Moderate fit: Some characteristics align';
          } else {
            score = 1;
            reasoning = 'Poor fit: Outside target parameters';
          }
          break;

        case 'sales_complexity':
          if (companyData.salesCycle.includes('3') && parseInt(companyData.salesTeamSize) >= 10) {
            score = 4;
            reasoning = 'Complex sales process needing our solution';
          } else if (parseInt(companyData.salesTeamSize) >= 5) {
            score = 3;
            reasoning = 'Moderate complexity with decent team size';
          } else if (parseInt(companyData.salesTeamSize) >= 3) {
            score = 2;
            reasoning = 'Some complexity present';
          } else {
            score = 1;
            reasoning = 'Simple sales process';
          }
          break;

        case 'tech_stack':
          if (companyData.crm === 'Salesforce' && companyData.techStack.length >= 3) {
            score = 4;
            reasoning = 'Advanced tech stack with Salesforce';
          } else if (companyData.crm && companyData.techStack.length >= 2) {
            score = 3;
            reasoning = 'Good CRM and tech adoption';
          } else if (companyData.crm) {
            score = 2;
            reasoning = 'Basic CRM in place';
          } else {
            score = 1;
            reasoning = 'Limited technology adoption';
          }
          break;

        case 'pain_intensity':
          if (companyData.challenges.includes('forecast_accuracy') || companyData.challenges.includes('sales_productivity')) {
            score = 4;
            reasoning = 'Critical pain points we solve';
          } else if (companyData.challenges.includes('scaling')) {
            score = 3;
            reasoning = 'Growth challenges present';
          } else if (companyData.challenges.length > 0) {
            score = 2;
            reasoning = 'Some challenges identified';
          } else {
            score = 1;
            reasoning = 'No urgent pain points';
          }
          break;

        case 'buying_readiness':
          if (companyData.evaluatingTools) {
            score = 4;
            reasoning = 'Actively evaluating solutions';
          } else if (companyData.challenges.length >= 2) {
            score = 3;
            reasoning = 'Multiple pain points suggest readiness';
          } else if (companyData.challenges.length >= 1) {
            score = 2;
            reasoning = 'Some buying indicators';
          } else {
            score = 1;
            reasoning = 'No clear buying signals';
          }
          break;

        case 'innovation_culture':
          if (companyData.dataDriver && companyData.techStack.length >= 3) {
            score = 4;
            reasoning = 'Data-driven with modern stack';
          } else if (companyData.dataDriver) {
            score = 3;
            reasoning = 'Open to data-driven approaches';
          } else if (companyData.techStack.length >= 2) {
            score = 2;
            reasoning = 'Some innovation adoption';
          } else {
            score = 1;
            reasoning = 'Traditional approach';
          }
          break;

        default:
          score = 2;
          reasoning = 'Unable to determine';
      }

      scores.push({ categoryId: category.id, score, reasoning });
      total += score * category.weight;
    });

    setCategoryScores(scores);
    setTotalScore(Math.round(total * 4)); // Scale to 24 point system

    // Determine tier
    const finalScore = Math.round(total * 4);
    const matchedTier = framework.interactive.rating_system.tiers.find((t: any) => 
      finalScore >= t.range[0] && finalScore <= t.range[1]
    );
    setTier(matchedTier);
    setActiveTab('results');

    if (onRatingComplete) {
      onRatingComplete({
        company: companyData,
        scores,
        totalScore: finalScore,
        tier: matchedTier
      });
    }
  };

  const getScoreColor = (score: number) => {
    switch(score) {
      case 4: return 'text-green-600 bg-green-50';
      case 3: return 'text-blue-600 bg-blue-50';
      case 2: return 'text-yellow-600 bg-yellow-50';
      case 1: return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreLabel = (score: number) => {
    switch(score) {
      case 4: return 'Perfect';
      case 3: return 'Strong';
      case 2: return 'Moderate';
      case 1: return 'Poor';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Company ICP Rating System
          </h1>
          <p className="text-gray-600">
            View your framework and rate companies against your ideal customer profile
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('framework')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'framework' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpenIcon className="h-5 w-5 inline mr-2" />
            View Framework
          </button>
          <button
            onClick={() => setActiveTab('rate')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'rate' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalculatorIcon className="h-5 w-5 inline mr-2" />
            Rate Company
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'results' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            } ${!totalScore ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!totalScore}
          >
            <ChartBarIcon className="h-5 w-5 inline mr-2" />
            View Results
          </button>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'framework' && framework && (
            <motion.div
              key="framework"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your ICP Rating Framework</h2>
              
              {/* Categories Overview */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Categories</h3>
                <div className="space-y-4">
                  {framework.interactive.rating_system.categories.map((category: any) => {
                    const Icon = category.icon || ChartBarIcon;
                    const isExpanded = expandedCategories.has(category.id);
                    
                    return (
                      <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategoryExpansion(category.id)}
                          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 mr-3 text-indigo-600" />
                            <div className="text-left">
                              <span className="font-medium text-gray-900">{category.name}</span>
                              <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                                category.type === 'firmographic' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {category.type}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                Weight: {(category.weight * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="px-6 py-4 bg-white">
                            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                            
                            <div className="space-y-3">
                              {Object.entries(category.scoring).map(([score, details]: [string, any]) => (
                                <div key={score} className={`p-3 rounded-lg ${getScoreColor(parseInt(score))}`}>
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <span className="font-medium">{score} Points - {getScoreLabel(parseInt(score))}</span>
                                      <ul className="mt-1 text-sm space-y-1">
                                        {details.criteria.map((criterion: string, idx: number) => (
                                          <li key={idx}>• {criterion}</li>
                                        ))}
                                      </ul>
                                      {details.examples && (
                                        <p className="mt-2 text-xs italic">
                                          Example: {details.examples[0]}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tier Definitions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prospect Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {framework.interactive.rating_system.tiers.map((tier: any) => (
                    <div 
                      key={tier.name} 
                      className={`bg-gradient-to-br ${tier.color || 'from-gray-100 to-gray-200'} p-6 rounded-lg text-white`}
                    >
                      <h4 className="text-lg font-semibold mb-2">{tier.name}</h4>
                      <p className="text-sm opacity-90 mb-3">{tier.description}</p>
                      <div className="space-y-2 bg-white bg-opacity-20 rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                          <span className="opacity-90">Score Range:</span>
                          <span className="font-medium">{tier.range[0]}-{tier.range[1]}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="opacity-90">Conversion:</span>
                          <span className="font-medium">{tier.conversion_probability}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="opacity-90">Deal Size:</span>
                          <span className="font-medium">{tier.typical_deal_size}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="opacity-90">Sales Cycle:</span>
                          <span className="font-medium">{tier.sales_cycle}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-medium opacity-90 mb-1">Recommended Actions:</p>
                        <ul className="text-xs space-y-0.5">
                          {tier.actions.map((action: string, idx: number) => (
                            <li key={idx}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rate' && (
            <motion.div
              key="rate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Rate a Company</h2>
                <button
                  onClick={loadSampleCompany}
                  className="flex items-center px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Load Sample Company
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <input
                      type="text"
                      value={companyData.industry}
                      onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                    <input
                      type="text"
                      value={companyData.employees}
                      onChange={(e) => setCompanyData({...companyData, employees: e.target.value})}
                      placeholder="e.g., 250"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Recurring Revenue</label>
                    <input
                      type="text"
                      value={companyData.arr}
                      onChange={(e) => setCompanyData({...companyData, arr: e.target.value})}
                      placeholder="e.g., $22M"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YoY Growth Rate</label>
                    <input
                      type="text"
                      value={companyData.growth}
                      onChange={(e) => setCompanyData({...companyData, growth: e.target.value})}
                      placeholder="e.g., 35%"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Sales Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sales & Technology</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Cycle Length</label>
                    <input
                      type="text"
                      value={companyData.salesCycle}
                      onChange={(e) => setCompanyData({...companyData, salesCycle: e.target.value})}
                      placeholder="e.g., 3-4 months"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Team Size</label>
                    <input
                      type="text"
                      value={companyData.salesTeamSize}
                      onChange={(e) => setCompanyData({...companyData, salesTeamSize: e.target.value})}
                      placeholder="e.g., 15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CRM System</label>
                    <select
                      value={companyData.crm}
                      onChange={(e) => setCompanyData({...companyData, crm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select CRM</option>
                      <option value="Salesforce">Salesforce</option>
                      <option value="HubSpot">HubSpot</option>
                      <option value="Pipedrive">Pipedrive</option>
                      <option value="Other">Other CRM</option>
                      <option value="None">No CRM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Challenges</label>
                    <div className="space-y-2">
                      {['forecast_accuracy', 'sales_productivity', 'scaling', 'win_rates'].map(challenge => (
                        <label key={challenge} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={companyData.challenges.includes(challenge)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCompanyData({...companyData, challenges: [...companyData.challenges, challenge]});
                              } else {
                                setCompanyData({...companyData, challenges: companyData.challenges.filter(c => c !== challenge)});
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{challenge.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={companyData.evaluatingTools}
                        onChange={(e) => setCompanyData({...companyData, evaluatingTools: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">Currently evaluating sales tools</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={companyData.dataDriver}
                        onChange={(e) => setCompanyData({...companyData, dataDriver: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">Data-driven decision culture</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={calculateScores}
                  disabled={!companyData.name || !companyData.employees || !companyData.arr}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${
                    companyData.name && companyData.employees && companyData.arr
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CalculatorIcon className="h-5 w-5 mr-2" />
                  Calculate ICP Score
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && totalScore > 0 && tier && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rating Results</h2>
              
              {/* Company Summary */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{companyData.name}</h3>
                    <p className="text-gray-600">{companyData.industry} • {companyData.employees} employees • {companyData.arr} ARR</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">{totalScore}/24</div>
                    <p className="text-sm text-gray-500">Total Score</p>
                  </div>
                </div>

                {/* Tier Badge */}
                <div className={`inline-block px-6 py-3 rounded-lg bg-gradient-to-r ${tier.color} text-white`}>
                  <p className="text-lg font-semibold">{tier.name}</p>
                  <p className="text-sm opacity-90">{tier.description}</p>
                </div>
              </div>

              {/* Category Scores */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                <div className="space-y-3">
                  {framework.interactive.rating_system.categories.map((category: any) => {
                    const categoryScore = categoryScores.find(s => s.categoryId === category.id);
                    const Icon = category.icon || ChartBarIcon;
                    
                    return (
                      <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          <Icon className="h-5 w-5 mr-3 text-indigo-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-600">{categoryScore?.reasoning}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(categoryScore?.score || 0)}`}>
                            {categoryScore?.score}/4 - {getScoreLabel(categoryScore?.score || 0)}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            ({(category.weight * 100).toFixed(0)}% weight)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-indigo-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">Recommended Actions</h3>
                  <ul className="space-y-2">
                    {tier.actions.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-indigo-800">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Expected Outcomes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Conversion Probability:</span>
                      <span className="text-sm font-medium text-green-900">{tier.conversion_probability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Typical Deal Size:</span>
                      <span className="text-sm font-medium text-green-900">{tier.typical_deal_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Sales Cycle:</span>
                      <span className="text-sm font-medium text-green-900">{tier.sales_cycle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setCompanyData({
                      name: '',
                      website: '',
                      industry: '',
                      employees: '',
                      arr: '',
                      growth: '',
                      salesCycle: '',
                      salesTeamSize: '',
                      crm: '',
                      challenges: [],
                      techStack: [],
                      evaluatingTools: false,
                      dataDriver: false
                    });
                    setCategoryScores([]);
                    setTotalScore(0);
                    setTier(null);
                    setActiveTab('rate');
                  }}
                  className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Rate Another Company
                </button>
                <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Export Results
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyRatingInterface;