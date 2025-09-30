import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  MessageSquare 
} from 'lucide-react'

interface Demographics {
  ageRange: string
  experience: string
  education: string
  location: string
}

interface Psychographics {
  values: string
  motivations: string
  fears: string
}

interface BuyingBehavior {
  decisionProcess: string
}

interface DecisionInfluence {
  timeline: string
  budgetAuthority: string
}

interface CommunicationPreferences {
  preferredChannels: string[]
  communicationStyle: string
}

interface BuyerPersona {
  id: string
  name: string
  title: string
  role: string
  demographics: Demographics
  psychographics: Psychographics
  goals: string[]
  painPoints: string[]
  buyingBehavior: BuyingBehavior
  decisionInfluence: DecisionInfluence
  communicationPreferences: CommunicationPreferences
  objections: string[]
  informationSources: string[]
}

interface BuyerPersonasWidgetProps {
  onExport?: (personas: BuyerPersona[]) => void
  className?: string
}

export default function BuyerPersonasWidget({ 
  onExport, 
  className = '' 
}: BuyerPersonasWidgetProps) {
  const [personas, setPersonas] = useState<BuyerPersona[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null)

  const handleGeneratePersonas = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      console.log('👥 Starting buyer persona generation...')
      
      // First, get ICP data to use for persona generation
      const icpResponse = await fetch('/api/icp-analysis/current-user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      let icpData = null
      if (icpResponse.ok) {
        const icpResult = await icpResponse.json()
        if (icpResult.success && icpResult.icp) {
          icpData = icpResult.icp
          console.log('✅ ICP data loaded for persona generation')
        }
      }

      // Get product data if available
      const productResponse = await fetch('/api/products/current-user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      let productData = null
      if (productResponse.ok) {
        const productResult = await productResponse.json()
        if (productResult.success && productResult.product) {
          productData = productResult.product
          console.log('✅ Product data loaded for persona generation')
        }
      }

      // Call the real persona generation API
      const response = await fetch('/api/ai/generate-personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icpData: icpData || {
            companyName: 'Target Company',
            industry: 'Technology',
            companySize: '50-200 employees',
            painPoints: ['Scaling challenges', 'Technical debt', 'Team growth'],
            goals: ['Improve efficiency', 'Scale systems', 'Reduce costs']
          },
          productData: productData || {
            name: 'Your Product',
            description: 'A solution for your target market',
            features: ['Feature 1', 'Feature 2', 'Feature 3']
          },
          customerId: 'current-user'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate buyer personas')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Persona generation failed')
      }

      // Transform the API response to match our component's expected format
      const transformedPersonas = result.data.personas.map((persona: any, index: number) => ({
        id: `persona-${index + 1}`,
        name: persona.name,
        title: persona.title,
        role: persona.role,
        demographics: {
          ageRange: persona.demographics?.ageRange || '30-50',
          experience: persona.demographics?.experience || '5-15 years',
          education: persona.demographics?.education || 'Bachelor\'s degree',
          location: persona.demographics?.location || 'Major metropolitan areas'
        },
        psychographics: {
          values: persona.psychographics?.values || 'Professional growth and efficiency',
          motivations: persona.psychographics?.motivations || 'Achieving business objectives',
          fears: persona.psychographics?.fears || 'Making wrong decisions'
        },
        goals: persona.goals || ['Improve efficiency', 'Drive growth', 'Reduce costs'],
        painPoints: persona.painPoints || ['Current limitations', 'Process inefficiencies', 'Resource constraints'],
        buyingBehavior: {
          decisionProcess: persona.buyingBehavior?.decisionProcess || 'Data-driven evaluation',
          timeline: persona.buyingBehavior?.timeline || '3-6 months',
          budgetAuthority: persona.buyingBehavior?.budgetAuthority || 'Medium'
        },
        decisionInfluence: {
          timeline: persona.buyingBehavior?.timeline || '3-6 months',
          budgetAuthority: persona.buyingBehavior?.budgetAuthority || 'Medium',
          priority: persona.decisionInfluence?.priority || 'High',
          influenceLevel: persona.decisionInfluence?.influenceLevel || 'High'
        },
        communicationPreferences: {
          preferredChannels: persona.communicationPreferences?.channels || ['Email', 'LinkedIn', 'Phone calls'],
          communicationStyle: persona.communicationPreferences?.tone || 'Professional and data-driven'
        },
        objections: persona.objections || ['Cost concerns', 'Implementation complexity', 'Change management'],
        informationSources: persona.informationSources || ['Industry publications', 'Peer networks', 'Online research'],
        technologyUsage: {
          currentTools: persona.technologyUsage?.currentTools || ['Current business tools'],
          techComfort: persona.technologyUsage?.techComfort || 'Medium',
          adoptionStyle: persona.technologyUsage?.adoptionStyle || 'Mainstream'
        }
      }))

      setPersonas(transformedPersonas)
      console.log(`✅ Generated ${transformedPersonas.length} buyer personas successfully`)
      
    } catch (error) {
      console.error('❌ Persona generation failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate buyer personas. Please try again.'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePersona = (personaId: string) => {
    setExpandedPersona(expandedPersona === personaId ? null : personaId)
  }

  const loadExistingPersonas = async () => {
    try {
      console.log('📊 Loading existing personas...')
      const response = await fetch('/api/personas/current-user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.personas) {
          setPersonas(result.personas)
          console.log('✅ Existing personas loaded:', result.personas.length)
        }
      }
    } catch (error) {
      console.log('ℹ️ No existing personas found or failed to load')
    }
  }

  const handleExportPersonas = async () => {
    if (personas.length === 0) {
      setError('No personas to export. Generate personas first.')
      return
    }

    try {
      console.log('📤 Exporting personas...')
      const response = await fetch('/api/export/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: 'pdf',
          personas: personas,
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
      setError('Failed to export personas. Please try again.')
    }
  }

  // Load existing personas on component mount
  useEffect(() => {
    loadExistingPersonas()
  }, [])

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
      default: return 'bg-gray-900/30 text-gray-400 border border-gray-700/50'
    }
  }

  return (
    <div className={`bg-background-secondary border border-border-standard rounded-xl overflow-hidden ${className}`}>
      <div className="bg-background-tertiary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Target Buyer Personas</h2>
            <p className="text-text-muted text-sm">
              {isGenerating ? 'Generating buyer personas...' : 
               error ? 'Error generating personas' :
               personas.length > 0 ? `${personas.length} personas generated • AI-powered with empathy mapping` : 
               'AI-generated buyer personas with empathy mapping and behavioral insights'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPersonas([])}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              title="Clear personas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {personas.length > 0 && (
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
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-800 text-sm">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
        {personas.length === 0 && (
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
              disabled={isGenerating}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isGenerating ? (
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

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-1">
                  Generation Failed
                </h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
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
              {personas.map((persona, index) => {
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
                          <div className="px-6 pb-6 border-t border-border-standard">
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
                                        <span className="text-blue-400 mt-1">•</span>
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

        {personas.length > 0 && (
          <div className="mt-6 p-4 bg-brand-primary/10 rounded-lg">
            <h4 className="text-sm font-semibold text-brand-primary mb-2">
              💡 Pro Tip
            </h4>
            <p className="text-xs text-text-muted">
              Use these personas to tailor your messaging, content, and sales approach. Focus on addressing their specific pain points and speaking their language to increase engagement and conversion rates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

