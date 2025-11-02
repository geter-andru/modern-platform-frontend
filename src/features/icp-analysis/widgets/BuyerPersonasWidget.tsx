import React, { useState, useEffect } from 'react'
import '../../../shared/styles/design-tokens.css';

import { motion, AnimatePresence } from 'framer-motion'
import Tooltip from '../../../shared/components/ui/Tooltip'
import {
  RefreshCw,
  ExternalLink,
  Users,
  Zap,
  AlertTriangle,
  Eye,
  EyeOff,
  User,
  Brain,
  Target,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Info
} from 'lucide-react'
import { usePersonasCache } from '@/app/lib/hooks/cache'

// Use the types from the cache hook
import type { BuyerPersona as CacheBuyerPersona } from '@/app/lib/hooks/cache'

// Local interface that matches the component's expected structure
interface BuyerPersona {
  id: string
  name: string
  title: string
  role: string
  demographics: {
    ageRange: string
    experience: string
    education: string
    location: string
  }
  psychographics: {
    values: string
    motivations: string
    fears: string
  }
  goals: string[]
  painPoints: string[]
  buyingBehavior: {
    decisionProcess: string
  }
  decisionInfluence: {
    timeline: string
    budgetAuthority: string
  }
  communicationPreferences: {
    preferredChannels: string[]
    communicationStyle: string
  }
  objections: string[]
  informationSources: string[]
}

interface BuyerPersonasWidgetProps {
  onExport?: (personas: BuyerPersona[]) => void
  className?: string
  userId?: string
}

