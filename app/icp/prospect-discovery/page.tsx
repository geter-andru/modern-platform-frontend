'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin, TrendingUp, ExternalLink, Linkedin, DollarSign, Users, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { api } from '@/app/lib/api/modern-client';
import toast, { Toaster } from 'react-hot-toast';
import { StaggeredItem } from '../../../src/shared/utils/staggered-entrance';
import type {
  Prospect,
  ProspectDiscoveryData,
  ProspectDiscoveryMetadata,
  ConfidenceTierDefinition
} from '../../../src/features/icp-analysis/types/prospect-discovery-types';
import { getConfidenceTier, CONFIDENCE_TIERS } from '../../../src/features/icp-analysis/types/prospect-discovery-types';

export default function ProspectDiscoveryPage() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [refinedProductDescription, setRefinedProductDescription] = useState('');
  const [coreCapability, setCoreCapability] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');

  // Results state
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [metadata, setMetadata] = useState<ProspectDiscoveryMetadata | null>(null);
  const [searchSummary, setSearchSummary] = useState<any>(null);

  const handleDiscoverProspects = async () => {
    if (!companyName || !refinedProductDescription || !coreCapability) {
      toast.error('Please fill in company name, product description, and core capability');
      return;
    }

    setIsGenerating(true);
    setShowResults(false);

    try {
      // Stage 1: Analyzing ICP
      setGenerationStage('Analyzing your ICP profile...');
      toast.loading('Analyzing your ICP profile...', { id: 'discover' });
      await new Promise(resolve => setTimeout(resolve, 800));

      // Stage 2: Web search
      setGenerationStage('Searching for matching companies (this may take 15-30s)...');
      toast.loading('Searching for matching companies...', { id: 'discover' });

      // Call backend API
      const response = await api.discoverProspects({
        companyName,
        refinedProductDescription,
        coreCapability,
        industry: industry || undefined,
        targetMarket: targetMarket || undefined
      });

      // Handle rate limiting
      if (!response.success && response.error?.includes('Rate limit')) {
        setIsGenerating(false);
        setGenerationStage('');
        toast.error('Daily limit reached (5 per 24 hours). Please try again tomorrow.', { id: 'discover' });
        return;
      }

      // Handle other errors
      if (!response.success) {
        throw new Error(response.error || 'Discovery failed');
      }

      // Stage 3: Validating results
      setGenerationStage('Validating prospect matches...');
      toast.loading('Validating prospect matches...', { id: 'discover' });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Store results
      const data = response.data as ProspectDiscoveryData;
      setProspects(data.prospects || []);
      setSearchSummary(data.searchSummary || null);
      setMetadata(response.metadata || null);

      // Success!
      setIsGenerating(false);
      setGenerationStage('');
      setShowResults(true);
      toast.success(`Discovered ${data.prospects?.length || 0} matching prospects!`, { id: 'discover' });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      setIsGenerating(false);
      setGenerationStage('');
      toast.error(error.message || 'Discovery failed. Please try again.', { id: 'discover' });
      console.error('Prospect discovery error:', error);
    }
  };

  const getConfidenceColor = (tier: ConfidenceTierDefinition) => {
    const colors: Record<string, string> = {
      emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      gray: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[tier.color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <StaggeredItem delay={0} animation="lift">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Prospect Discovery</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find 5-7 real companies matching your "Revenue Desert" ICP using AI-powered web search
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Claude AI + Web Search • 5 discoveries per 24 hours</span>
            </div>
          </div>
        </StaggeredItem>

        {/* Input Form */}
        <StaggeredItem delay={0.1} animation="slide">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-50">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Your ICP Profile</h2>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Acme Corp"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refined Product Description *
                  <span className="text-gray-500 font-normal ml-2">(from your generated ICP)</span>
                </label>
                <textarea
                  value={refinedProductDescription}
                  onChange={(e) => setRefinedProductDescription(e.target.value)}
                  placeholder="e.g., AI-powered revenue intelligence platform that helps technical B2B SaaS companies translate complex products into compelling business cases"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={isGenerating}
                />
                <p className="mt-1 text-sm text-gray-500">20-500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Core Capability *
                  <span className="text-gray-500 font-normal ml-2">(from your generated ICP)</span>
                </label>
                <input
                  type="text"
                  value={coreCapability}
                  onChange={(e) => setCoreCapability(e.target.value)}
                  placeholder="e.g., Transforms technical features into quantified business value using AI"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={isGenerating}
                />
                <p className="mt-1 text-sm text-gray-500">10-150 characters</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., B2B SaaS"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Market <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    placeholder="e.g., Enterprise Sales"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleDiscoverProspects}
              disabled={isGenerating || !companyName || !refinedProductDescription || !coreCapability}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>{generationStage || 'Discovering prospects...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Discover Matching Prospects</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {!user && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> You must be signed in to discover prospects. <Link href="/login" className="underline font-semibold">Sign in</Link> or <Link href="/signup" className="underline font-semibold">create an account</Link>.
                </p>
              </div>
            )}
          </div>
        </StaggeredItem>

        {/* Results Section */}
        {showResults && prospects.length > 0 && (
          <div id="results-section" className="space-y-8">
            {/* Search Summary */}
            {searchSummary && (
              <StaggeredItem delay={0} animation="lift">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Search Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Prospects Identified</p>
                        <p className="text-2xl font-bold text-gray-900">{searchSummary.totalProspectsIdentified}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg. Confidence</p>
                        <p className="text-2xl font-bold text-gray-900">{searchSummary.averageConfidenceRating.toFixed(1)}/10</p>
                      </div>
                    </div>
                  </div>
                  {searchSummary.strongestSignalPatterns && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Strongest Signal Patterns:</p>
                      <p className="text-sm text-blue-700">{searchSummary.strongestSignalPatterns}</p>
                    </div>
                  )}
                </div>
              </StaggeredItem>
            )}

            {/* Prospects Grid */}
            <div className="space-y-6">
              {prospects.map((prospect, index) => {
                const tier = getConfidenceTier(prospect.confidenceRating);
                return (
                  <StaggeredItem key={index} delay={0.1 * (index + 1)} animation="slide">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{prospect.companyName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(tier)}`}>
                              {tier.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {prospect.website && (
                              <div className="flex items-center gap-1">
                                <ExternalLink className="w-4 h-4" />
                                <a href={`https://${prospect.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline">
                                  {prospect.website}
                                </a>
                              </div>
                            )}
                            {prospect.headquarters && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{prospect.headquarters}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">{prospect.confidenceRating}/10</div>
                          <div className="text-sm text-gray-500">Confidence</div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Product Category</p>
                          <p className="text-sm text-gray-900">{prospect.productCategory}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Estimated Stage</p>
                          <p className="text-sm text-gray-900">{prospect.estimatedStage}</p>
                        </div>
                      </div>

                      {/* ICP Fit Evidence */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">ICP Fit Evidence:</p>
                        <ul className="space-y-2">
                          {prospect.icpFitEvidence.map((evidence, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span>{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Rating Justification */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Rating Justification:</p>
                        <p className="text-sm text-gray-700">{prospect.ratingJustification}</p>
                      </div>

                      {/* Evidence Links */}
                      {prospect.evidenceLinks && (
                        <div className="flex flex-wrap gap-2">
                          {prospect.evidenceLinks.linkedinCompany && prospect.evidenceLinks.linkedinCompany !== '#' && (
                            <a
                              href={prospect.evidenceLinks.linkedinCompany.startsWith('http') ? prospect.evidenceLinks.linkedinCompany : `https://${prospect.evidenceLinks.linkedinCompany}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                            >
                              <Linkedin className="w-4 h-4" />
                              Company Page
                            </a>
                          )}
                          {prospect.evidenceLinks.founderLinkedIn && prospect.evidenceLinks.founderLinkedIn !== '#' && (
                            <a
                              href={prospect.evidenceLinks.founderLinkedIn.startsWith('http') ? prospect.evidenceLinks.founderLinkedIn : `https://${prospect.evidenceLinks.founderLinkedIn}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                            >
                              <Linkedin className="w-4 h-4" />
                              Founder
                            </a>
                          )}
                          {prospect.evidenceLinks.fundingData && prospect.evidenceLinks.fundingData !== '#' && (
                            <a
                              href={prospect.evidenceLinks.fundingData.startsWith('http') ? prospect.evidenceLinks.fundingData : `https://${prospect.evidenceLinks.fundingData}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                            >
                              <DollarSign className="w-4 h-4" />
                              Funding Data
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </StaggeredItem>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
