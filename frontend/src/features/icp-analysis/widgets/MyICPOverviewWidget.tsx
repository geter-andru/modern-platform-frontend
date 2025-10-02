import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RefreshCw, 
  Download, 
  Edit, 
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
  ExternalLink,
  Info,
  ChevronUp,
  ChevronDown,
  Copy,
  Lightbulb
} from 'lucide-react'

interface ICPData {
  companyName: string
  industry: string
  confidence: number
  companySize: string
  revenue: string
  location: string
  painPoints: string[]
  goals: string[]
  timeline: string
  budget: string
  decisionMakers: string[]
  lastUpdated: string
}

interface ICPSection {
  id: string
  title: string
  content: string
  icon: React.ComponentType<any>
  priority: 'high' | 'medium' | 'low'
  confidence: number
  confidenceReasoning: string
}

interface WhenToUseScenario {
  title: string
  description: string
  icon: React.ComponentType<any>
}

interface MyICPOverviewWidgetProps {
  className?: string
  onRefresh?: () => void
  onExport?: (data: ICPData) => void
}

// Helper functions to generate content from ICP data
const generateCompanyOverviewContent = (icpData: any): string => {
  return `
    <div>
      <p><strong>${icpData.companyName}</strong> is a ${icpData.industry} company with ${icpData.companySize || 'unknown size'}.</p>
      ${icpData.revenue ? `<p><strong>Revenue:</strong> ${icpData.revenue}</p>` : ''}
      ${icpData.location ? `<p><strong>Location:</strong> ${icpData.location}</p>` : ''}
      ${icpData.sections?.targetCompanyProfile ? `<p>${icpData.sections.targetCompanyProfile.description || 'Company profile generated from AI analysis.'}</p>` : ''}
    </div>
  `
}

const generatePainPointsContent = (icpData: any): string => {
  const painPoints = icpData.sections?.keyPainPoints?.painPoints || icpData.painPoints || ['Scaling challenges', 'Technical debt', 'Team growth']
  return `
    <div>
      <p>Key challenges identified for ${icpData.companyName}:</p>
      <ul>
        ${painPoints.map((point: string) => `<li>${point}</li>`).join('')}
      </ul>
      ${icpData.sections?.keyPainPoints?.description ? `<p>${icpData.sections.keyPainPoints.description}</p>` : ''}
    </div>
  `
}

const generateDecisionMakersContent = (icpData: any): string => {
  const decisionMakers = icpData.sections?.decisionMakerProfile?.decisionMakers || icpData.decisionMakers || ['CTO', 'VP Engineering', 'Head of Product']
  return `
    <div>
      <p>Primary decision makers for ${icpData.companyName}:</p>
      <ul>
        ${decisionMakers.map((maker: string) => `<li>${maker}</li>`).join('')}
      </ul>
      ${icpData.sections?.decisionMakerProfile?.description ? `<p>${icpData.sections.decisionMakerProfile.description}</p>` : ''}
    </div>
  `
}

