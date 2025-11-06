import React, { useState, useEffect } from 'react'
import Tooltip from '../../../shared/components/ui/Tooltip'
import ConfidenceBadge, { getConfidenceLevel } from '../../../shared/components/ui/ConfidenceBadge'
import { DataPointsIndicator } from '../../../shared/components/ui/IntelligenceSignal'
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
  personas?: any[] // Direct personas data for demo mode
  isDemo?: boolean // Flag to indicate demo mode
}

export default function BuyerPersonasWidget({
  onExport,
  className = '',
  userId,
  personas: directPersonas,
  isDemo = false
}: BuyerPersonasWidgetProps) {
  // Use cache hook instead of manual state management (only if not in demo mode)
  const {
    personas: cachedPersonas,
    isLoadingPersonas,
    isGeneratingPersonas,
    hasError,
    personasError,
    generationError,
    generatePersonas,
    refetchPersonas
  } = usePersonasCache({
    customerId: userId,
    enabled: !!userId && !isDemo // Disable API calls in demo mode
  })

  // Use direct personas if in demo mode, otherwise use cached personas
  const personas = isDemo ? directPersonas : cachedPersonas

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
  const transformedPersonas: BuyerPersona[] = (personas || []).map((persona: any, index: number) => ({
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
      values: Array.isArray(persona.psychographics.values)
        ? persona.psychographics.values.join(', ')
        : (persona.psychographics.values || persona.psychographics.goals?.join(', ') || 'Professional growth and efficiency'),
      motivations: Array.isArray(persona.psychographics.motivations)
        ? persona.psychographics.motivations.join(', ')
        : (persona.psychographics.motivations || 'Achieving business objectives'),
      fears: Array.isArray(persona.psychographics.fears)
        ? persona.psychographics.fears.join(', ')
        : (persona.psychographics.fears || persona.psychographics.challenges?.join(', ') || 'Making wrong decisions')
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
      default: return 'bg-black/30 text-gray-400 border border-blue-800/30/50'
    }
  }

  return (
    <div className={`bg-[#1a2332] border border-transparent rounded-xl overflow-hidden ${className}`}>
      <div className="bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Target Buyer Personas</h2>
              {personas && personas.length > 0 && (
                <Tooltip
                  content={
                    <div className="max-w-xs">
                      <p className="text-sm text-white">
                        Use these personas to tailor your messaging, content, and sales approach. Focus on addressing their specific pain points and speaking their language to increase engagement and conversion rates.
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
              {isGeneratingPersonas ? 'Generating buyer personas...' : 
               hasError ? 'Error generating personas' :
               transformedPersonas.length > 0 ? `${transformedPersonas.length} personas generated • AI-powered with empathy mapping` : 
               'AI-generated buyer personas with empathy mapping and behavioral insights'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {/* Clear personas - handled by cache hook */}}
              className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear personas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {transformedPersonas.length > 0 && (
              <button
                onClick={handleExportPersonas}
                className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
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
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Generate Target Buyer Personas
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Create detailed buyer personas with empathy mapping, behavioral insights, and communication preferences based on your ICP data.
            </p>
            <button
              onClick={handleGeneratePersonas}
              disabled={isGeneratingPersonas}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-600/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
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
          <div className="mb-6 p-4 bg-blue-600/10 border border-brand-primary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              <div>
                <h4 className="text-sm font-semibold text-blue-500">
                  Generating Buyer Personas
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Analyzing your ICP data and creating detailed personas with empathy mapping...
                </p>
              </div>
            </div>
          </div>
        )}

        {personas && personas.length > 0 && (
          <div className="space-y-6">
              {transformedPersonas.map((persona, index) => {
                const isExpanded = expandedPersona === persona.id;
                const IconComponent = getPersonaIcon(persona.role);

                // Calculate confidence based on data completeness
                const hasGoals = persona.goals && persona.goals.length > 0;
                const hasPainPoints = persona.painPoints && persona.painPoints.length > 0;
                const hasObjections = persona.objections && persona.objections.length > 0;
                const hasDemographics = persona.demographics && Object.keys(persona.demographics).length > 0;
                const hasPsychographics = persona.psychographics && Object.keys(persona.psychographics).length > 0;

                const dataPoints = [hasGoals, hasPainPoints, hasObjections, hasDemographics, hasPsychographics];
                const collectedPoints = dataPoints.filter(Boolean).length;
                const confidence = Math.round((collectedPoints / dataPoints.length) * 100);

                return (
                  <div key={persona.id} className="bg-gray-800 rounded-lg overflow-hidden">

                    <button
                      onClick={() => togglePersona(persona.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-white">
                            {persona.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {persona.title} • {persona.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ConfidenceBadge
                          level={getConfidenceLevel(confidence)}
                          score={confidence}
                          showScore={true}
                          size="sm"
                          context={`Based on ${collectedPoints} of ${dataPoints.length} key data points collected`}
                        />
                        <DataPointsIndicator
                          collected={collectedPoints}
                          total={dataPoints.length}
                          size="sm"
                        />
                        {isExpanded ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-blue-800/30">
                        <div className="px-6 pb-6">
                            <div className="pt-6 space-y-6">
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    Demographics
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Age Range:</span>
                                      <span className="text-white">{persona.demographics.ageRange}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Experience:</span>
                                      <span className="text-white">{persona.demographics.experience}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Education:</span>
                                      <span className="text-white">{persona.demographics.education}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Location:</span>
                                      <span className="text-white">{persona.demographics.location}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-black rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-blue-500" />
                                    Psychographics
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Values:</span>
                                      <span className="text-white">{persona.psychographics.values}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Motivations:</span>
                                      <span className="text-white">{persona.psychographics.motivations}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Fears:</span>
                                      <span className="text-white">{persona.psychographics.fears}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-400" />
                                    Goals
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.goals.map((goal, goalIndex) => (
                                      <li key={goalIndex} className="text-sm text-white flex items-start gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                                        {goal}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-black rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    Pain Points
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.painPoints.map((painPoint, painIndex) => (
                                      <li key={painIndex} className="text-sm text-white flex items-start gap-2">
                                        <AlertTriangle className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" />
                                        {painPoint}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="bg-black rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-blue-500" />
                                  Buying Behavior
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Decision Process:</span>
                                    <p className="text-white mt-1">{persona.buyingBehavior.decisionProcess}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Timeline:</span>
                                    <p className="text-white mt-1">{persona.decisionInfluence.timeline}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Budget Authority:</span>
                                    <p className="text-white mt-1">{persona.decisionInfluence.budgetAuthority}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-black rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-blue-500" />
                                  Communication Preferences
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Preferred Channels:</span>
                                    <p className="text-white mt-1">{persona.communicationPreferences.preferredChannels.join(', ')}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Tone:</span>
                                    <p className="text-white mt-1">{persona.communicationPreferences.communicationStyle}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-white mb-3">
                                    Common Objections
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.objections.map((objection, objIndex) => (
                                      <li key={objIndex} className="text-sm text-white flex items-start gap-2">
                                        <span className="text-orange-400 mt-1">•</span>
                                        {objection}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-black rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-white mb-3">
                                    Information Sources
                                  </h4>
                                  <ul className="space-y-2">
                                    {persona.informationSources.map((source, srcIndex) => (
                                      <li key={srcIndex} className="text-sm text-white flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        {source}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
            })}
          </div>
        )}

        {/* Removed blue "Pro Tip" box - replaced with tooltip icon next to widget title */}
      </div>
    </div>
  );
};

