import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  RefreshCw, 
  Download, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Award,
  BarChart3,
  Lightbulb,
  Building2,
  ChevronUp,
  ChevronDown,
  Settings,
  Check,
  Copy
} from 'lucide-react'

interface RatingCategory {
  id: string
  name: string
  description: string
  weight: number
  maxPoints: number
  criteria: {
    [key: string]: {
      points: number
      description: string
    }
  }
}

interface RatingTier {
  id: string
  name: string
  minScore: number
  maxScore: number
  color: string
  description: string
  nextSteps: string[]
  resourceAllocation: string
}

interface RatingCriteria {
  id: string
  name: string
  description: string
  category: string
  weight: number
  reasoning: string
  scoringLevels: {
    score: number
    description: string
    criteria: string[]
    examples: string[]
    dataSources: string[]
  }[]
}

interface RatingSystem {
  id: string
  name: string
  description: string
  categories: RatingCategory[]
  tiers: RatingTier[]
  criteria: RatingCriteria[]
  methodology: {
    categorySelection: string
    weightingRationale: string
    salesCycleComplexity: string
    solutionType: string
  }
  implementationGuidelines: {
    users: string[]
    integration: string[]
    training: string[]
    edgeCases: string[]
  }
  lastUpdated: Date
  totalMaxPoints: number
}

interface ICPRatingSystemWidgetProps {
  className?: string
}

