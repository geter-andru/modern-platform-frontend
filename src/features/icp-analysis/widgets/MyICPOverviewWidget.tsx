import React, { useState, useEffect } from 'react'
import '../../../shared/styles/design-tokens.css';
import '../../../shared/styles/component-patterns.css';

import { motion, AnimatePresence } from 'framer-motion'
import Tooltip from '../../../shared/components/ui/Tooltip'
import ConfidenceBadge, { getConfidenceLevel } from '../../../shared/components/ui/ConfidenceBadge'
import { IntelligenceSignal, CoverageRing } from '../../../shared/components/ui/IntelligenceSignal'
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
import { useCustomerCache } from '@/app/lib/hooks/cache'
import type { ICPData } from '@/app/lib/hooks/cache'
// import { ErrorBoundary } from '../../../../app/components/ErrorBoundary'

// Use ICPData type from cache hook

interface ICPSection {
  id: string
  title: string
  content: React.ReactNode
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
  userId?: string
  icpData?: any // Direct ICP data for demo mode
  personas?: any[] // Direct personas data for demo mode
  productName?: string // Product name for demo mode
  isDemo?: boolean // Flag to indicate demo mode
}

// TSX Components to render ICP data (replaces dangerous HTML string generation)
const ICPOverviewContent: React.FC<{ icpData: ICPData }> = ({ icpData }) => {
  const [showAllSegments, setShowAllSegments] = React.useState(false)

  const segmentsToShow = showAllSegments ? icpData.segments : icpData.segments.slice(0, 3)

  return (
    <div>
      <p className="body-large mb-6" style={{ color: 'var(--text-primary)' }}>
        {icpData.description}
      </p>
      <div className="mt-6">
        <h4 className="heading-4 mb-4" style={{ color: 'var(--text-primary)' }}>
          Customer Segments
        </h4>
        <div className="flex flex-col gap-3">
          {segmentsToShow.map((segment, idx) => (
            <div
              key={idx}
              className="card-glass p-5 rounded-lg"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <strong className="heading-4" style={{ color: 'var(--text-primary)' }}>
                  {segment.name}
                </strong>
                <span className={`badge ${
                  segment.score >= 90 ? 'badge-success' :
                  segment.score >= 80 ? 'badge-primary' :
                  'badge-warning'
                }`}>
                  {segment.score}
                </span>
              </div>
              <ul className="body-small list-none pl-0 flex flex-col gap-2" style={{ color: 'var(--text-secondary)' }}>
                {segment.criteria.map((c, cidx) => (
                  <li key={cidx} className="pl-5 relative">
                    <span style={{ position: 'absolute', left: 0, color: 'var(--color-primary)' }}>•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {icpData.segments.length > 3 && (
          <button
            onClick={() => setShowAllSegments(!showAllSegments)}
            className="btn-secondary mt-4"
            style={{ fontSize: '0.875rem', padding: 'var(--space-1) var(--space-3)' }}
          >
            {showAllSegments ? 'Show Less' : `Show ${icpData.segments.length - 3} More Segments (${icpData.segments.length} total)`}
          </button>
        )}
      </div>
    </div>
  )
}

const KeyIndicatorsContent: React.FC<{ icpData: ICPData }> = ({ icpData }) => {
  const [showAllIndicators, setShowAllIndicators] = React.useState(false)
  const [showAllRedFlags, setShowAllRedFlags] = React.useState(false)

  const indicatorsToShow = showAllIndicators ? icpData.keyIndicators : icpData.keyIndicators.slice(0, 5)
  const redFlagsToShow = showAllRedFlags ? icpData.redFlags : icpData.redFlags?.slice(0, 5)

  return (
    <div>
      <div className="card p-5 mb-4">
        <h4 className="heading-4 mb-3" style={{ color: 'var(--color-success)' }}>
          ✓ Strong Fit Indicators
        </h4>
        <ul className="body list-none pl-0 flex flex-col gap-2">
          {indicatorsToShow.map((indicator, idx) => (
            <li key={idx} className="pl-6 relative" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--color-success)', fontWeight: 600 }}>✓</span>
              {indicator}
            </li>
          ))}
        </ul>
        {icpData.keyIndicators.length > 5 && (
          <button
            onClick={() => setShowAllIndicators(!showAllIndicators)}
            className="btn-secondary mt-3"
            style={{ fontSize: '0.875rem', padding: 'var(--space-1) var(--space-3)' }}
          >
            {showAllIndicators ? 'Show Less' : `Show ${icpData.keyIndicators.length - 5} More Indicators (${icpData.keyIndicators.length} total)`}
          </button>
        )}
      </div>
      {icpData.redFlags && icpData.redFlags.length > 0 && (
        <div className="card p-5" style={{ borderLeft: '3px solid var(--color-danger)' }}>
          <h4 className="heading-4 mb-3" style={{ color: 'var(--color-danger)' }}>
            ⚠ Red Flags to Watch
          </h4>
          <ul className="body list-none pl-0 flex flex-col gap-2">
            {redFlagsToShow?.map((flag, idx) => (
              <li key={idx} className="pl-6 relative" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--color-danger)', fontWeight: 600 }}>⚠</span>
                {flag}
              </li>
            ))}
          </ul>
          {icpData.redFlags.length > 5 && (
            <button
              onClick={() => setShowAllRedFlags(!showAllRedFlags)}
              className="btn-secondary mt-3"
              style={{ fontSize: '0.875rem', padding: 'var(--space-1) var(--space-3)' }}
            >
              {showAllRedFlags ? 'Show Less' : `Show ${icpData.redFlags.length - 5} More Red Flags (${icpData.redFlags.length} total)`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const RatingCriteriaContent: React.FC<{ icpData: ICPData }> = ({ icpData }) => {
  return (
    <div>
      <p className="body mb-4" style={{ color: 'var(--text-primary)' }}>
        Use these weighted criteria to score potential customers against your ICP. Higher weights indicate more critical qualification factors. Multiply each criteria score by its weight percentage to calculate weighted contribution to overall match score.
      </p>
      <div className="flex flex-col gap-3">
        {icpData.ratingCriteria.map((criteria, idx) => (
          <div
            key={idx}
            className="card-metric p-4"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.05)',
              transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <strong className="heading-4" style={{ color: 'var(--text-primary)' }}>
                {criteria.name}
              </strong>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                {criteria.weight}%
              </span>
            </div>
            <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
              {criteria.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MyICPOverviewWidget({
  className = '',
  onRefresh,
  onExport,
  userId,
  icpData: directIcpData,
  personas: directPersonas,
  productName,
  isDemo = false
}: MyICPOverviewWidgetProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['icp-overview'])) // Start with first section expanded
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  // Use cache hook instead of manual state management (only if not in demo mode)
  const {
    icpData: cachedIcpData,
    isLoadingICP,
    icpError,
    refetchICP
  } = useCustomerCache({
    customerId: userId,
    enabled: !!userId && !isDemo // Disable API calls in demo mode
  })

  // Use direct data if in demo mode, otherwise use cached data
  const icpData = isDemo ? directIcpData : cachedIcpData
  
  // Use cache hook data
  const currentIcpData = icpData
  const isLoading = isLoadingICP
  const error = icpError?.message || null

  const [sectionsWithContent, setSectionsWithContent] = useState<ICPSection[]>([])

  const [whenToUseScenarios, setWhenToUseScenarios] = useState<WhenToUseScenario[]>([])

  const handleRefresh = async () => {
    try {
      // Use cache hook refresh
      refetchICP()
      onRefresh?.()
    } catch (error) {
      console.error('Failed to refresh ICP data:', error)
    }
  }

  const handleExport = async () => {
    if (!currentIcpData) {
      console.error('No ICP data available to export')
      return
    }

    try {
      console.log('📤 Exporting ICP data...')
      const response = await fetch('/api/export/icp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icpData: currentIcpData,
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
      a.download = `icp-analysis-${icpData.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ ICP data exported successfully')
    } catch (error) {
      console.error('❌ Export failed:', error)
      // Error handling is now managed by the cache hook
    }
  }

  const handleEdit = () => {
    console.log('✏️ Opening ICP editor...')
    // TODO: Navigate to ICP editor or open edit modal
  }

  // Generate sections and scenarios when ICP data changes
  useEffect(() => {
    if (currentIcpData) {
      // Transform ICP data into sections (using TSX components)
      const sections: ICPSection[] = [
        {
          id: 'icp-overview',
          title: 'ICP Framework',
          content: <ICPOverviewContent icpData={currentIcpData} />,
          icon: Building2,
          priority: 'high',
          confidence: currentIcpData.confidence || 90,
          confidenceReasoning: 'Based on AI analysis and market research'
        },
        {
          id: 'key-indicators',
          title: 'Key Indicators & Red Flags',
          content: <KeyIndicatorsContent icpData={currentIcpData} />,
          icon: AlertTriangle,
          priority: 'high',
          confidence: currentIcpData.confidence || 90,
          confidenceReasoning: 'AI-generated from comprehensive market analysis'
        },
        {
          id: 'rating-criteria',
          title: 'Rating Criteria',
          content: <RatingCriteriaContent icpData={currentIcpData} />,
          icon: BarChart3,
          priority: 'medium',
          confidence: currentIcpData.confidence || 90,
          confidenceReasoning: 'Weighted scoring system for prospect qualification'
        }
      ]
      
      setSectionsWithContent(sections)
      
      // Generate when-to-use scenarios
      const topSegment = currentIcpData.segments?.[0]?.name || 'target companies'
      const scenarios: WhenToUseScenario[] = [
        {
          title: 'Sales Calls',
          description: `Reference ${topSegment} firmographics and pain points from key indicators to open discovery calls. Surface specific technical challenges (e.g., ${currentIcpData.keyIndicators?.[0]?.substring(0, 50) || 'integration complexity'}) within the first 2 minutes to establish relevance.`,
          icon: Target
        },
        {
          title: 'Marketing Campaigns',
          description: `Target messaging to ${topSegment} companies matching ${currentIcpData.title}. Use key indicators to craft technical value propositions that address specific pain points (e.g., API integration challenges, data silos, scalability bottlenecks).`,
          icon: TrendingUp
        },
        {
          title: 'Product Development',
          description: `Prioritize features that address the top 3 pain points identified in key indicators. Use segment criteria to validate feature prioritization against actual customer needs (e.g., ${currentIcpData.segments?.[0]?.criteria?.[0]?.substring(0, 50) || 'enterprise security requirements'}).`,
          icon: Lightbulb
        }
      ]
      
      setWhenToUseScenarios(scenarios)
      
      console.log('✅ ICP data processed successfully')
    }
  }, [currentIcpData])

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const copySectionContent = async (sectionId: string) => {
    try {
      // Get the text content from the section's DOM element
      const sectionElement = document.getElementById(`section-content-${sectionId}`)
      if (sectionElement) {
        const textContent = sectionElement.innerText || sectionElement.textContent || ''
        await navigator.clipboard.writeText(textContent)
        setCopiedSection(sectionId)
        setTimeout(() => setCopiedSection(null), 2000)
      }
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }

  const expandAllSections = () => {
    setExpandedSections(new Set(sectionsWithContent.map(s => s.id)))
  }

  const collapseAllSections = () => {
    setExpandedSections(new Set())
  }

  return (
    <div className={`card-executive overflow-hidden ${className}`}>
      <div className="card-padding-md" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="heading-3">My ICP Overview</h2>
              <p className="body-small text-text-muted">
                {isLoading ? 'Loading ICP data...' :
                 error ? 'Error loading ICP data' :
                 icpData ? icpData.title :
                 'No ICP data available - generate an analysis first'}
              </p>
            </div>
            {currentIcpData && !isLoading && !error && (
              <CoverageRing
                coverage={currentIcpData.confidence || 0}
                size={60}
                strokeWidth={5}
                showPercentage={true}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="btn-secondary"
              style={{ minWidth: 'auto', padding: 'var(--space-2)' }}
              title="Refresh ICP data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {onExport && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => icpData && onExport(icpData)}
                  className="btn-secondary"
                  style={{ minWidth: 'auto', padding: 'var(--space-2)' }}
                  title="Export ICP data"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <Tooltip
                  content={
                    <div className="max-w-xs">
                      <p className="text-sm text-text-primary">
                        <strong>Action:</strong> Export this ICP before prospect calls to reference firmographics, pain points, and technical requirements. Use the rating criteria weights to prioritize qualification questions (focus on criteria with 25%+ weight first).
                      </p>
                    </div>
                  }
                  placement="bottom"
                  trigger="hover"
                >
                  <span className="inline-flex items-center cursor-help">
                    <Info className="w-3 h-3 text-text-muted" />
                  </span>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        
        <div className="flex-1 card-padding-md">
          {error && (
            <div className="card mb-6 card-padding-md" style={{ borderLeft: '3px solid var(--color-danger)' }}>
              <p className="body-small" style={{ color: 'var(--color-danger)' }}>{error}</p>
              <button
                onClick={handleRefresh}
                className="btn btn-secondary mt-2"
              >
                Try again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
                <p className="body text-text-muted">Loading ICP data...</p>
              </div>
            </div>
          ) : !icpData ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="heading-4 mb-2">No ICP Data Available</h3>
              <p className="body text-text-muted mb-4">Generate an ICP analysis from Product Details to see your customer profile, segments, and rating criteria here.</p>
              <button
                onClick={handleRefresh}
                className="btn btn-primary"
              >
                Refresh
              </button>
            </div>
          ) : (
            <>
              {/* Removed blue "Action" box - replaced with tooltip icon next to export button */}
              {sectionsWithContent.length > 0 && (
                <div className="flex justify-end gap-2 mb-4">
                  <button
                    onClick={expandAllSections}
                    className="btn-secondary flex items-center gap-2"
                    style={{ fontSize: '0.875rem', padding: 'var(--space-1) var(--space-3)' }}
                    title="Expand all sections"
                  >
                    <ChevronDown className="w-3 h-3" />
                    Expand All
                  </button>
                  <button
                    onClick={collapseAllSections}
                    className="btn-secondary flex items-center gap-2"
                    style={{ fontSize: '0.875rem', padding: 'var(--space-1) var(--space-3)' }}
                    title="Collapse all sections"
                  >
                    <ChevronUp className="w-3 h-3" />
                    Collapse All
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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
                        className="overflow-hidden"
                        style={{
                          background: 'rgba(0, 0, 0, 0.5)', // Dark glass background
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 'var(--radius-md)',
                          backdropFilter: 'blur(12px)'
                        }}
                      >

                        <div className="card-padding-sm flex items-center justify-between" style={{ background: 'transparent' }}>
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center gap-3 hover-lift px-2 py-1 transition-all flex-1"
                            style={{ background: 'transparent' }}
                          >
                            <IconComponent className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                            <h3 className="heading-4">
                              {section.title}
                            </h3>
                            <span className={`badge ${
                              section.priority === 'high'
                                ? 'badge-danger'
                                : section.priority === 'medium'
                                ? 'badge-warning'
                                : 'badge-secondary'
                            }`}>
                              {section.priority}
                            </span>

                          <div className="flex items-center gap-2">
                          <ConfidenceBadge
                            level={getConfidenceLevel(section.confidence)}
                            score={section.confidence}
                            showScore={true}
                            context={section.confidenceReasoning}
                            size="md"
                          />
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-text-muted ml-auto" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-muted ml-auto" />
                        )}
                      </button>
                      <button
                        onClick={() => copySectionContent(section.id)}
                        className="btn-secondary ml-2"
                        style={{ minWidth: 'auto', padding: 'var(--space-1)' }}
                        title="Copy section content"
                      >
                        {copiedSection === section.id ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
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
                          <div className="p-4" id={`section-content-${section.id}`}>
                            {section.content}
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
              <span>Last updated: {currentIcpData?.generatedAt ? new Date(currentIcpData.generatedAt).toLocaleDateString() : 'N/A'}</span>
              <span>{sectionsWithContent.length} sections available</span>
            </div>
          </div>
            </>
          )}
        </div>

        <div className="w-80 card-padding-md" style={{ background: 'rgba(0, 0, 0, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="sticky top-6">
            <h3 className="heading-4 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              When to Use This
              <Tooltip
                content={
                  <div className="max-w-xs">
                    <p className="text-sm text-text-primary">
                      Use your ICP as a living document - regularly update it based on customer feedback and market changes to maintain accuracy and relevance.
                    </p>
                  </div>
                }
                placement="right"
                trigger="hover"
              >
                <span className="inline-flex items-center cursor-help">
                  <Info className="w-4 h-4 text-text-muted" />
                </span>
              </Tooltip>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {whenToUseScenarios.map((scenario, index) => {
                const IconComponent = scenario.icon;
                return (
                  <div key={index} className="card-padding-sm" style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    backdropFilter: 'blur(12px)'
                  }}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                        <IconComponent className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <h4 className="heading-4 text-sm mb-2">
                          {scenario.title}
                        </h4>
                        <p className="caption text-text-muted leading-relaxed">
                          {scenario.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Removed blue "Pro Tip" box - replaced with tooltip icon next to "When to Use This" title */}
          </div>
        </div>
      </div>
    </div>
  );
}
