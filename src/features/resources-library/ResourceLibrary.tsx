'use client';

import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { useSystematicScaling } from '@/src/shared/contexts/SystematicScalingContext';
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
  Zap,
  Layers,
  BookOpen,
  Sparkles
} from 'lucide-react';

// Strategic Asset from backend
interface StrategicAsset {
  id: string;
  assetNumber: number;
  title: string;
  description: string;
  category: string;
  tier: 'foundation' | 'growth' | 'enterprise';
  unlockThreshold: {
    milestone: string;
    progress: number;
  };
  estimatedGenerationTime: string;
  consultingEquivalent: string;
  implementationGuidesCount: number;
}

// Generated Asset Response
interface GeneratedAsset {
  assetId: string;
  assetNumber: number;
  title: string;
  description: string;
  tier: string;
  category: string;
  strategicResources: Array<{
    resourceId: string;
    type: string;
    content: any;
    metadata: {
      generatedAt: string;
      model: string;
      tokens: any;
      generationTimeMs: number;
      cost: number;
      cumulativeDepth: number;
    };
  }>;
  implementationResources: Array<{
    resourceId: string;
    type: string;
    content: any;
    metadata: {
      generatedAt: string;
      model: string;
      tokens: any;
      generationTimeMs: number;
      cost: number;
      cumulativeDepth: number;
    };
  }>;
  metadata: {
    generatedAt: string;
    generationTimeMs: number;
    userId: string;
    totalCost: number;
    cumulativeDepth: number;
  };
}

interface GenerationProgress {
  stage: string;
  progress: number;
  promptId?: string;
  implId?: string;
  asset?: GeneratedAsset;
  final?: boolean;
}

