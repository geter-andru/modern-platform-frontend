'use client';

import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { useSystematicScaling } from '@/src/shared/contexts/SystematicScalingContext';
import resourceGenerationService from '@/app/lib/services/resourceGenerationService';
import { 
  FileText, 
  Download, 
  Eye, 
  Lock, 
  Star,
  TrendingUp,
  Users,
  Target,
  Brain,
  Briefcase,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  category: 'core' | 'advanced' | 'strategic';
  type: string;
  description: string;
  competencyRequired?: number;
  arrRequired?: string;
  exportFormats: string[];
  generatedAt?: Date;
  quality?: number;
  icon: React.ComponentType<{ className?: string }>;
  isLocked: boolean;
  lockReason?: string;
}

interface GeneratedResource {
  id: string;
  content: string;
  quality: number;
  generationMethod: 'template' | 'enhanced' | 'premium';
  cost: number;
  duration: number;
  sources: string[];
  confidence: number;
  generatedAt: Date;
}

interface ResourceGenerationState {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  error?: string;
}

interface ResourceLibraryProps {
  customerId: string;
  customerData: any;
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ customerId, customerData }) => {
  const { 
    getCompetencyLevel, 
    trackBehavior,
    awardPoints,
    getScalingInsights 
  } = useSystematicScaling();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'advanced' | 'strategic'>('all');
  const [generationState, setGenerationState] = useState<Record<string, ResourceGenerationState>>({});
  const [generatedResources, setGeneratedResources] = useState<Record<string, GeneratedResource>>({});
  
  // Load generated resources from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`resources_${customerId}`);
    if (stored) {
      try {
        const parsedResources = JSON.parse(stored);
        setGeneratedResources(parsedResources);
      } catch (error) {
        console.warn('Failed to load stored resources:', error);
      }
    }
  }, [customerId]);

  const currentARR = customerData?.currentARR || '$2M';
  const strategicPlanningLevel = getCompetencyLevel('strategic_planning')?.level || 1;
  const customerAnalysisLevel = getCompetencyLevel('customer_analysis')?.level || 1;
  const financialAnalysisLevel = getCompetencyLevel('financial_analysis')?.level || 1;

  // Define all available resources with systematic scaling requirements
  const resources: Resource[] = [
    // Core Resources - Available immediately
    {
      id: 'icp-analysis',
      title: 'ICP Analysis Document',
      category: 'core',
      type: 'Customer Intelligence',
      description: 'Comprehensive ideal customer profile with market segments, pain points, and buying triggers',
      icon: Target,
      exportFormats: ['PDF', 'Google Docs', 'Salesforce', 'HubSpot'],
      quality: Math.min(60 + customerAnalysisLevel * 10, 100),
      isLocked: false
    },
    {
      id: 'buyer-personas',
      title: 'Buyer Personas',
      category: 'core',
      type: 'Customer Intelligence',
      description: 'Detailed profiles of decision makers, influencers, and end users with empathy maps',
      icon: Users,
      exportFormats: ['PDF', 'PowerPoint', 'Notion', 'Slack'],
      quality: Math.min(60 + customerAnalysisLevel * 10, 100),
      isLocked: false
    },
    {
      id: 'empathy-maps',
      title: 'Empathy Maps',
      category: 'core',
      type: 'Customer Psychology',
      description: 'Visual representation of what customers think, feel, see, say, and do',
      icon: Brain,
      exportFormats: ['Miro', 'Figma', 'PDF', 'PNG'],
      quality: Math.min(60 + customerAnalysisLevel * 10, 100),
      isLocked: false
    },
    {
      id: 'product-market-fit',
      title: 'Product-Market Fit Assessment',
      category: 'core',
      type: 'Market Analysis',
      description: 'Evaluation of product alignment with market needs and growth potential',
      icon: TrendingUp,
      exportFormats: ['PDF', 'Excel', 'Google Sheets', 'Airtable'],
      quality: Math.min(60 + strategicPlanningLevel * 10, 100),
      isLocked: false
    },
    
    // Advanced Resources - Require competency level 2+
    {
      id: 'technical-translation',
      title: 'Technical Translation Guide',
      category: 'advanced',
      type: 'Sales Enablement',
      description: 'Convert complex technical features into business value propositions',
      icon: FileText,
      competencyRequired: 2,
      exportFormats: ['Claude AI', 'ChatGPT', 'Google Docs', 'Confluence'],
      quality: Math.min(70 + strategicPlanningLevel * 10, 100),
      isLocked: strategicPlanningLevel < 2,
      lockReason: 'Reach Strategic Planning Level 2 to unlock'
    },
    {
      id: 'stakeholder-arsenal',
      title: 'Stakeholder Arsenal',
      category: 'advanced',
      type: 'Sales Enablement',
      description: 'Role-specific materials for CFO, CTO, CEO, and department heads',
      icon: Briefcase,
      competencyRequired: 2,
      exportFormats: ['PowerPoint', 'PDF', 'Salesforce', 'Outreach'],
      quality: Math.min(70 + strategicPlanningLevel * 10, 100),
      isLocked: strategicPlanningLevel < 2,
      lockReason: 'Reach Strategic Planning Level 2 to unlock'
    },
    {
      id: 'competitive-intelligence',
      title: 'Competitive Intelligence Report',
      category: 'advanced',
      type: 'Market Analysis',
      description: 'Detailed competitive landscape analysis with positioning strategies',
      icon: Target,
      competencyRequired: 3,
      exportFormats: ['PDF', 'Notion', 'Google Docs', 'Slack'],
      quality: Math.min(70 + customerAnalysisLevel * 10, 100),
      isLocked: customerAnalysisLevel < 3,
      lockReason: 'Reach Customer Analysis Level 3 to unlock'
    },
    {
      id: 'market-opportunity',
      title: 'Market Opportunity Analysis',
      category: 'advanced',
      type: 'Strategic Planning',
      description: 'TAM, SAM, SOM analysis with growth projections and entry strategies',
      icon: TrendingUp,
      competencyRequired: 3,
      exportFormats: ['Excel', 'Google Sheets', 'PDF', 'PowerPoint'],
      quality: Math.min(70 + financialAnalysisLevel * 10, 100),
      isLocked: financialAnalysisLevel < 3,
      lockReason: 'Reach Financial Analysis Level 3 to unlock'
    },
    
    // Strategic Resources - Require $5M+ ARR or Level 4+ competency
    {
      id: 'executive-business-case',
      title: 'Executive Business Case',
      category: 'strategic',
      type: 'Board Materials',
      description: 'Board-ready business case with financial projections and strategic rationale',
      icon: Briefcase,
      arrRequired: '$5M',
      competencyRequired: 4,
      exportFormats: ['PowerPoint', 'PDF', 'Google Slides', 'Keynote'],
      quality: Math.min(80 + strategicPlanningLevel * 10, 100),
      isLocked: currentARR < '$5M' || strategicPlanningLevel < 4,
      lockReason: currentARR < '$5M' ? 'Requires $5M+ ARR' : 'Reach Strategic Planning Level 4'
    },
    {
      id: 'roi-models',
      title: 'ROI Models & Calculators',
      category: 'strategic',
      type: 'Financial Tools',
      description: 'Interactive ROI calculators with sensitivity analysis and scenarios',
      icon: TrendingUp,
      arrRequired: '$5M',
      competencyRequired: 4,
      exportFormats: ['Excel', 'Google Sheets', 'Tableau', 'Power BI'],
      quality: Math.min(80 + financialAnalysisLevel * 10, 100),
      isLocked: currentARR < '$5M' || financialAnalysisLevel < 4,
      lockReason: currentARR < '$5M' ? 'Requires $5M+ ARR' : 'Reach Financial Analysis Level 4'
    },
    {
      id: 'board-presentation',
      title: 'Board Presentation Template',
      category: 'strategic',
      type: 'Board Materials',
      description: 'Professional board deck template with revenue intelligence insights',
      icon: FileText,
      arrRequired: '$7M',
      competencyRequired: 5,
      exportFormats: ['PowerPoint', 'Keynote', 'Google Slides', 'PDF'],
      quality: Math.min(90 + strategicPlanningLevel * 10, 100),
      isLocked: currentARR < '$7M' || strategicPlanningLevel < 5,
      lockReason: currentARR < '$7M' ? 'Requires $7M+ ARR' : 'Reach Strategic Planning Level 5'
    },
    {
      id: 'series-b-readiness',
      title: 'Series B Readiness Report',
      category: 'strategic',
      type: 'Fundraising',
      description: 'Comprehensive assessment of Series B readiness with investor materials',
      icon: Star,
      arrRequired: '$10M',
      competencyRequired: 6,
      exportFormats: ['PDF', 'Notion', 'DocSend', 'Pitch'],
      quality: 100,
      isLocked: currentARR < '$10M' || strategicPlanningLevel < 6,
      lockReason: currentARR < '$10M' ? 'Requires $10M+ ARR' : 'Master level required'
    }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  const handleGenerateResource = async (resource: Resource) => {
    if (resource.isLocked) return;
    
    // Set initial generation state
    setGenerationState(prev => ({
      ...prev,
      [resource.id]: {
        isGenerating: true,
        progress: 0,
        currentStep: 'Initializing resource generation...'
      }
    }));
    
    try {
      // Track systematic scaling behavior
      await trackBehavior({
        eventType: 'export_action',
        metadata: {
          resourceId: resource.id,
          resourceCategory: resource.category,
          quality: resource.quality
        },
        scalingContext: {
          currentARR,
          targetARR: customerData?.targetARR || '$10M',
          growthStage: currentARR < '$5M' ? 'early_scaling' : currentARR < '$7M' ? 'rapid_scaling' : 'mature_scaling',
          systematicApproach: true
        },
        businessImpact: resource.category === 'strategic' ? 'high' : resource.category === 'advanced' ? 'medium' : 'low',
        professionalCredibility: resource.quality || 70
      });

      // Update progress: Analyzing complexity
      setGenerationState(prev => ({
        ...prev,
        [resource.id]: {
          ...prev[resource.id],
          progress: 20,
          currentStep: 'Analyzing resource complexity...'
        }
      }));

      // Call the real resource generation service
      const generationResult = await resourceGenerationService.generateResource({
        resourceId: resource.id,
        resourceType: resource.type,
        customerData,
        productContext: customerData?.productContext,
        stakeholderContext: customerData?.stakeholderContext
      });

      // Update progress: Generation complete
      setGenerationState(prev => ({
        ...prev,
        [resource.id]: {
          ...prev[resource.id],
          progress: 80,
          currentStep: 'Finalizing resource...'
        }
      }));

      // Create generated resource object
      const generatedResource: GeneratedResource = {
        id: resource.id,
        content: generationResult.content,
        quality: generationResult.quality,
        generationMethod: generationResult.generationMethod,
        cost: generationResult.cost,
        duration: generationResult.duration,
        sources: generationResult.sources,
        confidence: generationResult.confidence,
        generatedAt: new Date()
      };

      // Update generated resources
      const updatedResources = {
        ...generatedResources,
        [resource.id]: generatedResource
      };
      
      setGeneratedResources(updatedResources);
      localStorage.setItem(`resources_${customerId}`, JSON.stringify(updatedResources));
      
      // Award competency points based on resource category and quality
      const pointsMap = {
        core: 10,
        advanced: 20,
        strategic: 30
      };
      
      const competencyMap = {
        'Customer Intelligence': 'customer_analysis',
        'Sales Enablement': 'strategic_planning',
        'Financial Tools': 'financial_analysis',
        'Board Materials': 'strategic_planning',
        'Market Analysis': 'customer_analysis',
        'Strategic Planning': 'strategic_planning',
        'Customer Psychology': 'customer_analysis',
        'Fundraising': 'strategic_planning'
      };
      
      const competencyArea = competencyMap[resource.type as keyof typeof competencyMap] || 'strategic_planning';
      
      // Bonus points for higher quality results
      const qualityBonus = Math.floor(generationResult.quality / 20);
      const totalPoints = pointsMap[resource.category] + qualityBonus;
      
      await awardPoints(
        competencyArea,
        totalPoints,
        {
          title: `Generated ${resource.title}`,
          description: `Created ${resource.type} resource using ${generationResult.generationMethod} method (${generationResult.quality}% quality)`,
          category: competencyArea,
          impact: `Enhanced ${resource.type.toLowerCase()} capabilities with ${generationResult.sources.join(', ')} intelligence`,
          metrics: {
            resourceQuality: generationResult.quality,
            generationMethod: generationResult.generationMethod,
            cost: generationResult.cost,
            duration: generationResult.duration,
            confidence: generationResult.confidence
          }
        }
      );
      
      // Complete generation
      setGenerationState(prev => ({
        ...prev,
        [resource.id]: {
          ...prev[resource.id],
          progress: 100,
          currentStep: 'Resource generated successfully!',
          isGenerating: false
        }
      }));

      // Clear generation state after delay
      setTimeout(() => {
        setGenerationState(prev => {
          const newState = { ...prev };
          delete newState[resource.id];
          return newState;
        });
      }, 3000);

    } catch (error: any) {
      console.error('Resource generation failed:', error);
      
      setGenerationState(prev => ({
        ...prev,
        [resource.id]: {
          ...prev[resource.id],
          progress: 0,
          currentStep: 'Generation failed',
          isGenerating: false,
          error: error.message || 'Unknown error occurred'
        }
      }));

      // Clear error state after delay
      setTimeout(() => {
        setGenerationState(prev => {
          const newState = { ...prev };
          delete newState[resource.id];
          return newState;
        });
      }, 5000);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'blue';
      case 'advanced': return 'purple';
      case 'strategic': return 'emerald';
      default: return 'slate';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Systematic Scaling Status */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Systematic Resource Generation Active</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-slate-400">Current ARR: <span className="text-white font-semibold">{currentARR}</span></span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-400">Resource Quality: <span className="text-purple-400 font-semibold">Level {Math.max(strategicPlanningLevel, customerAnalysisLevel, financialAnalysisLevel)}</span></span>
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            AI-Generated Resources Library
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Export-ready intelligence assets for CRM, sales automation, and stakeholder engagement
          </p>
          <p className="text-slate-400 text-sm">
            Higher competency levels unlock advanced resources with better quality
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center space-x-4">
          {[
            { id: 'all', label: 'All Resources', count: resources.length },
            { id: 'core', label: 'Core Resources', count: resources.filter(r => r.category === 'core').length },
            { id: 'advanced', label: 'Advanced Resources', count: resources.filter(r => r.category === 'advanced').length },
            { id: 'strategic', label: 'Strategic Resources', count: resources.filter(r => r.category === 'strategic').length }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
              <span className="ml-2 text-sm opacity-75">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            const color = getCategoryColor(resource.category);
            const isGenerated = generatedResources[resource.id] !== undefined;
            const generatedResource = generatedResources[resource.id];
            const currentGenerationState = generationState[resource.id];
            const isGenerating = currentGenerationState?.isGenerating || false;
            
            return (
              <ModernCard key={resource.id} className={`p-6 ${resource.isLocked ? 'opacity-60' : ''}`}>
                {/* Resource Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${color}-900/20 border border-${color}-700/50`}>
                      <Icon className={`w-5 h-5 text-${color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                      <p className="text-xs text-slate-400">{resource.type}</p>
                    </div>
                  </div>
                  {resource.isLocked && <Lock className="w-4 h-4 text-red-400" />}
                  {isGenerated && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>

                {/* Resource Description */}
                <p className="text-sm text-slate-300 mb-4">{resource.description}</p>

                {/* Quality Indicator */}
                {!resource.isLocked && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Quality Score</span>
                      <span className="text-xs text-white font-semibold">{resource.quality}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full transition-all duration-1000`}
                        style={{ width: `${resource.quality}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Lock Reason or Export Formats */}
                {resource.isLocked ? (
                  <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg mb-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-300">{resource.lockReason}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-2">Export formats:</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.exportFormats.map((format) => (
                        <span 
                          key={format}
                          className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generation Progress */}
                {isGenerating && currentGenerationState && (
                  <div className="mb-4 p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-purple-300 font-medium">
                        {currentGenerationState.currentStep}
                      </span>
                      <span className="text-xs text-purple-400">
                        {currentGenerationState.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentGenerationState.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Generation Error */}
                {currentGenerationState?.error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-300">{currentGenerationState.error}</p>
                    </div>
                  </div>
                )}

                {/* Generated Resource Info */}
                {isGenerated && generatedResource && (
                  <div className="mb-4 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-green-300 font-medium">
                        Generated via {generatedResource.generationMethod}
                      </span>
                      <div className="flex items-center space-x-2">
                        {generatedResource.generationMethod === 'premium' && <Star className="w-3 h-3 text-yellow-400" />}
                        {generatedResource.generationMethod === 'enhanced' && <Zap className="w-3 h-3 text-purple-400" />}
                        {generatedResource.generationMethod === 'template' && <Clock className="w-3 h-3 text-blue-400" />}
                        <span className="text-xs text-green-400">
                          {generatedResource.quality}% quality
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-green-400 mb-1">
                      Sources: {generatedResource.sources.join(', ')}
                    </div>
                    <div className="text-xs text-slate-400">
                      Cost: ${generatedResource.cost.toFixed(2)} • Duration: {generatedResource.duration}ms • Confidence: {Math.round(generatedResource.confidence * 100)}%
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateResource(resource)}
                    disabled={resource.isLocked || isGenerating}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                      resource.isLocked
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : isGenerated
                        ? 'bg-green-900/20 border border-green-700/50 text-green-400 hover:bg-green-900/30'
                        : `bg-gradient-to-r from-${color}-600 to-${color}-700 text-white hover:from-${color}-700 hover:to-${color}-800`
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : isGenerated ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Regenerate</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                  {isGenerated && !resource.isLocked && (
                    <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </ModernCard>
            );
          })}
        </div>

        {/* Bottom Progress Summary */}
        <ModernCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Your Resource Generation Progress</h3>
              <p className="text-sm text-slate-400">
                Generated {Object.keys(generatedResources).length} of {resources.length} available resources
              </p>
              {Object.keys(generatedResources).length > 0 && (
                <div className="mt-2 text-xs text-slate-400">
                  Generation methods used: {
                    Array.from(new Set(Object.values(generatedResources).map(r => r.generationMethod)))
                      .map(method => {
                        const count = Object.values(generatedResources).filter(r => r.generationMethod === method).length;
                        return `${method} (${count})`;
                      })
                      .join(', ')
                  }
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((Object.keys(generatedResources).length / resources.length) * 100)}%
              </div>
              <p className="text-xs text-slate-400">Complete</p>
              {Object.keys(generatedResources).length > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  Avg Quality: {Math.round(
                    Object.values(generatedResources).reduce((sum, r) => sum + r.quality, 0) / 
                    Object.values(generatedResources).length
                  )}%
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${(Object.keys(generatedResources).length / resources.length) * 100}%` }}
            />
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default ResourceLibrary;