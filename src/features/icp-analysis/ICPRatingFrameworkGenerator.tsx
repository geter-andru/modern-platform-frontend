'use client';

import React, { useState, useEffect } from 'react';
import claudeAIService from '@/app/lib/services/claudeAIService';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface ICPRatingFrameworkGeneratorProps {
  onFrameworkGenerated?: (framework: any) => void;
  existingICP?: any;
  existingPersonas?: any;
}

const ICPRatingFrameworkGenerator: React.FC<ICPRatingFrameworkGeneratorProps> = ({ 
  onFrameworkGenerated,
  existingICP,
  existingPersonas
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFramework, setGeneratedFramework] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'framework' | 'implementation'>('framework');
  const [hasExistingData, setHasExistingData] = useState(false);

  // Check for existing data on mount and auto-generate
  useEffect(() => {
    if (existingICP && existingPersonas) {
      setHasExistingData(true);
      setActiveTab('framework');
      
      // Auto-generate framework from existing data
      if (!generatedFramework) {
        generateFrameworkFromExistingData();
      }
    } else {
      setHasExistingData(false);
      setActiveTab('input');
    }
  }, [existingICP, existingPersonas, generatedFramework]);

  const generateFrameworkFromExistingData = async () => {
    if (!existingICP || !existingPersonas) {
      console.error('No existing ICP or persona data available');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use Claude AI to generate framework from existing ICP and personas
      const frameworkData = await claudeAIService.generateRatingFrameworkFromICP(
        existingICP.content.text,
        existingPersonas.content.text
      );
      
      // Use the Claude AI generated framework data
      const framework = frameworkData;
      
      setGeneratedFramework(framework);
      localStorage.setItem('icpRatingFramework', JSON.stringify(framework));
      
      if (onFrameworkGenerated) {
        onFrameworkGenerated(framework);
      }
      
    } catch (error) {
      console.error('Claude AI framework generation failed:', error);
      // Fallback to template-based generation
      const framework = {
        content: {
          methodology: generateMethodology(),
          reasoning: generateReasoning(),
          categories: generateCategories(),
        implementation: generateImplementation(),
        calibration: generateCalibration()
      },
      interactive: {
        rating_system: {
          categories: [
            {
              id: "company_size",
              name: "Company Size & Growth",
              type: "firmographic",
              weight: 0.20,
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
                  criteria: ["<20 or >1000 employees", "<$1M or >$100M ARR"],
                  examples: ["Too small or enterprise-level"]
                }
              }
            },
            {
              id: "sales_complexity",
              name: "Sales Process Complexity",
              type: "firmographic",
              weight: 0.15,
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
          ],
          calculation: {
            total_possible: 24,
            weighting: {
              firmographic: 0.50,
              behavioral: 0.50
            },
            formula: "sum(category_score * category_weight)"
          }
        }
      }
    };
    
    setGeneratedFramework(framework);
    setActiveTab('framework');
    setIsGenerating(false);
    
      if (onFrameworkGenerated) {
        onFrameworkGenerated(framework);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMethodology = () => {
    return `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">Scoring Methodology</h3>
        <p class="text-gray-600">
          Our 6-category framework evaluates prospects against your ideal customer profile using both 
          firmographic (company characteristics) and behavioral (buying signals) indicators.
        </p>
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-900 mb-2">Balanced Approach</h4>
          <p class="text-blue-800">
            We use a 50/50 split between firmographic and behavioral factors because your ICP 
            indicates both company fit AND buying readiness are equally important for success.
          </p>
        </div>
      </div>
    `;
  };

  const generateReasoning = () => {
    return `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">How This Rating Was Built</h3>
        <div class="bg-green-50 p-4 rounded-lg mb-4">
          <h4 class="font-semibold text-green-900 mb-2">Category Selection Logic</h4>
          <ul class="list-disc pl-5 space-y-2 text-green-800">
            <li><strong>Company Size & Growth:</strong> Core indicator from your ICP - targets high-growth mid-market</li>
            <li><strong>Sales Complexity:</strong> Complex cycles with multiple stakeholders indicate need for your solution</li>
            <li><strong>Tech Stack:</strong> CRM usage shows integration readiness and data maturity</li>
            <li><strong>Pain Intensity:</strong> Sales productivity struggles create urgency to buy</li>
            <li><strong>Buying Readiness:</strong> Active evaluation signals predict conversion</li>
            <li><strong>Innovation Culture:</strong> Openness to AI/data solutions indicates fit</li>
          </ul>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="font-semibold text-purple-900 mb-2">Weighting Rationale</h4>
          <p class="text-purple-800">
            Based on your ICP emphasis on both company characteristics (size, growth, complexity) 
            and behavioral indicators (struggles, data-driven culture), we weighted firmographic 
            and behavioral factors equally at 50% each. This ensures you identify companies that 
            both fit your solution AND are ready to buy.
          </p>
        </div>
      </div>
    `;
  };

  const generateCategories = () => {
    return `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">Evaluation Categories</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-indigo-600 mb-2">Firmographic (50%)</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• Company Size & Growth (20%)</li>
              <li>• Sales Process Complexity (15%)</li>
              <li>• Technology Stack Fit (15%)</li>
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-purple-600 mb-2">Behavioral (50%)</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• Pain Point Intensity (20%)</li>
              <li>• Buying Readiness Signals (15%)</li>
              <li>• Innovation & Data Culture (15%)</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  };

  const generateImplementation = () => {
    return `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">Implementation Guide</h3>
        <ul class="list-disc pl-5 space-y-2 text-gray-600">
          <li>Sales team scores prospects during discovery calls using the 6 categories</li>
          <li>Marketing pre-scores inbound leads based on available firmographic data</li>
          <li>SDRs use tier assignments to prioritize outreach sequences</li>
          <li>AEs leverage scores for deal prioritization and resource allocation</li>
          <li>Leadership reviews tier distribution quarterly for pipeline health</li>
        </ul>
      </div>
    `;
  };

  const generateCalibration = () => {
    return `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">System Calibration</h3>
        <p class="text-gray-600">
          Test your scoring system by rating your top 10 existing customers and bottom 10 lost deals. 
          Adjust category weights if successful customers consistently score lower than expected.
        </p>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <h4 class="font-semibold text-yellow-900 mb-2">Quarterly Review Process</h4>
          <ol class="list-decimal pl-5 space-y-1 text-yellow-800">
            <li>Analyze win/loss rates by tier</li>
            <li>Review average deal size per tier</li>
            <li>Adjust scoring thresholds if needed</li>
            <li>Update ICP based on new learnings</li>
          </ol>
        </div>
      </div>
    `;
  };

  const loadSampleData = () => {
    setProductDescription(sampleProduct);
    setIcpDescription(sampleICP);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ICP Rating Framework Generator
          </h1>
          <p className="text-gray-600">
            Generate a comprehensive scoring system to rate and prioritize prospects based on your ideal customer profile
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {!hasExistingData && (
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'input' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 inline mr-2" />
              Input Details
            </button>
          )}
          <button
            onClick={() => setActiveTab('framework')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'framework' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            } ${!generatedFramework ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!generatedFramework}
          >
            <ChartBarIcon className="h-5 w-5 inline mr-2" />
            Scoring Framework
          </button>
          <button
            onClick={() => setActiveTab('implementation')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'implementation' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            } ${!generatedFramework ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!generatedFramework}
          >
            <CheckCircleIcon className="h-5 w-5 inline mr-2" />
            Implementation
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Sample Data Button */}
                <div className="flex justify-end">
                  <button
                    onClick={loadSampleData}
                    className="flex items-center px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <LightBulbIcon className="h-4 w-4 mr-2" />
                    Load Sample Data
                  </button>
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product, its key features, and the problems it solves..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* ICP Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ideal Customer Profile (ICP)
                  </label>
                  <textarea
                    value={icpDescription}
                    onChange={(e) => setIcpDescription(e.target.value)}
                    placeholder="Describe your ideal customer's characteristics, size, industry, challenges, and buying behaviors..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={generateFramework}
                    disabled={!productDescription || !icpDescription || isGenerating}
                    className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${
                      productDescription && icpDescription && !isGenerating
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        Generating Framework...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        Generate ICP Scoring Framework
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'framework' && generatedFramework && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header - Show data source */}
              {hasExistingData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-800 font-medium">
                      Framework Generated from Your ICP Analysis & Buyer Personas
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    This scoring framework was intelligently created using Claude AI based on your existing customer intelligence data.
                  </p>
                </div>
              )}
              {/* Methodology */}
              <div dangerouslySetInnerHTML={{ __html: generatedFramework.content.methodology }} />
              
              {/* Reasoning */}
              <div dangerouslySetInnerHTML={{ __html: generatedFramework.content.reasoning }} />
              
              {/* Categories */}
              <div dangerouslySetInnerHTML={{ __html: generatedFramework.content.categories }} />

              {/* Scoring Table */}
              <div className="overflow-x-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Scoring Criteria</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        4 Points (Perfect)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        3 Points (Strong)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generatedFramework.interactive.rating_system.categories.map((category: any) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(category.weight * 100).toFixed(0)}%
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {category.scoring["4"].criteria[0]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {category.scoring["3"].criteria[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tier Definitions */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Prospect Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedFramework.interactive.rating_system.tiers.map((tier: any) => (
                    <div key={tier.name} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{tier.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Score Range:</span>
                          <span className="font-medium">{tier.range[0]}-{tier.range[1]}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Conversion:</span>
                          <span className="font-medium text-green-600">{tier.conversion_probability}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Deal Size:</span>
                          <span className="font-medium">{tier.typical_deal_size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'framework' && isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <div className="mb-6">
                <SparklesIcon className="h-16 w-16 text-indigo-500 mx-auto animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {hasExistingData 
                  ? "Generating Framework from Your ICP Data..."
                  : "Generating Framework..."
                }
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {hasExistingData 
                  ? "Claude AI is analyzing your ICP analysis and buyer personas to create a customized scoring framework."
                  : "Creating your comprehensive prospect scoring system..."
                }
              </p>
            </motion.div>
          )}

          {activeTab === 'implementation' && generatedFramework && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Implementation Guide */}
              <div dangerouslySetInnerHTML={{ __html: generatedFramework.content.implementation }} />
              
              {/* Calibration */}
              <div dangerouslySetInnerHTML={{ __html: generatedFramework.content.calibration }} />

              {/* Next Steps */}
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Next Steps</h3>
                <ol className="list-decimal pl-5 space-y-2 text-indigo-800">
                  <li>Test the framework with your existing customer base</li>
                  <li>Train your sales team on the scoring criteria</li>
                  <li>Integrate scoring into your CRM workflows</li>
                  <li>Set up reporting dashboards to track tier performance</li>
                  <li>Schedule quarterly reviews to refine the system</li>
                </ol>
              </div>

              {/* Export Options */}
              <div className="flex justify-center space-x-4 pt-6">
                <button className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Export as PDF
                </button>
                <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                  Start Rating Companies
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ICPRatingFrameworkGenerator;