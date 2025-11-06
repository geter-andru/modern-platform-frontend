import React, { useState } from 'react'
import { ProgressRing } from '../../../shared/components/ui/ProgressRing'
import Tooltip from '../../../shared/components/ui/Tooltip'
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
import { useCompanyRatingCache } from '@/app/lib/hooks/cache'
import type { CompanyRating } from '@/app/lib/hooks/cache'


// Use CompanyRating type from cache hook
type RatingResult = CompanyRating

interface RateCompanyWidgetProps {
  className?: string
  onExport?: (rating: RatingResult) => void
  userId?: string
}

export default function RateCompanyWidget({ 
  className = '',
  onExport,
  userId
}: RateCompanyWidgetProps) {
  const [companyName, setCompanyName] = useState('')
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set())
  
  // Use cache hook instead of manual state management
  const {
    ratings,
    currentRating,
    isLoadingRatings,
    isAnalyzingCompany,
    hasError,
    ratingsError,
    analysisError,
    analyzeCompany,
    refetchRatings
  } = useCompanyRatingCache({ 
    customerId: userId, 
    enabled: !!userId 
  })
  
  // Use currentRating as the main rating for display
  const rating = currentRating
  
  const handleAnalyzeCompany = async () => {
    if (!companyName.trim()) {
      console.error('Please enter a company name')
      return
    }

    try {
      console.log(`🔍 Starting real analysis for: ${companyName}`)
      
      // Use cache hook instead of manual state management
      await analyzeCompany(companyName.trim(), userId)
      
      console.log('✅ Company analysis initiated successfully')
      
    } catch (error) {
      console.error('❌ Company analysis failed:', error)
      // Error handling is now managed by the cache hook
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
    refetchRatings()
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
      case 'tier-2': return 'text-blue-500'
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
        return { icon: Info, color: 'text-blue-500' }
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
    <div className={`bg-[#1a2332] border border-blue-800/30 rounded-xl overflow-hidden ${className}`}>
      <div className="bg-gray-800/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Rate A Company</h2>
              {rating && (
                <Tooltip
                  content={
                    <div className="max-w-xs">
                      <p className="text-sm text-white">
                        Prioritize Tier 1 (20-24 points) and Tier 2 (16-19 points) companies for immediate outreach. Reference specific criteria scores below 7/10 to craft targeted messaging addressing those gaps. Export this rating to share with your sales team or add to your CRM.
                      </p>
                    </div>
                  }
                  placement="bottom"
                  trigger="hover"
                >
                  <span className="inline-flex items-center">
                    <Info className="w-4 h-4 text-gray-500 cursor-help" />
                  </span>
                </Tooltip>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              Score companies against your ICP rating framework
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Clear the current rating by refetching ratings
                refetchRatings();
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
              title="Clear results"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {rating && (
              <button
                onClick={() => onExport?.(rating)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
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
              <label htmlFor="company-name" className="block text-sm font-medium text-white mb-2">
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Stripe, GitHub, Vercel, Datadog"
                className="w-full px-4 py-3 bg-gray-800 border border-blue-800/30 rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAnalyzeCompany}
                disabled={isAnalyzingCompany || !companyName.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isAnalyzingCompany ? (
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
          
          {hasError && (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{ratingsError?.message || analysisError?.message || 'An error occurred'}</p>
            </div>
          )}

          {isAnalyzingCompany && (
            <div className="mt-4 p-4 bg-blue-600/10 border border-brand-primary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-500">
                    Researching Company & Generating ICP Rating
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    This may take 30-60 seconds as we gather real-time data and analyze against your ICP criteria
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {rating && (
          <div className="space-y-6">
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {rating.companyName} - ICP Rating
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Generated on {new Date(rating.generatedAt).toLocaleDateString()} • {rating.confidence}% confidence
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Progress Ring for Overall Score - Makes sense here for comparing performance */}
                    <div className="flex flex-col items-center">
                      <ProgressRing
                        value={rating.overallScore}
                        size={80}
                        strokeWidth={6}
                        colorScheme="auto"
                        showLabel={true}
                        className="flex-shrink-0"
                      />
                      <div className={`text-sm font-medium mt-2 ${getTierColorClass(rating.tier.id)}`}>
                        {rating.tier.name}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Overall Score</span>
                    <span>{rating.overallScore}/100</span>
                  </div>
                  <div className="w-full bg-black rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${rating.overallScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-blue-600/10 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-500 mb-2">
                    💡 Recommendation
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {rating.recommendation}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Criteria Breakdown
                </h3>
                <div className="space-y-3">
                  {rating.criteria.map((criteria) => {
                    const isExpanded = expandedCriteria.has(criteria.criteriaId);
                    const IconComponent = isExpanded ? XCircle : Info;
                    
                    return (
                      <div key={criteria.criteriaId} className="border border-transparent rounded-lg">
                        <button
                          onClick={() => toggleCriteria(criteria.criteriaId)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-white">
                                {criteria.criteriaName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Score: {criteria.score}/10 • Weight: {(criteria.weight * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Progress Ring for Criteria Score - Makes sense here for comparing performance */}
                            <div className="flex flex-col items-center">
                              <ProgressRing
                                value={criteria.score * 10}
                                size={56}
                                strokeWidth={5}
                                colorScheme="auto"
                                showLabel={true}
                                className="flex-shrink-0"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {(criteria.weightedScore).toFixed(1)} pts
                              </div>
                            </div>
                            <IconComponent className="w-4 h-4 text-gray-500" />
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="border-t border-blue-800/30">
                            <div className="px-4 pb-4">
                                <div className="pt-4 space-y-3">
                                  <div>
                                    <h5 className="text-sm font-medium text-white mb-2">
                                      Explanation
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      {criteria.explanation}
                                    </p>
                                  </div>
                                  
                                  {criteria.evidence && criteria.evidence.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium text-white mb-2">
                                        Evidence
                                      </h5>
                                      <ul className="text-sm text-gray-500 space-y-1">
                                        {criteria.evidence.map((evidence, index) => (
                                          <li key={index} className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">•</span>
                                            {evidence}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Key Insights
                </h3>
                <div className="space-y-3">
                  {rating.insights.map((insight, index) => {
                    const { icon: IconComponent, color } = getInsightIcon(insight.type);
                    
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-black rounded-lg">
                        <IconComponent className={`w-5 h-5 ${color} mt-0.5`} />
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            {insight.message}
                          </p>
                          {insight.actionable && (
                            <span className="inline-block mt-1 text-xs text-blue-500">
                              Actionable
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recommended Sales Actions
                </h3>
                <div className="space-y-4">
                  {rating.salesActions.map((action) => (
                    <div key={action.id} className="border border-transparent rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">
                              {action.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {action.timeline}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                action.priority === 'high'
                                  ? 'bg-red-900/30 text-red-400'
                                  : action.priority === 'medium'
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-blue-900/30 text-blue-500'
                              }`}>
                                {action.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(action.description)}
                          className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Copy action details"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">
                        {action.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-xs font-medium text-white mb-1">
                            Expected Outcome
                          </h5>
                          <p className="text-sm text-gray-500">
                            {action.expectedOutcome}
                          </p>
                        </div>
                        
                        {action.resources && action.resources.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-white mb-1">
                              Resources Needed
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {action.resources.map((resource, index) => (
                                <span key={index} className="px-2 py-1 bg-black text-xs text-gray-500 rounded">
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
          </div>
        )}

        {/* Removed blue "Next Steps" box - replaced with tooltip icon next to widget title */}
      </div>
    </div>
  );
}
