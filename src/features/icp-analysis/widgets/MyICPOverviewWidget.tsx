import React, { useState, useEffect } from 'react'
import '../../../shared/styles/design-tokens.css';
import '../../../shared/styles/component-patterns.css';

import { motion, AnimatePresence } from 'framer-motion'
import { ProgressRing } from '../../../shared/components/ui/ProgressRing'
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
}

// TSX Components to render ICP data (replaces dangerous HTML string generation)
const ICPOverviewContent: React.FC<{ icpData: ICPData }> = ({ icpData }) => {
  return (
    <div>
      <p className="body-large" style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        {icpData.description}
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <h4 className="heading-4" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Customer Segments
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {icpData.segments.map((segment, idx) => (
            <div key={idx} className="card-glass hover-lift" style={{ padding: '1.25rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong className="heading-4" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {segment.name}
                </strong>
                {/* Expert Requirement: Progress Ring instead of text badge */}
                <ProgressRing
                  value={segment.score}
                  size={56}
                  strokeWidth={5}
                  colorScheme="auto"
                  showLabel={true}
                  className="flex-shrink-0"
                />
              </div>
              <ul className="body-small" style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                {segment.criteria.map((c, cidx) => (
                  <li key={cidx} style={{ paddingLeft: '1.25rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--color-primary)' }}>•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const KeyIndicatorsContent: React.FC<{ icpData: ICPData }> = ({ icpData }) => {
  return (
    <div>
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h4 className="heading-4" style={{ marginBottom: '0.75rem', color: 'var(--color-success)' }}>
          ✓ Strong Fit Indicators
        </h4>
        <ul className="body" style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {icpData.keyIndicators.map((indicator, idx) => (
            <li key={idx} style={{ paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-secondary)' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--color-success)', fontWeight: 600 }}>✓</span>
              {indicator}
            </li>
          ))}
        </ul>
      </div>
      {icpData.redFlags && icpData.redFlags.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-danger)' }}>
          <h4 className="heading-4" style={{ marginBottom: '0.75rem', color: 'var(--color-danger)' }}>
            ⚠ Red Flags to Watch
          </h4>
          <ul className="body" style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {icpData.redFlags.map((flag, idx) => (
              <li key={idx} style={{ paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-secondary)' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--color-danger)', fontWeight: 600 }}>⚠</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const RatingCriteriaContent: React.FC<{ icpData: ICPData }> = ({ icpData }) => {
  return (
    <div>
      <p className="body" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Use these weighted criteria to score potential customers:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {icpData.ratingCriteria.map((criteria, idx) => (
          <div key={idx} className="card-metric hover-lift" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong className="heading-4" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {criteria.name}
              </strong>
              {/* Expert Requirement: Progress Ring instead of text badge */}
              <ProgressRing
                value={criteria.weight}
                size={48}
                strokeWidth={4}
                colorScheme="primary"
                showLabel={true}
                className="flex-shrink-0"
              />
            </div>
            <p className="body-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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
  userId
}: MyICPOverviewWidgetProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  
  // Use cache hook instead of manual state management
  const {
    icpData,
    isLoadingICP,
    icpError,
    refetchICP
  } = useCustomerCache({ 
    customerId: userId, 
    enabled: !!userId 
  })
  
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
          description: `Use this ICP to personalize your sales approach for ${topSegment} and identify key talking points.`,
          icon: Target
        },
        {
          title: 'Marketing Campaigns',
          description: `Tailor your marketing messages to resonate with companies matching this ${currentIcpData.title}.`,
          icon: TrendingUp
        },
        {
          title: 'Product Development',
          description: `Focus product features on solving the specific needs identified in the key indicators.`,
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

  return (
    <div className={`card-executive overflow-hidden ${className}`}>
      <div className="card-padding-md" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-3">My ICP Overview</h2>
            <p className="body-small text-text-muted">
              {isLoading ? 'Loading ICP data...' :
               error ? 'Error loading ICP data' :
               icpData ? `${icpData.title} • ${icpData.confidence}% confidence` :
               'No ICP data available - generate an analysis first'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Expert Requirement: Progress Ring for confidence score instead of text */}
            {currentIcpData?.confidence && (
              <div className="flex items-center gap-2">
                <ProgressRing
                  value={currentIcpData.confidence}
                  size={48}
                  strokeWidth={4}
                  colorScheme="auto"
                  showLabel={true}
                  className="flex-shrink-0"
                />
                <span className="caption text-text-muted">match</span>
              </div>
            )}
            <button
              onClick={onRefresh}
              className="btn-secondary"
              style={{ minWidth: 'auto', padding: 'var(--space-2)' }}
              title="Refresh ICP data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {onExport && (
              <button
                onClick={() => icpData && onExport(icpData)}
                className="btn-secondary"
                style={{ minWidth: 'auto', padding: 'var(--space-2)' }}
                title="Export ICP data"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
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
              <p className="body text-text-muted mb-4">Generate an ICP analysis to see your customer profile here.</p>
              <button
                onClick={handleRefresh}
                className="btn btn-primary"
              >
                Refresh
              </button>
            </div>
          ) : (
            <>
              <div className="card-padding-md mb-8" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--radius-md)',
                backdropFilter: 'blur(12px)'
              }}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <p className="body-small" style={{ color: 'var(--color-primary)' }}>
                      💡 <strong>Pro Tip:</strong> Use this comprehensive analysis to guide your prospect
                      conversations, marketing messaging, and sales qualification process.
                    </p>
                  </div>
                </div>
              </div>

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
                          {/* Expert Requirement: Progress Ring for confidence score instead of text badge */}
                          <ProgressRing
                            value={section.confidence}
                            size={40}
                            strokeWidth={3}
                            colorScheme="auto"
                            showLabel={true}
                            className="flex-shrink-0"
                          />
                          <span className="caption text-text-muted italic">
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

            <div className="mt-8 card-padding-sm" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              backdropFilter: 'blur(12px)'
            }}>
              <h4 className="heading-4 text-sm mb-2" style={{ color: 'var(--color-primary)' }}>
                💡 Pro Tip
              </h4>
              <p className="caption text-text-muted">
                Use your ICP as a living document - regularly update it based on customer feedback and market changes to maintain accuracy and relevance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