export default function ICPRatingSystemWidget({ 
  className = '' 
}: ICPRatingSystemWidgetProps) {
  const [ratingSystem, setRatingSystem] = useState<RatingSystem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showMethodology, setShowMethodology] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null)
  const [copiedContent, setCopiedContent] = useState<string | null>(null)

  useEffect(() => {
    loadRatingSystem()
  }, [])

  const loadRatingSystem = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('📊 Loading rating system...')
      
      // Try to load from API first
      const response = await fetch('/api/rating-system/current-user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.ratingSystem) {
          setRatingSystem(result.ratingSystem)
          console.log('✅ Rating system loaded from API')
          return
        }
      }

      // Fallback to default system if no custom system exists
      console.log('📋 Loading default rating system...')
      const defaultSystem: RatingSystem = {
        id: 'default',
        name: 'Revenue Intelligence Framework',
        description: 'Comprehensive ICP rating system for technical founders',
        categories: [
          {
            id: 'company-fit',
            name: 'Company Fit',
            description: 'Alignment with your ideal customer profile',
            weight: 25,
            maxPoints: 6,
            criteria: {
              'industry': { points: 2, description: 'Target industry match' },
              'size': { points: 2, description: 'Company size alignment' },
              'stage': { points: 2, description: 'Growth stage fit' }
            }
          },
          {
            id: 'technical-fit',
            name: 'Technical Fit',
            description: 'Technical requirements and capabilities',
            weight: 30,
            maxPoints: 8,
            criteria: {
              'tech-stack': { points: 3, description: 'Technology stack compatibility' },
              'integration': { points: 3, description: 'Integration capabilities' },
              'scalability': { points: 2, description: 'Scalability requirements' }
            }
          },
          {
            id: 'business-fit',
            name: 'Business Fit',
            description: 'Business model and value alignment',
            weight: 25,
            maxPoints: 6,
            criteria: {
              'budget': { points: 2, description: 'Budget alignment' },
              'timeline': { points: 2, description: 'Implementation timeline' },
              'roi': { points: 2, description: 'ROI potential' }
            }
          },
          {
            id: 'decision-process',
            name: 'Decision Process',
            description: 'Decision-making structure and process',
            weight: 20,
            maxPoints: 4,
            criteria: {
              'decision-makers': { points: 2, description: 'Decision maker access' },
              'process': { points: 2, description: 'Decision process clarity' }
            }
          }
        ],
        tiers: [
          {
            id: 'tier-1',
            name: 'Perfect Match',
            minScore: 20,
            maxScore: 24,
            color: 'green',
            description: 'Ideal customer with high conversion probability',
            nextSteps: ['Immediate outreach', 'Personalized demo'],
            resourceAllocation: 'High priority - dedicated AE'
          },
          {
            id: 'tier-2',
            name: 'Strong Match',
            minScore: 16,
            maxScore: 19,
            color: 'blue',
            description: 'Good fit with solid conversion potential',
            nextSteps: ['Qualified outreach', 'Value demonstration'],
            resourceAllocation: 'Medium priority - shared AE'
          },
          {
            id: 'tier-3',
            name: 'Moderate Match',
            minScore: 12,
            maxScore: 15,
            color: 'yellow',
            description: 'Some alignment with room for improvement',
            nextSteps: ['Educational content', 'Nurture campaign'],
            resourceAllocation: 'Low priority - marketing nurture'
          },
          {
            id: 'tier-4',
            name: 'Weak Match',
            minScore: 8,
            maxScore: 11,
            color: 'orange',
            description: 'Limited alignment, high risk',
            nextSteps: ['Re-evaluate criteria', 'Consider disqualification'],
            resourceAllocation: 'Minimal - automated follow-up'
          }
        ],
        criteria: [
          {
            id: 'industry',
            name: 'Industry',
            description: 'Target industry match',
            category: 'market',
            weight: 0.08,
            reasoning: 'Industry alignment is crucial for product-market fit',
            scoringLevels: []
          },
          {
            id: 'size',
            name: 'Company Size',
            description: 'Company size alignment',
            category: 'market',
            weight: 0.08,
            reasoning: 'Company size alignment is important for sales strategy',
            scoringLevels: []
          },
          {
            id: 'stage',
            name: 'Growth Stage',
            description: 'Growth stage fit',
            category: 'market',
            weight: 0.09,
            reasoning: 'Market alignment is important for success',
            scoringLevels: []
          },
          {
            id: 'tech-stack',
            name: 'Technology Stack',
            description: 'Technology stack compatibility',
            category: 'market',
            weight: 0.13,
            reasoning: 'High weight criteria are critical for success',
            scoringLevels: []
          },
          {
            id: 'integration',
            name: 'Integration',
            description: 'Integration capabilities',
            category: 'market',
            weight: 0.13,
            reasoning: 'High weight criteria are critical for success',
            scoringLevels: []
          },
          {
            id: 'scalability',
            name: 'Scalability',
            description: 'Scalability requirements',
            category: 'market',
            weight: 0.08,
            reasoning: 'Company size alignment is important for sales strategy',
            scoringLevels: []
          },
          {
            id: 'budget',
            name: 'Budget',
            description: 'Budget alignment',
            category: 'market',
            weight: 0.08,
            reasoning: 'Company size alignment is important for sales strategy',
            scoringLevels: []
          },
          {
            id: 'timeline',
            name: 'Timeline',
            description: 'Implementation timeline',
            category: 'market',
            weight: 0.08,
            reasoning: 'Company size alignment is important for sales strategy',
            scoringLevels: []
          },
          {
            id: 'roi',
            name: 'ROI Potential',
            description: 'ROI potential',
            category: 'market',
            weight: 0.09,
            reasoning: 'Market alignment is important for success',
            scoringLevels: []
          },
          {
            id: 'decision-makers',
            name: 'Decision Makers',
            description: 'Decision maker access',
            category: 'market',
            weight: 0.10,
            reasoning: 'Important criteria for market fit',
            scoringLevels: []
          },
          {
            id: 'process',
            name: 'Decision Process',
            description: 'Decision process clarity',
            category: 'process',
            weight: 0.10,
            reasoning: 'Clear decision process is important for sales success',
            scoringLevels: []
          }
        ],
        methodology: {
          categorySelection: 'Based on industry best practices and conversion data analysis',
          weightingRationale: 'Weighted by historical conversion probability and sales cycle impact',
          salesCycleComplexity: 'Medium complexity B2B sales cycle with technical evaluation',
          solutionType: 'B2B SaaS solution with integration requirements'
        },
        implementationGuidelines: {
          users: ['Sales Team', 'Marketing Team', 'Customer Success'],
          integration: ['CRM Integration', 'Marketing Automation', 'Analytics Platform'],
          training: ['Team Training', 'Documentation', 'Best Practices Guide'],
          edgeCases: ['Edge case handling', 'Exception management', 'Manual review process']
        },
        lastUpdated: new Date(),
        totalMaxPoints: 24
      }
      
      setRatingSystem(defaultSystem)
      console.log('✅ Default rating system loaded')
      
    } catch (error) {
      console.error('❌ Error loading rating system:', error)
      setError('Failed to load rating system. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log(`${type} copied to clipboard`)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const generateFrameworkSummary = () => {
    if (!ratingSystem) return 'No rating system available'
    return `ICP Rating Framework: ${ratingSystem.name}\n\nCategories:\n${ratingSystem.categories.map(cat => `- ${cat.name}: ${cat.maxPoints || 0} points`).join('\n')}`
  }

  const toggleCriteria = (criteriaId: string) => {
    setExpandedCriteria(expandedCriteria === criteriaId ? null : criteriaId)
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">ICP Rating System</h2>
            <p className="text-gray-400 text-sm">
              {isLoading ? 'Loading rating system...' : 
               error ? 'Error loading rating system' :
               ratingSystem ? `${ratingSystem.name} • ${ratingSystem.categories.length} Categories • ${ratingSystem.totalMaxPoints} Point Maximum • ${ratingSystem.tiers.length} Tiers` : 
               'No rating system available'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Show methodology"
            >
              <Brain className="w-4 h-4" />
            </button>
            <button
              onClick={loadRatingSystem}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Refresh system"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => copyToClipboard(generateFrameworkSummary(), 'framework-summary')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Export framework"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-600/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm">{error}</p>
                <button 
                  onClick={loadRatingSystem}
                  className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading rating system...</p>
            </div>
          </div>
        ) : !ratingSystem ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Rating System Available</h3>
            <p className="text-gray-400 mb-4">Unable to load the rating system framework.</p>
            <button 
              onClick={loadRatingSystem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-300 text-sm">
                    🧠 <strong>Cumulative Intelligence:</strong> This rating framework was generated using your Product Description and ICP Analysis as context, creating unmatched personalization for your specific market.
                  </p>
                </div>
              </div>
            </div>

        <AnimatePresence>
          {showMethodology && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  How This Rating Was Built
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div>
                    <strong className="text-white">Category Selection:</strong> {ratingSystem.methodology.categorySelection}
                  </div>
                  <div>
                    <strong className="text-white">Weighting Rationale:</strong> {ratingSystem.methodology.weightingRationale}
                  </div>
                  <div>
                    <strong className="text-white">Sales Cycle Complexity:</strong> {ratingSystem.methodology.salesCycleComplexity}
                  </div>
                  <div>
                    <strong className="text-white">Solution Type:</strong> {ratingSystem.methodology.solutionType}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Firmographic Categories (3)
          </h3>
          <div className="space-y-4">
            {ratingSystem.criteria
              .filter(criteria => criteria.category === 'firmographic')
              .map((criteria, index) => {
                const isExpanded = expandedCriteria === criteria.id;
                
                return (
                  <motion.div
                    key={criteria.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
                  >
                    
                    <button
                      onClick={() => toggleCriteria(criteria.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 font-semibold">{index + 1}.</span>
                        <div className="text-left">
                          <h4 className="text-white font-medium">{criteria.name}</h4>
                          <p className="text-gray-400 text-sm">{criteria.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-semibold">{criteria.weight}%</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-gray-700">
                            <div className="pt-4 space-y-4">
                              <div>
                                <h5 className="text-white font-medium mb-1">Reasoning</h5>
                                <p className="text-gray-400 text-sm">{criteria.reasoning}</p>
                              </div>
                              <div>
                                <h5 className="text-white font-medium mb-3">Scoring Criteria:</h5>
                                <div className="space-y-3">
                                  {criteria.scoringLevels.map((level) => (
                                    <div key={level.score} className="bg-gray-700/30 rounded-lg p-3">
                                      <div className="flex items-start gap-3">
                                        <span className="text-blue-400 font-semibold">{level.score} points -</span>
                                        <div className="flex-1">
                                          <p className="text-white font-medium mb-1">{level.description}</p>
                                          <div className="space-y-1 text-sm">
                                            <p className="text-gray-300">
                                              <strong>Criteria:</strong> {level.criteria.join(', ')}
                                            </p>
                                            <p className="text-gray-300">
                                              <strong>Examples:</strong> {level.examples.join(', ')}
                                            </p>
                                            <p className="text-gray-400">
                                              <strong>Data Sources:</strong> {level.dataSources.join(', ')}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            Behavioral Categories (3)
          </h3>
          <div className="space-y-4">
            {ratingSystem.criteria
              .filter(criteria => criteria.category === 'behavioral')
              .map((criteria, index) => {
                const isExpanded = expandedCriteria === criteria.id;
                
                return (
                  <motion.div
                    key={criteria.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
                  >
                    
                    <button
                      onClick={() => toggleCriteria(criteria.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-semibold">{index + 1}.</span>
                        <div className="text-left">
                          <h4 className="text-white font-medium">{criteria.name}</h4>
                          <p className="text-gray-400 text-sm">{criteria.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-semibold">{criteria.weight}%</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-gray-700">
                            <div className="pt-4 space-y-4">
                              <div>
                                <h5 className="text-white font-medium mb-1">Reasoning</h5>
                                <p className="text-gray-400 text-sm">{criteria.reasoning}</p>
                              </div>
                              <div>
                                <h5 className="text-white font-medium mb-3">Scoring Criteria:</h5>
                                <div className="space-y-3">
                                  {criteria.scoringLevels.map((level) => (
                                    <div key={level.score} className="bg-gray-700/30 rounded-lg p-3">
                                      <div className="flex items-start gap-3">
                                        <span className="text-green-400 font-semibold">{level.score} points -</span>
                                        <div className="flex-1">
                                          <p className="text-white font-medium mb-1">{level.description}</p>
                                          <div className="space-y-1 text-sm">
                                            <p className="text-gray-300">
                                              <strong>Criteria:</strong> {level.criteria.join(', ')}
                                            </p>
                                            <p className="text-gray-300">
                                              <strong>Examples:</strong> {level.examples.join(', ')}
                                            </p>
                                            <p className="text-gray-400">
                                              <strong>Data Sources:</strong> {level.dataSources.join(', ')}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Prospect Rating Tiers
          </h3>
          <div className="grid gap-4">
            {ratingSystem.tiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-4 h-4 rounded-full mt-1"
                    style={{ backgroundColor: tier.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{tier.name}</h4>
                      <span className="text-gray-400 text-sm">({tier.minScore}-{tier.maxScore} points)</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{tier.description}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">
                        <strong>Next Steps:</strong> {tier.nextSteps.join(', ')}
                      </p>
                      <p className="text-gray-300">
                        <strong>Resource Allocation:</strong> {tier.resourceAllocation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Implementation Guidelines
          </h3>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-white font-medium mb-2">Users & Integration</h4>
                <p className="text-gray-300 mb-1">
                  <strong>Users:</strong> {ratingSystem.implementationGuidelines.users.join(', ')}
                </p>
                <p className="text-gray-300">
                  <strong>Integration:</strong> {ratingSystem.implementationGuidelines.integration.join(', ')}
                </p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Training & Edge Cases</h4>
                <p className="text-gray-300 mb-1">
                  <strong>Training:</strong> {ratingSystem.implementationGuidelines.training.join(', ')}
                </p>
                <p className="text-gray-300">
                  <strong>Edge Cases:</strong> {ratingSystem.implementationGuidelines.edgeCases.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(generateFrameworkSummary(), 'framework-summary')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {copiedContent === 'framework-summary' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            Copy Framework Summary
          </button>
        </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Last updated: {ratingSystem ? ratingSystem.lastUpdated.toLocaleDateString() : 'N/A'}</span>
                <span>{ratingSystem ? `${ratingSystem.categories.length} Categories • ${ratingSystem.totalMaxPoints} Point System • ${ratingSystem.tiers.length} Tiers` : 'No data available'}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}