export default function MyICPOverviewWidget({ 
  className = '',
  onRefresh,
  onExport
}: MyICPOverviewWidgetProps) {
  const [icpData, setIcpData] = useState<ICPData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const [sectionsWithContent, setSectionsWithContent] = useState<ICPSection[]>([])

  const [whenToUseScenarios, setWhenToUseScenarios] = useState<WhenToUseScenario[]>([])

  const handleRefresh = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('🔄 Refreshing ICP data...')
      await loadICPData()
    } catch (error) {
      console.error('❌ Failed to refresh ICP data:', error)
      setError('Failed to refresh ICP data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    if (!icpData) {
      setError('No ICP data available to export')
      return
    }

    try {
      console.log('📤 Exporting ICP data...')
      const response = await fetch('/api/export/icp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: 'pdf',
          includeAssessmentData: true,
          includeProductDetails: true,
          includeRecommendations: true
        })
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `icp-analysis-${icpData.companyName}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ ICP data exported successfully')
    } catch (error) {
      console.error('❌ Export failed:', error)
      setError('Failed to export ICP data. Please try again.')
    }
  }

  const handleEdit = () => {
    console.log('✏️ Opening ICP editor...')
    // TODO: Navigate to ICP editor or open edit modal
  }

  const loadICPData = async () => {
    try {
      console.log('📊 Loading ICP data...')
      const response = await fetch('/api/icp-analysis/current-user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('No ICP data found. Generate an ICP analysis first.')
          return
        }
        throw new Error('Failed to load ICP data')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load ICP data')
      }

      const icpData = result.icp
      setIcpData(icpData)
      
      // Transform ICP data into sections
      const sections: ICPSection[] = [
        {
          id: 'company-overview',
          title: 'Company Overview',
          content: generateCompanyOverviewContent(icpData),
          icon: Building2,
          priority: 'high',
          confidence: icpData.confidence || 85,
          confidenceReasoning: 'Based on AI analysis and market research'
        },
        {
          id: 'pain-points',
          title: 'Key Pain Points',
          content: generatePainPointsContent(icpData),
          icon: AlertTriangle,
          priority: 'high',
          confidence: icpData.confidence || 85,
          confidenceReasoning: 'Inferred from company stage and industry analysis'
        },
        {
          id: 'decision-makers',
          title: 'Decision Makers',
          content: generateDecisionMakersContent(icpData),
          icon: Users,
          priority: 'medium',
          confidence: icpData.confidence || 80,
          confidenceReasoning: 'Based on company structure and industry patterns'
        }
      ]
      
      setSectionsWithContent(sections)
      
      // Generate when-to-use scenarios
      const scenarios: WhenToUseScenario[] = [
        {
          title: 'Sales Calls',
          description: `Use this ICP to personalize your sales approach for ${icpData.companyName} and identify key talking points.`,
          icon: Target
        },
        {
          title: 'Marketing Campaigns',
          description: `Tailor your marketing messages to resonate with ${icpData.industry} companies like ${icpData.companyName}.`,
          icon: TrendingUp
        },
        {
          title: 'Product Development',
          description: `Focus product features on solving the specific pain points identified for ${icpData.companyName}.`,
          icon: Lightbulb
        }
      ]
      
      setWhenToUseScenarios(scenarios)
      
      console.log('✅ ICP data loaded successfully')
      
    } catch (error) {
      console.error('❌ Failed to load ICP data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load ICP data')
    }
  }

  // Load ICP data on component mount
  useEffect(() => {
    loadICPData().finally(() => setIsLoading(false))
  }, [])

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const copySectionContent = async (sectionId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedSection(sectionId)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }

  return (
    <div className={`bg-background-secondary border border-border-standard rounded-xl overflow-hidden ${className}`}>
      <div className="bg-background-tertiary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">My ICP Overview</h2>
            <p className="text-text-muted text-sm">
              {isLoading ? 'Loading ICP data...' : 
               error ? 'Error loading ICP data' :
               icpData ? `${icpData.companyName} • ${icpData.industry} • ${icpData.confidence}% confidence` : 
               'No ICP data available - generate an analysis first'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-text-muted">
              <CheckCircle className="w-4 h-4 text-brand-primary" />
              {icpData?.confidence || 0}% match
            </div>
            <button
              onClick={onRefresh}
              className="p-2 text-text-muted hover:text-text-primary transition-colors"
              title="Refresh ICP data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {onExport && (
              <button
                onClick={() => icpData && onExport(icpData)}
                className="p-2 text-text-muted hover:text-text-primary transition-colors"
                title="Export ICP data"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        
        <div className="flex-1 p-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-800 text-sm">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try again
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
                <p className="text-text-muted">Loading ICP data...</p>
              </div>
            </div>
          ) : !icpData ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No ICP Data Available</h3>
              <p className="text-text-muted mb-4">Generate an ICP analysis to see your customer profile here.</p>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <>
              <div className="bg-brand-primary/20 border border-brand-primary/50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-brand-primary mt-0.5" />
                  <div>
                    <p className="text-brand-primary text-sm">
                      💡 <strong>Pro Tip:</strong> Use this comprehensive analysis to guide your prospect 
                      conversations, marketing messaging, and sales qualification process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {sectionsWithContent.map((section, index) => {
                    const IconComponent = section.icon;
                    const isExpanded = expandedSections.has(section.id);
                    
                    return (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-background-tertiary rounded-lg overflow-hidden"
                      >
                        
                        <div className="px-4 py-3 bg-background-secondary flex items-center justify-between">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center gap-3 hover:bg-surface-hover rounded-lg px-2 py-1 transition-colors flex-1"
                          >
                            <IconComponent className="w-5 h-5 text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">
                              {section.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              section.priority === 'high' 
                                ? 'bg-red-900/30 text-red-400' 
                                : section.priority === 'medium'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-surface text-text-disabled'
                            }`}>
                              {section.priority}
                            </span>
                        
                          <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            section.confidence >= 90 
                              ? 'bg-green-900/30 text-green-400' 
                              : section.confidence >= 80
                              ? 'bg-blue-900/30 text-blue-400'
                              : section.confidence >= 70
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}>
                            {section.confidence}%
                          </span>
                          <span className="text-xs text-text-muted italic">
                            {section.confidenceReasoning}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-text-muted ml-auto" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-muted ml-auto" />
                        )}
                      </button>
                      <button
                        onClick={() => copySectionContent(section.id, section.content)}
                        className="p-1 text-text-muted hover:text-text-primary transition-colors ml-2"
                        title="Copy section content"
                      >
                        {copiedSection === section.id ? (
                          <CheckCircle className="w-4 h-4 text-brand-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4">
                            <div 
                              className="prose max-w-none prose-invert 
                                [&>div]:!bg-background-tertiary [&>div]:!border-border-standard 
                                [&_h2]:!text-text-primary [&_h3]:!text-text-primary [&_h4]:!text-text-secondary
                                [&_p]:!text-text-secondary [&_ul]:!text-text-secondary [&_li]:!text-text-secondary
                                [&_.bg-white]:!bg-background-tertiary [&_.bg-gray-50]:!bg-background-secondary 
                                [&_.text-blue-800]:!text-brand-primary [&_.text-blue-700]:!text-brand-primary 
                                [&_.text-gray-700]:!text-text-secondary [&_.text-gray-600]:!text-text-muted 
                                [&_.text-gray-800]:!text-text-primary [&_.text-gray-900]:!text-text-primary
                                [&_.bg-blue-50]:!bg-brand-primary/20 [&_.border-blue-200]:!border-brand-primary/50
                                [&_.bg-red-50]:!bg-red-900/20 [&_.border-red-200]:!border-red-600/50 
                                [&_.border-red-400]:!border-red-500/50 [&_.text-red-500]:!text-red-400
                                [&_.bg-green-50]:!bg-green-900/20 [&_.border-green-200]:!border-green-600/50 
                                [&_.border-green-400]:!border-green-500/50 [&_.text-green-500]:!text-green-400
                                [&_.bg-yellow-50]:!bg-yellow-900/20 [&_.border-yellow-200]:!border-yellow-600/50 
                                [&_.border-yellow-400]:!border-yellow-500/50 [&_.text-yellow-500]:!text-yellow-400
                                [&_.shadow-md]:!shadow-lg [&_.shadow-md]:!shadow-black/20"
                              dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4">
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>Last updated: {icpData ? new Date(icpData.lastUpdated).toLocaleDateString() : 'N/A'}</span>
              <span>{sectionsWithContent.length} sections available</span>
            </div>
          </div>
            </>
          )}
        </div>

        <div className="w-80 bg-background-tertiary p-6">
          <div className="sticky top-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-primary" />
              When to Use This
            </h3>
            <div className="space-y-4">
              {whenToUseScenarios.map((scenario, index) => {
                const IconComponent = scenario.icon;
                return (
                  <div key={index} className="bg-background-secondary rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-2">
                          {scenario.title}
                        </h4>
                        <p className="text-xs text-text-muted leading-relaxed">
                          {scenario.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-brand-primary/10 rounded-lg">
              <h4 className="text-sm font-semibold text-brand-primary mb-2">
                💡 Pro Tip
              </h4>
              <p className="text-xs text-text-muted">
                Use your ICP as a living document - regularly update it based on customer feedback and market changes to maintain accuracy and relevance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