export default function BuyerPersonasWidget({ 
  onExport, 
  className = '',
  userId
}: BuyerPersonasWidgetProps) {
  // Use cache hook instead of manual state management
  const {
    personas,
    isLoadingPersonas,
    isGeneratingPersonas,
    hasError,
    personasError,
    generationError,
    generatePersonas,
    refetchPersonas
  } = usePersonasCache({ 
    customerId: userId, 
    enabled: !!userId 
  })
  
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null)

  const handleGeneratePersonas = async () => {
    try {
      console.log('👥 Starting buyer persona generation...')

      // Validate userId is available
      if (!userId) {
        throw new Error('User ID is required to generate personas')
      }

      // First, get ICP data from backend to use for persona generation
      console.log(`📡 Fetching ICP data for user ${userId}`)
      const icpResponse = await fetch(`/api/customer/${userId}/icp`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('🔍 [DEBUG] ICP response received, status:', icpResponse.status)

      let companyContext = ''
      let industry = 'Technology'
      let targetMarket = ''

      if (icpResponse.ok) {
        console.log('🔍 [DEBUG] ICP response OK, parsing JSON...')
        const icpResult = await icpResponse.json()
        console.log('🔍 [DEBUG] ICP JSON parsed successfully:', icpResult)
        if (icpResult.success && icpResult.data?.icpData) {
          const icpData = icpResult.data.icpData
          console.log('✅ ICP data loaded for persona generation', icpData)

          // Extract companyContext from ICP data structure
          // Build context from title, description, segments, and key indicators
          const contextParts = []

          if (icpData.title) {
            contextParts.push(icpData.title)
          }

          if (icpData.description) {
            contextParts.push(icpData.description)
          }

          // Add segment information
          if (icpData.segments && Array.isArray(icpData.segments)) {
            const segmentDescriptions = icpData.segments.map((seg: any) =>
              `${seg.name}: ${seg.criteria?.join(', ') || ''}`
            ).filter(Boolean)
            if (segmentDescriptions.length > 0) {
              contextParts.push('Target segments: ' + segmentDescriptions.join('; '))
            }
          }

          // Add key indicators
          if (icpData.keyIndicators && Array.isArray(icpData.keyIndicators) && icpData.keyIndicators.length > 0) {
            contextParts.push('Key indicators: ' + icpData.keyIndicators.slice(0, 5).join(', '))
          }

          companyContext = contextParts.filter(Boolean).join('. ')
          industry = 'Technology' // Default, as ICP doesn't specify industry directly
          targetMarket = icpData.segments?.[0]?.criteria?.[0] || 'Mid-market companies'
          console.log('🔍 [DEBUG] Context built, length:', companyContext.length)
        } else {
          console.warn('⚠️ No ICP data found in response')
        }
      } else {
        console.warn(`⚠️ Failed to fetch ICP data: ${icpResponse.status}`)
      }

      console.log('🔍 [DEBUG] Before validation - companyContext length:', companyContext.length)

      // Require valid company context
      if (!companyContext || companyContext.length < 10) {
        console.error('🔴 [DEBUG] Validation failed - companyContext too short!')
        throw new Error('No ICP data available. Please complete your ICP analysis first before generating buyer personas.')
      }

      console.log('🔍 [DEBUG] Validation passed, preparing persona generation request')
      console.log('📤 Sending persona generation request', {
        contextLength: companyContext.length,
        industry,
        targetMarket
      })

      // Use cache hook instead of manual state management
      await generatePersonas({
        companyContext,
        industry,
        targetMarket: targetMarket || 'Mid-market companies'
      })

      console.log('✅ Personas generation initiated successfully')
      
    } catch (error) {
      console.error('❌ Persona generation failed:', error)
      // Error handling is now managed by the cache hook
    }
  }

  const togglePersona = (personaId: string) => {
    setExpandedPersona(expandedPersona === personaId ? null : personaId)
  }


  const handleExportPersonas = async () => {
    if (transformedPersonas.length === 0) {
      console.error('No personas to export. Generate personas first.')
      return
    }

    try {
      console.log('📤 Exporting personas...')
      const response = await fetch('/api/export/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: 'pdf',
          personas: transformedPersonas,
          includeMethodology: true,
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
      a.download = `buyer-personas-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ Personas exported successfully')
    } catch (error) {
      console.error('❌ Export failed:', error)
      // Error handling could be improved with toast notifications
    }
  }

  // Transform cache hook personas to component format
  const transformedPersonas: BuyerPersona[] = personas.map((persona: CacheBuyerPersona, index: number) => ({
    id: persona.id || `persona-${index + 1}`,
    name: persona.name,
    title: persona.title,
    role: persona.title, // Use title as role for now
    demographics: {
      ageRange: persona.demographics.age || '30-50',
      experience: '5-15 years', // Default value
      education: 'Bachelor\'s degree', // Default value
      location: persona.demographics.location || 'Major metropolitan areas'
    },
    psychographics: {
      values: persona.psychographics.goals?.join(', ') || 'Professional growth and efficiency',
      motivations: persona.psychographics.motivations?.join(', ') || 'Achieving business objectives',
      fears: persona.psychographics.challenges?.join(', ') || 'Making wrong decisions'
    },
    goals: persona.psychographics.goals || ['Improve efficiency', 'Drive growth', 'Reduce costs'],
    painPoints: persona.psychographics.challenges || ['Current limitations', 'Process inefficiencies', 'Resource constraints'],
    buyingBehavior: {
      decisionProcess: persona.behavior?.decisionMakingProcess || 'Data-driven evaluation'
    },
    decisionInfluence: {
      timeline: '3-6 months', // Default value
      budgetAuthority: 'Medium' // Default value
    },
    communicationPreferences: {
      preferredChannels: persona.behavior?.preferredChannels || ['Email', 'LinkedIn', 'Phone calls'],
      communicationStyle: 'Professional and data-driven' // Default value
    },
    objections: persona.behavior?.objections || ['Cost concerns', 'Implementation complexity', 'Change management'],
    informationSources: ['Industry publications', 'Peer networks', 'Online research'] // Default value
  }))

  // Personas are automatically loaded by the cache hook

  const getPersonaIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'technical decision maker': return Brain
      case 'business decision maker': return Target
      case 'end user': return User
      default: return Users
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900/30 text-red-400 border border-red-700/50'
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
      case 'low': return 'bg-green-900/30 text-green-400 border border-green-700/50'
      default: return 'bg-background-primary/30 text-text-secondary border border-surface/50'
    }
  }

  return (
    <div className={`bg-background-secondary border border-transparent rounded-xl overflow-hidden ${className}`}>
      <div className="bg-background-tertiary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary">Target Buyer Personas</h2>
              {personas.length > 0 && (
                <Tooltip
                  content={
                    <div className="max-w-xs">
                      <p className="text-sm text-text-primary">
                        Use these personas to tailor your messaging, content, and sales approach. Focus on addressing their specific pain points and speaking their language to increase engagement and conversion rates.
                      </p>
                    </div>
                  }
                  placement="bottom"
                  trigger="hover"
                >
                  <span className="inline-flex items-center">
                    <Info className="w-4 h-4 text-text-muted cursor-help" />
                  </span>
                </Tooltip>
              )}
            </div>
            <p className="text-text-muted text-sm">
              {isGeneratingPersonas ? 'Generating buyer personas...' : 
               hasError ? 'Error generating personas' :
               transformedPersonas.length > 0 ? `${transformedPersonas.length} personas generated • AI-powered with empathy mapping` : 
               'AI-generated buyer personas with empathy mapping and behavioral insights'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {/* Clear personas - handled by cache hook */}}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              title="Clear personas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {transformedPersonas.length > 0 && (
              <button
                onClick={handleExportPersonas}
                className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
                title="Export personas"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {hasError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-800 text-sm">{personasError?.message || generationError?.message || 'An error occurred'}</p>
                <button 
                  onClick={() => refetchPersonas()}
                  className="mt-2 text-accent-danger hover:text-red-800 text-sm underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
        
        {transformedPersonas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Generate Target Buyer Personas
            </h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Create detailed buyer personas with empathy mapping, behavioral insights, and communication preferences based on your ICP data.
            </p>
            <button
              onClick={handleGeneratePersonas}
              disabled={isGeneratingPersonas}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-text-primary rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isGeneratingPersonas ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Personas...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Buyer Personas
                </>
              )}
            </button>
          </div>
        )}

        {isGeneratingPersonas && (
          <div className="mb-6 p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-brand-primary animate-spin" />
              <div>
                <h4 className="text-sm font-semibold text-brand-primary">
                  Generating Buyer Personas
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  Analyzing your ICP data and creating detailed personas with empathy mapping...
                </p>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {personas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {transformedPersonas.map((persona, index) => {
                const isExpanded = expandedPersona === persona.id;
                const IconComponent = getPersonaIcon(persona.role);
                
                return (
                  <div key={persona.id} className="bg-background-tertiary rounded-lg overflow-hidden">
                    
                    <button
                      onClick={() => togglePersona(persona.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-text-primary">
                            {persona.name}
                          </h3>
                          <p className="text-sm text-text-muted">
                            {persona.title} • {persona.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor('high')}`}>
                          High Priority
                        </span>
                        {isExpanded ? (
                          <EyeOff className="w-4 h-4 text-text-muted" />
                        ) : (
                          <Eye className="w-4 h-4 text-text-muted" />
                        )}
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
                          <div className="px-6 pb-6 border-t border-transparent">
                            <div className="pt-6 space-y-6">
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-background-primary rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-brand-primary" />
                                    Demographics
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-text-muted">Age Range:</span>
                                      <span className="text-text-primary">{persona.demographics.ageRange}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-text-muted">Experience:</span>
                                      <span className="text-text-primary">{persona.demographics.experience}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-text-muted">Education:</span>
                                      <span className="text-text-primary">{persona.demographics.education}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-text-muted">Location:</span>
                                      <span className="text-text-primary">{persona.demographics.location}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-background-primary rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-brand-primary" />
                                    Psychographics
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-text-muted">Values:</span>
                                      <span className="text-text-primary">{persona.psychographics.values}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-text-muted">Motivations:</span>
                                      <span className="text-text-primary">{persona.psychographics.motivations}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-text-muted">Fears:</span>
                                      <span className="text-text-primary">{persona.psychographics.fears}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-background-primary rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-400" />
                                    Goals
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.goals.map((goal, goalIndex) => (
                                      <li key={goalIndex} className="text-sm text-text-primary flex items-start gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                                        {goal}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-background-primary rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    Pain Points
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.painPoints.map((painPoint, painIndex) => (
                                      <li key={painIndex} className="text-sm text-text-primary flex items-start gap-2">
                                        <AlertTriangle className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" />
                                        {painPoint}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="bg-background-primary rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                                  Buying Behavior
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-text-muted">Decision Process:</span>
                                    <p className="text-text-primary mt-1">{persona.buyingBehavior.decisionProcess}</p>
                                  </div>
                                  <div>
                                    <span className="text-text-muted">Timeline:</span>
                                    <p className="text-text-primary mt-1">{persona.decisionInfluence.timeline}</p>
                                  </div>
                                  <div>
                                    <span className="text-text-muted">Budget Authority:</span>
                                    <p className="text-text-primary mt-1">{persona.decisionInfluence.budgetAuthority}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-background-primary rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-brand-primary" />
                                  Communication Preferences
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-text-muted">Preferred Channels:</span>
                                    <p className="text-text-primary mt-1">{persona.communicationPreferences.preferredChannels.join(', ')}</p>
                                  </div>
                                  <div>
                                    <span className="text-text-muted">Tone:</span>
                                    <p className="text-text-primary mt-1">{persona.communicationPreferences.communicationStyle}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-background-primary rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                                    Common Objections
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.objections.map((objection, objIndex) => (
                                      <li key={objIndex} className="text-sm text-text-primary flex items-start gap-2">
                                        <span className="text-orange-400 mt-1">•</span>
                                        {objection}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-background-primary rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                                    Information Sources
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.informationSources.map((source, srcIndex) => (
                                      <li key={srcIndex} className="text-sm text-text-primary flex items-start gap-2">
                                        <span className="text-brand-primary mt-1">•</span>
                                        {source}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Removed blue "Pro Tip" box - replaced with tooltip icon next to widget title */}
      </div>
    </div>
  );
};

