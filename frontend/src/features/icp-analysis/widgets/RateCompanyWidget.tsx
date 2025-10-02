import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RefreshCw, 
  Download, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Award,
  BarChart3,
  Building2,
  MapPin,
  Calendar,
  Zap,
  Brain,
  Search,
  Filter,
  Plus,
  ExternalLink,
  XCircle,
  Info,
  Clock,
  Copy
} from 'lucide-react'


interface RatingResult {
  companyName: string
  generatedAt: Date
  confidence: number
  overallScore: number
  tier: {
    id: string
    name: string
  }
  recommendation: string
  criteria: {
    criteriaId: string
    criteriaName: string
    score: number
    weight: number
    weightedScore: number
    explanation: string
    evidence?: string[]
  }[]
  insights: {
    type: string
    message: string
    actionable: boolean
  }[]
  salesActions: {
    id: string
    title: string
    description: string
    timeline: string
    priority: string
    expectedOutcome: string
    resources?: string[]
  }[]
}

interface RateCompanyWidgetProps {
  className?: string
  onExport?: (rating: RatingResult) => void
}

export default function RateCompanyWidget({ 
  className = '',
  onExport
}: RateCompanyWidgetProps) {
  const [rating, setRating] = useState<RatingResult | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set())
  
  const handleAnalyzeCompany = async () => {
    if (!companyName.trim()) {
      setError('Please enter a company name')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    
    try {
      console.log(`🔍 Starting real analysis for: ${companyName}`)
      
      // Step 1: Get company research data
      console.log('📊 Fetching company research data...')
      const researchResponse = await fetch('/api/company-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          includeLinkedIn: true,
          includeNews: true,
          includeFinancials: true
        })
      })
      
      if (!researchResponse.ok) {
        throw new Error('Failed to fetch company research data')
      }
      
      const researchData = await researchResponse.json()
      console.log('✅ Company research data received:', researchData)
      
      // Step 2: Get user's rating framework (for now, use default framework)
      const defaultFramework = {
        criteria: [
          {
            id: 'company-size',
            name: 'Company Size',
            weight: 0.25,
            description: 'Employee count and revenue alignment'
          },
          {
            id: 'industry-fit',
            name: 'Industry Fit',
            weight: 0.25,
            description: 'Industry alignment with target market'
          },
          {
            id: 'technology-stack',
            name: 'Technology Stack',
            weight: 0.20,
            description: 'Technology compatibility and integration potential'
          },
          {
            id: 'growth-stage',
            name: 'Growth Stage',
            weight: 0.15,
            description: 'Company growth stage and funding status'
          },
          {
            id: 'market-position',
            name: 'Market Position',
            weight: 0.15,
            description: 'Market position and competitive landscape'
          }
        ],
        tiers: [
          {
            id: 'tier-1',
            name: 'Perfect Match',
            minScore: 85,
            maxScore: 100,
            color: 'text-green-400',
            description: 'Ideal customer with high conversion probability'
          },
          {
            id: 'tier-2',
            name: 'Strong Match',
            minScore: 70,
            maxScore: 84,
            color: 'text-blue-400',
            description: 'Good fit with solid conversion potential'
          },
          {
            id: 'tier-3',
            name: 'Moderate Match',
            minScore: 55,
            maxScore: 69,
            color: 'text-yellow-400',
            description: 'Moderate fit with some potential'
          },
          {
            id: 'tier-4',
            name: 'Weak Match',
            minScore: 0,
            maxScore: 54,
            color: 'text-red-400',
            description: 'Limited fit, low conversion probability'
          }
        ]
      }
      
      // Step 3: Call the rating API with real data
      console.log('🤖 Calling company rating API...')
      const ratingResponse = await fetch('/api/ai/rate-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          researchData: researchData,
          framework: defaultFramework,
          customerId: 'current-user' // TODO: Get from auth context
        })
      })
      
      if (!ratingResponse.ok) {
        const errorData = await ratingResponse.json()
        throw new Error(errorData.error || 'Failed to generate company rating')
      }
      
      const ratingResult = await ratingResponse.json()
      
      if (!ratingResult.success) {
        throw new Error(ratingResult.error || 'Rating generation failed')
      }
      
      // Step 4: Transform API response to widget format
      const rating: RatingResult = {
        companyName: companyName.trim(),
        generatedAt: new Date(),
        confidence: ratingResult.data.confidence,
        overallScore: ratingResult.data.overallScore,
        tier: ratingResult.data.tier,
        recommendation: ratingResult.data.recommendation,
        criteria: ratingResult.data.criteria,
        insights: ratingResult.data.insights,
        salesActions: ratingResult.data.salesActions
      }
      
      setRating(rating)
      console.log('✅ Company analysis completed successfully:', rating)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze company. Please try again.'
      setError(errorMessage)
      console.error('❌ Company analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExport = async () => {
    if (!rating) return
    
    try {
      const response = await fetch('/api/export/company-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${rating.companyName}-rating-analysis.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleRefresh = () => {
    setRating(null)
    setError(null)
    setExpandedCriteria(new Set())
  }

  const toggleCriteria = (criteriaId: string) => {
    const newExpanded = new Set(expandedCriteria)
    if (newExpanded.has(criteriaId)) {
      newExpanded.delete(criteriaId)
    } else {
      newExpanded.add(criteriaId)
    }
    setExpandedCriteria(newExpanded)
  }

  const getTierColorClass = (tierId: string) => {
    switch (tierId) {
      case 'tier-1': return 'text-green-400'
      case 'tier-2': return 'text-blue-400'
      case 'tier-3': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return { icon: CheckCircle, color: 'text-green-400' }
      case 'negative':
        return { icon: AlertTriangle, color: 'text-red-400' }
      case 'neutral':
        return { icon: Info, color: 'text-blue-400' }
      default:
        return { icon: Info, color: 'text-gray-400' }
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log('Copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className={`bg-background-secondary border border-border-standard rounded-xl overflow-hidden ${className}`}>
      <div className="bg-background-tertiary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Rate A Company</h2>
            <p className="text-text-muted text-sm">
              Score companies against your ICP rating framework
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRating(null)}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              title="Clear results"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {rating && (
              <button
                onClick={() => onExport?.(rating)}
                className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
                title="Export rating"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="company-name" className="block text-sm font-medium text-text-primary mb-2">
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name (e.g., TechCorp Solutions)"
                className="w-full px-4 py-3 bg-background-tertiary border border-border-standard rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAnalyzeCompany}
                disabled={isAnalyzing || !companyName.trim()}
                className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Researching & Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Analyze Company
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-4 p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-brand-primary animate-spin" />
                <div>
                  <h4 className="text-sm font-semibold text-brand-primary">
                    Researching Company & Generating ICP Rating
                  </h4>
                  <p className="text-xs text-text-muted mt-1">
                    This may take 30-60 seconds as we gather real-time data and analyze against your ICP criteria
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {rating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              
              <div className="bg-background-tertiary rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {rating.companyName} - ICP Rating
                    </h3>
                    <p className="text-text-muted text-sm">
                      Generated on {rating.generatedAt.toLocaleDateString()} • {rating.confidence}% confidence
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getTierColorClass(rating.tier.id)}`}>
                      {rating.overallScore}/100
                    </div>
                    <div className={`text-sm font-medium ${getTierColorClass(rating.tier.id)}`}>
                      {rating.tier.name}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-text-muted mb-2">
                    <span>Overall Score</span>
                    <span>{rating.overallScore}/100</span>
                  </div>
                  <div className="w-full bg-background-primary rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${rating.overallScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-brand-primary/10 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-brand-primary mb-2">
                    💡 Recommendation
                  </h4>
                  <p className="text-text-muted text-sm">
                    {rating.recommendation}
                  </p>
                </div>
              </div>

              <div className="bg-background-tertiary rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Criteria Breakdown
                </h3>
                <div className="space-y-3">
                  {rating.criteria.map((criteria) => {
                    const isExpanded = expandedCriteria.has(criteria.criteriaId);
                    const IconComponent = isExpanded ? XCircle : Info;
                    
                    return (
                      <div key={criteria.criteriaId} className="border border-border-standard rounded-lg">
                        <button
                          onClick={() => toggleCriteria(criteria.criteriaId)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-brand-primary" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-text-primary">
                                {criteria.criteriaName}
                              </div>
                              <div className="text-sm text-text-muted">
                                Score: {criteria.score}/10 • Weight: {(criteria.weight * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-text-primary">
                                {criteria.score}/10
                              </div>
                              <div className="text-xs text-text-muted">
                                {criteria.weightedScore.toFixed(1)} pts
                              </div>
                            </div>
                            <IconComponent className="w-4 h-4 text-text-muted" />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-border-standard">
                                <div className="pt-4 space-y-3">
                                  <div>
                                    <h5 className="text-sm font-medium text-text-primary mb-2">
                                      Explanation
                                    </h5>
                                    <p className="text-sm text-text-muted">
                                      {criteria.explanation}
                                    </p>
                                  </div>
                                  
                                  {criteria.evidence && criteria.evidence.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium text-text-primary mb-2">
                                        Evidence
                                      </h5>
                                      <ul className="text-sm text-text-muted space-y-1">
                                        {criteria.evidence.map((evidence, index) => (
                                          <li key={index} className="flex items-start gap-2">
                                            <span className="text-brand-primary mt-1">•</span>
                                            {evidence}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-background-tertiary rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Key Insights
                </h3>
                <div className="space-y-3">
                  {rating.insights.map((insight, index) => {
                    const { icon: IconComponent, color } = getInsightIcon(insight.type);
                    
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-background-primary rounded-lg">
                        <IconComponent className={`w-5 h-5 ${color} mt-0.5`} />
                        <div className="flex-1">
                          <p className="text-sm text-text-primary">
                            {insight.message}
                          </p>
                          {insight.actionable && (
                            <span className="inline-block mt-1 text-xs text-brand-primary">
                              Actionable
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-background-tertiary rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Recommended Sales Actions
                </h3>
                <div className="space-y-4">
                  {rating.salesActions.map((action) => (
                    <div key={action.id} className="border border-border-standard rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-brand-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">
                              {action.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-text-muted">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {action.timeline}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                action.priority === 'high'
                                  ? 'bg-red-900/30 text-red-400'
                                  : action.priority === 'medium'
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-blue-900/30 text-blue-400'
                              }`}>
                                {action.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(action.description)}
                          className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
                          title="Copy action details"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-text-muted mb-3">
                        {action.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-xs font-medium text-text-primary mb-1">
                            Expected Outcome
                          </h5>
                          <p className="text-sm text-text-muted">
                            {action.expectedOutcome}
                          </p>
                        </div>
                        
                        {action.resources && action.resources.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-text-primary mb-1">
                              Resources Needed
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {action.resources.map((resource, index) => (
                                <span key={index} className="px-2 py-1 bg-background-primary text-xs text-text-muted rounded">
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 p-4 bg-brand-primary/10 rounded-lg">
          <h4 className="text-sm font-semibold text-brand-primary mb-2">
            💡 Pro Tip
          </h4>
          <p className="text-xs text-text-muted">
            Use this rating to prioritize your sales efforts and tailor your approach based on the company's specific strengths and weaknesses. Focus on Tier 1 and Tier 2 companies for maximum conversion rates.
          </p>
        </div>
      </div>
    </div>
  );
}