interface ResourceLibraryProps {
  customerId: string;
  customerData: any;
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ customerId, customerData }) => {
  const {
    trackBehavior,
    awardPoints
  } = useSystematicScaling();

  const [selectedTier, setSelectedTier] = useState<'all' | 'foundation' | 'growth' | 'enterprise'>('all');
  const [catalog, setCatalog] = useState<StrategicAsset[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<Record<string, GeneratedAsset>>({});
  const [generationProgress, setGenerationProgress] = useState<Record<string, GenerationProgress>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);

  // Fetch catalog on mount
  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const response = await fetch('/api/resources/catalog');
      const data = await response.json();

      if (data.success) {
        setCatalog(data.data.catalog);
      }
    } catch (error) {
      console.error('Failed to fetch catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if asset is unlocked based on milestone progress
  const isAssetUnlocked = (asset: StrategicAsset): boolean => {
    // For now, unlock all foundation assets
    if (asset.tier === 'foundation') return true;

    // For now, unlock all assets (milestone system to be implemented)
    // TODO: Implement milestone progress checking
    return true;
  };

  // Generate single asset
  const handleGenerateAsset = async (asset: StrategicAsset) => {
    if (!isAssetUnlocked(asset)) return;

    setIsGenerating(prev => ({ ...prev, [asset.id]: true }));
    setGenerationProgress(prev => ({
      ...prev,
      [asset.id]: { stage: 'initializing', progress: 0 }
    }));

    try {
      // Track systematic scaling behavior
      await (trackBehavior as any)({
        eventType: 'resource_generation',
        metadata: {
          assetId: asset.id,
          assetNumber: asset.assetNumber,
          tier: asset.tier,
          category: asset.category
        },
        businessImpact: asset.tier === 'enterprise' ? 'high' : asset.tier === 'growth' ? 'medium' : 'low'
      });

      // Call backend generation endpoint with streaming
      const response = await fetch('/api/resources/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          assetId: asset.id,
          streaming: true
        })
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      // Handle Server-Sent Events streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));

              if (data.final) {
                // Final result received
                setGeneratedAssets(prev => ({
                  ...prev,
                  [asset.id]: data.data
                }));

                // Award points
                const pointsMap = {
                  foundation: 25,
                  growth: 50,
                  enterprise: 100
                };

                await (awardPoints as any)(
                  'strategic_planning',
                  pointsMap[asset.tier],
                  {
                    title: `Generated ${asset.title}`,
                    description: `Created strategic asset with ${data.data.metadata.cumulativeDepth}x personalization depth`,
                    category: 'strategic_planning',
                    impact: `Generated ${asset.implementationGuidesCount} implementation guides`,
                    metrics: {
                      generationTime: data.data.metadata.generationTimeMs,
                      cost: data.data.metadata.totalCost,
                      cumulativeDepth: data.data.metadata.cumulativeDepth
                    }
                  }
                );
              } else {
                // Progress update
                setGenerationProgress(prev => ({
                  ...prev,
                  [asset.id]: data
                }));
              }
            }
          }
        }
      }

      setIsGenerating(prev => ({ ...prev, [asset.id]: false }));

      // Clear progress after delay
      setTimeout(() => {
        setGenerationProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[asset.id];
          return newProgress;
        });
      }, 2000);

    } catch (error: any) {
      console.error('Asset generation failed:', error);
      setIsGenerating(prev => ({ ...prev, [asset.id]: false }));
      setGenerationProgress(prev => ({
        ...prev,
        [asset.id]: {
          stage: 'error',
          progress: 0
        }
      }));
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      'Market & Positioning Intelligence': Target,
      'Go-to-Market Strategy': TrendingUp,
      'Sales & Revenue Optimization': Briefcase,
      'Customer Success & Expansion': Users,
      'Strategic Planning & Execution': Brain,
      'Board & Investor Relations': Star
    };
    return iconMap[category] || FileText;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'foundation': return 'blue';
      case 'growth': return 'purple';
      case 'enterprise': return 'emerald';
      default: return 'slate';
    }
  };

  const filteredAssets = selectedTier === 'all'
    ? catalog
    : catalog.filter(a => a.tier === selectedTier);

  if (loading) {
    return (
      <div className="bg-slate-950 p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Strategic Assets Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-full border border-purple-700/50">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">AI-Powered Revenue Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            38 Strategic Assets Library
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Personalized revenue intelligence resources with cumulative intelligence depth
          </p>
          <p className="text-slate-400 text-sm">
            Each asset includes strategic framework + tactical implementation guides
          </p>
        </div>

        {/* Tier Filter */}
        <div className="flex justify-center space-x-4">
          {[
            { id: 'all', label: 'All Assets', count: catalog.length },
            { id: 'foundation', label: 'Foundation (25%)', count: catalog.filter(a => a.tier === 'foundation').length },
            { id: 'growth', label: 'Growth (50%)', count: catalog.filter(a => a.tier === 'growth').length },
            { id: 'enterprise', label: 'Enterprise (75-100%)', count: catalog.filter(a => a.tier === 'enterprise').length }
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedTier === tier.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tier.label}
              <span className="ml-2 text-sm opacity-75">({tier.count})</span>
            </button>
          ))}
        </div>

        {/* Progress Summary */}
        <ModernCard className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Your Generation Progress</h3>
              <p className="text-sm text-slate-400">
                Generated {Object.keys(generatedAssets).length} of {catalog.length} strategic assets
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">
                {Math.round((Object.keys(generatedAssets).length / catalog.length) * 100)}%
              </div>
              <p className="text-xs text-slate-400">Complete</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${(Object.keys(generatedAssets).length / catalog.length) * 100}%` }}
            />
          </div>
        </ModernCard>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            const Icon = getCategoryIcon(asset.category);
            const color = getTierColor(asset.tier);
            const isUnlocked = isAssetUnlocked(asset);
            const isGenerated = generatedAssets[asset.id] !== undefined;
            const generatedAsset = generatedAssets[asset.id];
            const progress = generationProgress[asset.id];
            const generating = isGenerating[asset.id];

            return (
              <ModernCard
                key={asset.id}
                className={`p-6 transition-all duration-200 ${
                  !isUnlocked ? 'opacity-60' : 'hover:shadow-lg hover:shadow-purple-500/10'
                }`}
              >
                {/* Asset Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      color === 'purple'
                        ? 'bg-purple-900/30 border border-purple-700/50'
                        : color === 'blue'
                        ? 'bg-blue-900/30 border border-blue-700/50'
                        : 'bg-emerald-900/30 border border-emerald-700/50'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        color === 'purple'
                          ? 'text-purple-400'
                          : color === 'blue'
                          ? 'text-blue-400'
                          : 'text-emerald-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500 font-mono">#{asset.assetNumber}</span>
                        {isGenerated && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {!isUnlocked && <Lock className="w-4 h-4 text-red-400" />}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{asset.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Asset Description */}
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">{asset.description}</p>

                {/* Tier Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    color === 'purple'
                      ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50'
                      : color === 'blue'
                      ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50'
                      : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
                  }`}>
                    {asset.tier.toUpperCase()} TIER
                  </span>
                  <span className="text-xs text-slate-400">
                    {asset.implementationGuidesCount} guides
                  </span>
                </div>

                {/* Unlock Requirement or Metadata */}
                {!isUnlocked ? (
                  <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg mb-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-300">
                        Unlocks at {asset.unlockThreshold.progress}% milestone progress
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Generation Time:</span>
                      <span className="text-slate-300">{asset.estimatedGenerationTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Consulting Value:</span>
                      <span className="text-green-400 font-semibold">{asset.consultingEquivalent}</span>
                    </div>
                  </div>
                )}

                {/* Generation Progress */}
                {generating && progress && (
                  <div className="mb-4 p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-purple-300 font-medium">
                        {progress.stage === 'generating_strategic' ? 'Generating strategic framework...' :
                         progress.stage === 'generating_implementation' ? 'Generating implementation guides...' :
                         progress.stage === 'complete' ? 'Complete!' :
                         'Initializing...'}
                      </span>
                      <span className="text-xs text-purple-400">
                        {Math.round(progress.progress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Generated Asset Info */}
                {isGenerated && generatedAsset && (
                  <div className="mb-4 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-green-300 font-medium">
                        {generatedAsset.metadata.cumulativeDepth}x Personalization Depth
                      </span>
                      <Sparkles className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-green-400">
                        Strategic: {generatedAsset.strategicResources.length} • Implementation: {generatedAsset.implementationResources.length}
                      </div>
                      <div className="text-xs text-slate-400">
                        Generated in {(generatedAsset.metadata.generationTimeMs / 1000).toFixed(1)}s
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateAsset(asset)}
                    disabled={!isUnlocked || generating}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                      !isUnlocked
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : generating
                        ? 'bg-purple-900/30 border border-purple-700/50 text-purple-400'
                        : isGenerated
                        ? 'bg-green-900/20 border border-green-700/50 text-green-400 hover:bg-green-900/30'
                        : `bg-gradient-to-r ${
                            color === 'purple' ? 'from-purple-600 to-purple-700' :
                            color === 'blue' ? 'from-blue-600 to-blue-700' :
                            'from-emerald-600 to-emerald-700'
                          } text-white hover:opacity-90`
                    }`}
                  >
                    {generating ? (
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
                  {isGenerated && (
                    <button
                      onClick={() => setSelectedAsset(generatedAsset)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </ModernCard>
            );
          })}
        </div>

        {/* Asset Detail Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <ModernCard className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedAsset.title}</h2>
                  <p className="text-sm text-slate-400">{selectedAsset.description}</p>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Strategic Resources */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>Strategic Framework</span>
                </h3>
                {selectedAsset.strategicResources.map((resource, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-300 whitespace-pre-wrap">
                      {typeof resource.content === 'object'
                        ? JSON.stringify(resource.content, null, 2)
                        : resource.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Implementation Resources */}
              {selectedAsset.implementationResources.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <span>Implementation Guides</span>
                  </h3>
                  {selectedAsset.implementationResources.map((resource, idx) => (
                    <div key={idx} className="mb-4 p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-sm font-semibold text-white mb-2">{resource.resourceId}</h4>
                      <div className="text-sm text-slate-300 whitespace-pre-wrap">
                        {typeof resource.content === 'object'
                          ? JSON.stringify(resource.content, null, 2)
                          : resource.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModernCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceLibrary;
